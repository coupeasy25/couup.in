import { getInvoiceById } from "@/actions/invoiceActions";
import EmptyState from "@/components/EmptyState";
import { format, differenceInDays } from "date-fns";
import InvoiceClient from "./InvoiceClient";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return (
      <EmptyState
        title="Invoice Not Found"
        subtitle="This invoice doesn't exist or you don't have permission to view it."
      />
    );
  }

  // Calculate nights
  let nights = 1;
  if (invoice.checkIn && invoice.checkOut) {
    const start = new Date(invoice.checkIn);
    const end = new Date(invoice.checkOut);
    nights = Math.max(1, differenceInDays(end, start));
  }
  const basePerNight = invoice.amount / nights;

  return (
    <div className="min-h-screen bg-neutral-100 py-10 print:py-0 print:bg-white flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg print:shadow-none print:w-full print:max-w-full rounded-2xl overflow-hidden flex flex-col font-sans">
        {/* Action bar (hidden when printing) */}
        <InvoiceClient />

        <div className="px-10 py-12 md:px-16 print:p-8 flex flex-col flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-6 border-b-2 border-[#0f172a]">
            <div className="flex flex-col mb-6 md:mb-0 gap-1">
              <h1 className="text-4xl md:text-[42px] font-bold text-[#0f172a] tracking-tight leading-none mb-1">COUUP</h1>
              <p className="text-[#F97316] font-bold text-[13px] tracking-[0.1em]">HOTELS & PREMIUM TRAVEL</p>
              <p className="text-[#64748b] text-[13px] mt-3">GSTIN: 24AAABC1234D1Z5</p>
              <p className="text-[#64748b] text-[13px]">support@couup.in | +91 99999 99999</p>
            </div>
            
            <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto">
              <h1 className="text-4xl md:text-[42px] font-bold text-[#0f172a] tracking-tight leading-none mb-2">INVOICE</h1>
              <p className="text-xl font-bold text-[#0f172a] mb-5">INV-{invoice.invoiceNumber}</p>
              <p className="text-[#64748b] text-[14px]">
                Date: {format(new Date(invoice.createdAt), "dd MMM yyyy")} <span className="mx-2">|</span> Status: <span className={`font-bold ${invoice.status === 'Paid' ? 'text-[#F97316]' : 'text-neutral-500'}`}>{invoice.status.toUpperCase()}</span>
              </p>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            {/* Billed To Box */}
            <div className="flex-1 border border-[#e2e8f0] border-t-4 border-t-[#F97316] rounded-sm p-5 pb-6">
              <h3 className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-3">BILLED TO</h3>
              <p className="text-[15px] text-[#0f172a] mb-2">{invoice.guestName || 'Valued Guest'}</p>
              <p className="text-[13px] text-[#64748b] mb-1">Email: {invoice.guestEmail || 'N/A'}</p>
              <p className="text-[13px] text-[#64748b]">Phone: {invoice.guestContact || '+91 98765 43210'}</p>
            </div>

            {/* Booking Details Box */}
            <div className="flex-1 border border-[#e2e8f0] border-t-4 border-t-[#0f172a] rounded-sm p-5 pb-6">
              <h3 className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-3">BOOKING DETAILS</h3>
              <p className="text-[14px] text-[#0f172a] font-bold mb-3">
                Booking ID: <span className="font-normal">INV-{invoice.invoiceNumber}</span>
              </p>
              <p className="text-[14px] text-[#0f172a] font-bold mt-auto pt-6">
                Payment Method: <span className="font-normal">{invoice.paymentMethod || 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* Stay & Guest Info */}
          {(invoice.propertyName || invoice.checkIn || invoice.checkOut) && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#0f172a] mb-4">
                Stay & Guest <span className="text-[#F97316]">Information</span>
              </h2>
              
              <div className="bg-[#0f172a] text-white text-[11px] font-bold px-5 py-2.5 flex justify-between rounded-t-sm">
                <div className="w-[35%]">PROPERTY & LOCATION</div>
                <div className="w-[20%]">ROOM TYPE</div>
                <div className="w-[25%]">CHECK-IN / CHECK-OUT</div>
                <div className="w-[20%]">GUESTS</div>
              </div>
              
              <div className="border border-[#e2e8f0] border-t-0 p-5 flex justify-between items-start rounded-b-sm">
                <div className="w-[35%] pr-4">
                  <p className="text-[#0f172a] text-[14px] font-bold mb-1">{invoice.propertyName || 'N/A'}</p>
                  <p className="text-[#64748b] text-[13px]">Location not specified</p>
                </div>
                <div className="w-[20%] pr-4">
                  <p className="text-[#0f172a] text-[13px]">{invoice.roomType || 'Standard'}</p>
                </div>
                <div className="w-[25%] pr-4">
                  <p className="text-[#0f172a] text-[13px] mb-1">{invoice.checkIn ? format(new Date(invoice.checkIn), "dd MMM yyyy") : 'N/A'}, 12:00 PM</p>
                  <p className="text-[#64748b] text-[13px] mb-1">to</p>
                  <p className="text-[#0f172a] text-[13px]">{invoice.checkOut ? format(new Date(invoice.checkOut), "dd MMM yyyy") : 'N/A'}, 11:00 AM</p>
                </div>
                <div className="w-[20%]">
                  <p className="text-[#0f172a] text-[13px] font-bold mb-1">1 Guests (Adults)</p>
                  <p className="text-[#64748b] text-[13px]">Primary: {invoice.guestName?.split(' ')[0]}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#0f172a] mb-4">
              Pricing <span className="text-[#F97316]">Summary</span>
            </h2>

            <div className="bg-[#0f172a] text-white text-[11px] font-bold px-5 py-2.5 flex justify-between rounded-t-sm">
              <div className="w-[45%]">DESCRIPTION</div>
              <div className="w-[20%] text-center">QTY / NIGHTS</div>
              <div className="w-[15%] text-right">RATE</div>
              <div className="w-[20%] text-right">AMOUNT</div>
            </div>

            <div className="border border-[#e2e8f0] border-t-0 p-5 rounded-b-sm">
              {/* Row 1: Base Price */}
              <div className="flex justify-between items-center pb-4 border-b border-[#f1f5f9]">
                <div className="w-[45%] text-[13px] text-[#0f172a]">{invoice.roomType || 'Standard'} Base Price</div>
                <div className="w-[20%] text-[13px] text-[#0f172a] text-center">{nights}</div>
                <div className="w-[15%] text-[13px] text-[#0f172a] text-right">₹{basePerNight.toLocaleString('en-IN')}</div>
                <div className="w-[20%] text-[13px] text-[#0f172a] text-right">₹{invoice.amount.toLocaleString('en-IN')}</div>
              </div>

              {/* Row 2: Taxes */}
              <div className="flex justify-between items-center pt-4 pb-2">
                <div className="w-[45%] text-[13px] text-[#0f172a]">Taxes & Fees</div>
                <div className="w-[20%] text-[13px] text-[#0f172a] text-center">-</div>
                <div className="w-[15%] text-[13px] text-[#0f172a] text-right">-</div>
                <div className="w-[20%] text-[13px] text-[#0f172a] text-right">₹{invoice.taxes.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-16 mt-2">
            <div className="w-full md:w-[45%]">
              <div className="flex justify-between items-center border border-[#e2e8f0] p-4 text-[14px]">
                <span className="text-[#64748b]">Subtotal</span>
                <span className="text-[#0f172a] font-bold text-right">₹{(invoice.amount + invoice.taxes).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center bg-[#F97316] text-white p-4">
                <span className="font-bold text-lg">TOTAL PAID</span>
                <span className="font-bold text-lg text-right">₹{invoice.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto text-center pt-8 text-[#0f172a] text-[11px] font-bold border-t border-[#e2e8f0]">
            <p className="mb-2">Cancellation Policy: Free cancellation up to 48 hours before check-in.</p>
            <p className="text-[#64748b] font-normal mb-1">This is a computer-generated invoice and does not require a physical signature.</p>
            <p className="text-[#64748b] font-normal">Thank you for choosing COUUP!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
