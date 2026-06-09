export function PrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        /* Hide everything by default */
        html,
        body {
          height: auto !important;
          overflow: visible !important;
          background: white !important;
        }

        body * {
          visibility: hidden;
        }

        /* Show only the print container and its children */
        .print-container,
        .print-container * {
          visibility: visible;
        }

        /* Position the print container at the top left */
        .print-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Hide UI wrappers of the preview component */
        .print-container .bg-card {
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
          padding: 0 !important;
        }

        /* Hide legends and preview headers */
        .print-container > div > div:first-child, /* CardHeader */
        .print-container .mt-4.flex.flex-wrap /* Legend */ {
          display: none !important;
          visibility: hidden !important;
        }

        /* Focus on the A4 div */
        .print-container div[style*="min-height: 297mm"] {
          box-shadow: none !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: none !important;
          border: none !important;
        }

        /* Generic helper to hide elements */
        .no-print,
        aside,
        header,
        nav,
        button,
        .dashboard-sidebar,
        .dashboard-header {
          display: none !important;
        }

        /* Reset margins */
        @page {
          margin: 0;
          size: auto;
        }
      }
    `}</style>
  );
}
