"use client";

import { Printer, ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";

const InvoiceClient = () => {
  const router = useRouter();

  const handleDownloadPdf = async () => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById('invoice-content');
    if (!element) return;
    
    try {
      const domtoimage = (await import('dom-to-image-more')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const scale = 2;
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1.0,
        height: element.offsetHeight * scale,
        width: element.offsetWidth * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${element.offsetWidth}px`,
          height: `${element.offsetHeight}px`
        }
      });
      
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="bg-neutral-50 px-8 py-4 border-b border-neutral-200 flex justify-between items-center print:hidden">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition"
      >
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleDownloadPdf} 
          className="flex items-center gap-2 bg-neutral-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-neutral-900 transition shadow-sm"
        >
          <Download size={18} /> Download PDF
        </button>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 bg-[#F97316] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#EA580C] transition shadow-sm"
        >
          <Printer size={18} /> Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceClient;
