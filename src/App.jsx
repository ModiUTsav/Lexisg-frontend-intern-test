import React, { Fragment, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'; 
import Slide from '@mui/material/Slide';
import PdfViewer from './components/PdfViewer';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [querySubmitted, setQuerySubmitted] = useState(''); 

  const [isPdfModelOpen,setIsPdfModelOpen] = useState(false);
  const [pdfUrl,setPdfUrl] = useState('');
  const [currentPdfSource, setCurrentPdfSource] = useState(''); 

    const [highlightCitationText, setHighlightCitationText] = useState('');

  const handleSubmit = async () => {
    if (!query.trim()) return; 

    setIsLoading(true);
    setAnswer('');
    setCitations([]); 
    setQuerySubmitted(query); 
    setQuery(''); 

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const simulatedResponse = {
      answer: "Yes, under Section 166 of the Motor Vehicles Act, 1988, the claimants are entitled to an addition for future prospects even when the deceased was self-employed and aged 54–55 years at the time of the accident. In Dani Devi v. Pritam Singh, the Court held that 10% of the deceased’s annual income should be added as future prospects.",
      citations: [
        {
          text: "“as the age of the deceased at the time of accident was held to be about 54-55 years by the learned Tribunal, being self-employed, as such, 10% of annual income should have been awarded on account of future prospects.” (Para 7 of the document)",
          source: "Dani_Devi_v_Pritam_Singh.pdf",
          link: "/Dani Vs Pritam (Future 10 at age 54-55).pdf"
        }
      ]
    };

    setAnswer(simulatedResponse.answer);
    setCitations(simulatedResponse.citations);
    setIsLoading(false);
  };

  // const handleCitationClick = (link) => {
  //   window.open(link, '_blank');
  // };

  function openPdfModel(link,source,text){
    setIsPdfModelOpen(true);
    setPdfUrl(link);
    setCurrentPdfSource(source);
    setHighlightCitationText(text)
  }

  function closePdfModel(){
    setIsPdfModelOpen(false);
    setPdfUrl('');
    setCurrentPdfSource('');
    setHighlightCitationText('');
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 font-sans"> {/* Added font-sans for better readability */}
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex items-center justify-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Lexi Legal Assistant</h1>
      </header>

      {/* Main content area: Chat messages */}
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar"> {/* Added custom-scrollbar for better scrollbar styling */}
        <div className="max-w-3xl mx-auto space-y-6 pb-4"> {/* Increased max-width, added space-y */}

          {/* User Query Display (New) */}
          {querySubmitted && (
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md self-end ml-auto max-w-[80%] break-words">
              <p className="text-base">{querySubmitted}</p>
            </div>
          )}

          {/* Answer Panel */}
          {isLoading && (
            <div className="bg-white p-4 rounded-lg shadow-md self-start mr-auto max-w-[80%]">
              <p className="text-gray-700 italic">Thinking...</p>
            </div>
          )}

          {answer && (
            <div className="bg-white p-6 rounded-lg shadow-md self-start mr-auto max-w-[80%] break-words"> {/* Added break-words */}
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Answer:</h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">{answer}</p>

              {citations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-md font-semibold mb-2 text-gray-700">Citations:</h3>
                  {citations.map((citation, index) => {
                    const cleanedCitationText = citation.text.replace(/\s*\(Para \d+ of the document\)/g, '').trim();
                    return (
                      <div key={index} className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <p className="text-gray-600 italic text-sm mb-1 break-words">{citation.text}</p> {/* Added break-words */}
                        <button
                          onClick={() => openPdfModel(citation.link, citation.source, cleanedCitationText)}
                          className="text-red-600 hover:underline text-sm font-medium focus:outline-none"
                        >
                          Source: {citation.source} (Click to open PDF)
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      
      <div className="bg-white p-4 border-t border-gray-200 shadow-lg sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto flex items-end space-x-3"> {/* Increased max-width */}
          <textarea
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-40 overflow-y-auto custom-scrollbar text-base" // Added max-h-40
            rows="1" 
            placeholder="Ask a legal question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            onInput={(e) => {
                
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; // 160px is max-h-40 roughly
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSubmit();
                }
            }}
          ></textarea>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out ${
              isLoading || !query.trim()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* PDF Modal */}
      <Dialog
      open={isPdfModelOpen}
      TransitionComponent ={Transition}
      keepMounted
      onClose={closePdfModel}
      aria-describedby="pdf-viewer-dialog-description"
        maxWidth="lg" // Adjusts width for large screen
        fullWidth={true}

        sx={{
          '& .MuiDialog-paper': {
            height: '90vh', // Make it tall
            maxHeight: '90vh', // Ensure it doesn't exceed 90% of viewport height
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle>
          viewing Pdf: {currentPdfSource}
          {closePdfModel ? (
            <IconButton
            aria-label="close"
              onClick={closePdfModel}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            
            ><CloseIcon/></IconButton>
          ):null}
        </DialogTitle>

         <DialogContent dividers sx={{ flexGrow: 1, p: 0 }}>
          {pdfUrl ? (
            <PdfViewer pdfUrl={pdfUrl} highlightCitationText={highlightCitationText} /> 
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No PDF selected.
            </div>
          )}
        </DialogContent>



      </Dialog>
    </div>
  );
}

export default App;