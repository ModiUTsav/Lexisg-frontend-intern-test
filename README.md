## Lexisg-frontend-intern-test
This project is a minimal frontend interface for a Lexi-like legal assistant, built as an assignment. It allows users to ask a legal question, view a generated answer, and access relevant citations by clicking to open the original PDF document within a modal.

## Objective
The primary goal was to simulate the core functionality of a legal assistant that provides AI-generated answers linked to verifiable source documents.

## Screenshot and Video demo Link:

<img width="1916" height="1136" alt="Image" src="https://github.com/user-attachments/assets/673d5c89-1dc5-4bc3-8419-3bb19630dc69" />


<img width="1903" height="1085" alt="Image" src="https://github.com/user-attachments/assets/f81d6c99-e487-4be2-99a6-80015b757474" />


<img width="1909" height="1193" alt="Image" src="https://github.com/user-attachments/assets/74173014-e4bb-44e3-97d6-ddadc379cc40" />


Video_demo:
```
https://drive.google.com/file/d/1T3YgSIexCmk3NBpwx3kM5eDGuteMKcHc/view?usp=sharing
```

## Features
Ask a Legal Question: A text input area allows users to type in their legal queries.

Generated Answer: Displays the AI-generated answer to the query in a clear card format, mimicking a chat interface.

View Citations: Shows one or more citations relevant to the answer, including the text of the citation and its source document.

PDF Document Modal: Clicking on a citation link opens the associated PDF document in a responsive modal dialog within the application itself, providing a seamless user experience.

Simulated API: The application simulates a backend API call to fetch answers and citations, demonstrating loading states.

Intelligent PDF Navigation: The PDF viewer attempts to automatically jump to the page containing the cited text and visually highlight that entire page with a border.

Responsive UI: Designed to be user-friendly on various screen sizes using Tailwind CSS and Material-UI components.

## Tech Stack
React.js: For building the user interface.

Vite: As the build tool and development server.

Tailwind CSS: For rapid and utility-first styling.

Material-UI (MUI): For robust and accessible UI components, specifically the Dialog and Slide for the PDF modal.

React-PDF: For rendering PDF documents directly within the application.

## How to Run the Project
1.Clone the repository:

```
git clone https://github.com/ModiUTsav/Lexisg-frontend-intern-test.git
cd Lexisg-frontend-intern-test 
```

2.Install dependencies:
```
npm install
```
This will install all necessary packages, including @mui/material, @emotion/react, @emotion/styled, @mui/icons-material, and react-pdf.

3.Place the PDF worker file:
react-pdf requires a worker file (pdf.worker.min.mjs or pdf.worker.min.js). You need to copy this file from your node_modules into your project's public folder.

Locate: node_modules/pdfjs-dist/build/pdf.worker.min.mjs (or .js)

Copy to: your-project-root/public/

Ensure the filename matches what's set in PdfViewer.jsx (pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';).

4.Place the Judgment PDF:
For the simulated citation to work, the Dani Vs Pritam (Future 10 at age 54-55).pdf file (or whatever you named the judgment PDF) needs to be placed in your public folder.

Place your PDF in: your-project-root/public/

Ensure the link in App.jsx's simulatedResponse matches this path (e.g., link: "/Dani Vs Pritam (Future 10 at age 54-55).pdf").

5.Start the development server:

npm run dev

The application will typically open in your browser at http://localhost:5173.

Screenshot / Screen Recording
(Replace this with a screenshot or a link to a screen recording of your application in action. You can use tools like Loom or ShareX to capture this.)

<!-- Example: Make sure to place your screenshot in the project root or adjust path -->

## API Logic (Simulated)
The application simulates a POST request to a backend. On submission, a pre-defined JSON response is used to populate the answer and citations. This avoids the need for a real backend server.

The simulated response structure is as follows:
```
const response = {
  answer: "Yes, under Section 166 of the Motor Vehicles Act, 1988...",
  citations: [
    {
      text: "As the age of the deceased at the time of accident was held to be about 54–55 years...",
      source: "Dani_Devi_v_Pritam_Singh.pdf",
      link: "/Dani Vs Pritam (Future 10 at age 54-55).pdf" // Local path
    }
  ]
};
```
A setTimeout is used to mimic network latency.

## How Citation Linking Was Handled
The citation linking is implemented with the following approach:

1.MUI Dialog for Popup: When a user clicks on a citation's "Source" button, an onClick event triggers the opening of a Material-UI Dialog component. This provides a professional, accessible, and responsive modal experience directly within the application.

2.React-PDF for Document Viewing: Inside the MUI Dialog, the react-pdf library is used to render the PDF document. This allows the application to directly display the PDF content without relying on the browser's native PDF viewer (which has limitations for programmatic control).

3.Intelligent Page Navigation & Highlighting ("Smart Move"):

Upon opening the PDF modal, the PdfViewer component (which uses react-pdf) receives the highlightCitationText (the text of the citation).

It then pre-loads the text content of all pages in the PDF document asynchronously.

During this pre-loading, it performs an aggressive normalization on both the extracted page text and the highlightCitationText. This normalization removes punctuation, standardizes whitespace, and handles common discrepancies (like 54-55 vs 54 55 vs 5455) to maximize the chance of a successful string match.

If the normalizedHighlightText is found on any page, the viewer automatically setPageNumber to that page, causing the react-pdf Document to render it.

A visual highlight (a yellow border) is applied to the entire page (className={highlightedPage === pageNumber ? 'border-4 border-yellow-500 shadow-lg' : ''}) to clearly indicate the relevant page to the user.

## Challenges and Considerations for Precise Text Highlighting:

While the current implementation successfully navigates to and highlights the relevant page, achieving pixel-perfect highlighting of only the specific text span within the PDF is significantly more complex. This would typically require:

Advanced parsing of react-pdf's textItems to get precise character coordinates (item.transform).

Complex geometric calculations to draw overlay divs that exactly match the text's bounding box, accounting for PDF scaling.

Handling multi-line text, partial word matches, and various font rendering quirks.

For the purpose of this assignment, the "smart move" of jumping to and highlighting the entire relevant page provides excellent user value and demonstrates the core capability effectively without delving into the deep complexities of sub-string PDF rendering.

Author
Utsav Modi
modiutsav2003@gmail.com
