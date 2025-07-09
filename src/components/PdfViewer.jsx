// src/components/PdfViewer.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Helper function for aggressive normalization
// In PdfViewer.jsx
const aggressiveNormalize = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove all non-alphanumeric characters (except spaces)
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim();
};

// NEW: Helper function to compare and highlight differences
const compareStringsAndHighlightDiff = (str1, str2) => {
    let diffStr = '';
    const minLength = Math.min(str1.length, str2.length);
    let firstDiffIndex = -1;

    for (let i = 0; i < minLength; i++) {
        if (str1[i] !== str2[i]) {
            if (firstDiffIndex === -1) {
                firstDiffIndex = i;
            }
            diffStr += `[${str1[i] || ' '}:${str2[i] || ' '}]`; // Indicate difference
        } else {
            diffStr += str1[i];
        }
    }

    // Append remaining parts if one string is longer than the other
    if (str1.length > minLength) {
        diffStr += ` (str1 extra: ${str1.substring(minLength)})`;
    } else if (str2.length > minLength) {
        diffStr += ` (str2 extra: ${str2.substring(minLength)})`;
    }

    return { diffStr, firstDiffIndex };
};


function PdfViewer({ pdfUrl, highlightCitationText }) {
    console.log('PdfViewer received highlightText (prop):', highlightCitationText);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [highlightedPage, setHighlightedPage] = useState(null);
    const [loadingText, setLoadingText] = useState(true);

    const normalizedHighlightText = aggressiveNormalize(highlightCitationText);

    console.log('Normalized highlight text (for comparison - aggressive):', normalizedHighlightText);

    useEffect(() => {
        const loadPdfAndFindHighlight = async () => {
            if (!pdfUrl) return;

            setLoadingText(true);
            setNumPages(null);
            setPageNumber(1);
            setHighlightedPage(null);

            try {
                const pdfDoc = await pdfjs.getDocument(pdfUrl).promise;
                const totalPages = pdfDoc.numPages;
                setNumPages(totalPages);

                let foundPage = null;

                for (let i = 1; i <= totalPages; i++) {
                    const page = await pdfDoc.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = aggressiveNormalize(
                        textContent.items.map(item => item.str).join(' ')
                    );

                    console.log(`--- Pre-loading text for page ${i} ---`);
                    console.log('Extracted page text (normalized, partial):', pageText.substring(0, 500));
                    console.log('Target highlight text (normalized):', normalizedHighlightText);
                    const doesInclude = pageText.includes(normalizedHighlightText);
                    console.log(`Does page ${i} include highlight text?`, doesInclude);

                    // NEW: Detailed comparison if includes() fails and it's the expected page
                    if (!doesInclude && i === 2) { // Assuming page 2 is where it should be
                        console.log("!!! Detailed Mismatch for Page 2 !!!");
                        // Find the potential start of the match in pageText
                        const likelyStartIndex = pageText.indexOf(normalizedHighlightText.substring(0, 20)); // Check first 20 chars
                        if (likelyStartIndex !== -1) {
                            const snippetPage = pageText.substring(likelyStartIndex, likelyStartIndex + normalizedHighlightText.length + 50); // Get a snippet from page text
                            const snippetHighlight = normalizedHighlightText;

                            const { diffStr, firstDiffIndex } = compareStringsAndHighlightDiff(snippetPage, snippetHighlight);
                            console.log("Comparison Snippet (PageText vs HighlightText):");
                            console.log("PageText Snippet :", snippetPage);
                            console.log("HighlightText    :", snippetHighlight);
                            console.log("Differences      :", diffStr);
                            console.log("First Difference at Index (in shorter string):", firstDiffIndex);
                        } else {
                            console.log("Initial snippet not even found, major mismatch or very different structure.");
                        }
                    }
                    // END NEW DEBUGGING


                    if (foundPage === null && normalizedHighlightText && doesInclude) {
                        foundPage = i;
                        console.log(`!!! Found highlight text on page ${foundPage} during pre-load !!!`);
                        setPageNumber(foundPage);
                        setHighlightedPage(foundPage);
                        break;
                    }
                }
            } catch (error) {
                console.error("Error loading PDF or extracting text:", error);
                setNumPages(0);
            } finally {
                setLoadingText(false);
            }
        };

        loadPdfAndFindHighlight();
    }, [pdfUrl, normalizedHighlightText]);

    return (
        <div className="flex flex-col h-full items-center">
            <div className="flex-grow overflow-auto w-full max-w-full">
                <Document
                    file={pdfUrl}
                    loading={loadingText ? "Loading PDF text for highlights..." : "Loading PDF..."}
                    error="Failed to load PDF."
                    noData="No PDF file specified."
                >
                    {numPages && (
                        <div className="relative mb-4">
                            <Page
                                pageNumber={pageNumber}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className={highlightedPage === pageNumber ? 'border-4 border-yellow-500 shadow-lg' : ''}
                            />
                        </div>
                    )}
                </Document>
            </div>

            {numPages && (
                <div className="flex justify-center items-center mt-4 p-2 bg-gray-100 rounded">
                    <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(prevPage => prevPage - 1)}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 mr-2"
                    >
                        Previous
                    </button>
                    <span>Page {pageNumber} of {numPages}</span>
                    <button
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber(prevPage => prevPage + 1)}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 ml-2"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default PdfViewer;