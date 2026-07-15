import PDFDocument from 'pdfkit';

export async function generateBookingPDF(reservationData: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const { 
        listingTitle, locationValue, startDate, endDate, totalPrice, basePrice, taxes,
        roomType, guests, userName, userEmail, paymentId, orderId, bookingDate, actualInvoiceNumber
      } = reservationData;

      const invoiceNumber = actualInvoiceNumber || `BK-CO-${new Date(bookingDate).getTime().toString().slice(-5)}`;
      
      // Colors from design
      const primaryNavy = '#0f172a'; 
      const primaryOrange = '#F97316';
      const textGray = '#64748b';
      const lightGray = '#f1f5f9';
      const borderGray = '#e2e8f0';

      const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-IN')}`;
      const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        });
      };
      
      const checkInTime = '12:00 PM';
      const checkOutTime = '11:00 AM';

      // --- HEADER ---
      // Left
      doc.fillColor(primaryNavy).fontSize(28).font('Helvetica-Bold').text('COUUP', 40, 45, { characterSpacing: 1 });
      doc.fillColor(primaryOrange).fontSize(10).font('Helvetica-Bold').text('HOTELS & PREMIUM TRAVEL', 40, 80, { characterSpacing: 1 });
      doc.fillColor(textGray).fontSize(9).font('Helvetica')
         .text('GSTIN: 24AAABC1234D1Z5', 40, 98)
         .text('support@couup.com | +91 800-000-0000', 40, 110);

      // Right
      doc.fillColor(primaryNavy).fontSize(28).font('Helvetica-Bold').text('INVOICE', 350, 45, { align: 'right' });
      
      if (actualInvoiceNumber) {
        doc.fillColor(primaryNavy).fontSize(12).font('Helvetica-Bold').text(actualInvoiceNumber, 350, 78, { align: 'right' });
      }
      
      // Fix for PDFKit 'continued' bug with alignment
      const dateText = `Date: ${formatDate(bookingDate)} | Status: `;
      doc.fillColor(textGray).fontSize(10).font('Helvetica').text(dateText, 400, 95);
      const textWidth = doc.widthOfString(dateText);
      doc.fillColor(primaryOrange).font('Helvetica-Bold').text('PAID', 400 + textWidth, 95);

      // Header Bottom Line
      doc.moveTo(40, 135).lineTo(555, 135).lineWidth(2).strokeColor(primaryNavy).stroke();

      // --- INFO BOXES ---
      const boxTop = 160;
      
      // Billed To Box
      doc.moveTo(40, boxTop).lineTo(280, boxTop).lineWidth(3).strokeColor(primaryOrange).stroke();
      doc.rect(40, boxTop, 240, 95).lineWidth(1).strokeColor(borderGray).stroke();
      doc.fillColor(textGray).fontSize(9).font('Helvetica-Bold').text('BILLED TO', 55, boxTop + 15);
      doc.fillColor(primaryNavy).fontSize(11).text(userName || 'Valued Guest', 55, boxTop + 35);
      doc.fillColor(textGray).fontSize(9).font('Helvetica')
         .text(`Email: ${userEmail}`, 55, boxTop + 55)
         .text(`Phone: ${reservationData.mobileNumber || '+91 98765 43210'}`, 55, boxTop + 70);

      // Booking Details Box
      doc.moveTo(315, boxTop).lineTo(555, boxTop).lineWidth(3).strokeColor(primaryNavy).stroke();
      doc.rect(315, boxTop, 240, 95).lineWidth(1).strokeColor(borderGray).stroke();
      doc.fillColor(textGray).fontSize(9).font('Helvetica-Bold').text('BOOKING DETAILS', 330, boxTop + 15);
      
      doc.fillColor(primaryNavy).fontSize(10)
         .font('Helvetica-Bold').text('Booking ID: ', 330, boxTop + 35, { continued: true })
         .font('Helvetica').text(orderId || invoiceNumber);
         
      
         
      doc.font('Helvetica-Bold').text('Payment Method: ', 330, boxTop + 69, { continued: true })
         .font('Helvetica').text(paymentId ? 'UPI (Online)' : 'N/A');

      // --- STAY & GUEST INFO ---
      const stayTop = 290;
      doc.fillColor(primaryNavy).fontSize(14).font('Helvetica-Bold').text('Stay & Guest ', 40, stayTop, { continued: true })
         .fillColor(primaryOrange).text('Information');

      const stayTableTop = 315;
      doc.rect(40, stayTableTop, 515, 25).fill(primaryNavy);
      
      doc.fillColor('white').fontSize(9).font('Helvetica-Bold')
         .text('PROPERTY & LOCATION', 55, stayTableTop + 8, { width: 140 })
         .text('ROOM TYPE', 200, stayTableTop + 8, { width: 100 })
         .text('CHECK-IN / CHECK-OUT', 310, stayTableTop + 8, { width: 130 })
         .text('GUESTS', 450, stayTableTop + 8, { width: 100 });

      const stayContentTop = stayTableTop + 35;
      
      // Property
      doc.fillColor(primaryNavy).fontSize(10).font('Helvetica-Bold').text(listingTitle, 55, stayContentTop, { width: 140 });
      doc.fillColor(textGray).fontSize(9).font('Helvetica').text(locationValue || 'Location not specified', 55, stayContentTop + 13, { width: 140 });
      
      // Room
      doc.fillColor(primaryNavy).fontSize(9).text(roomType || 'Standard', 200, stayContentTop, { width: 100 });
      
      // Dates
      doc.fillColor(primaryNavy).fontSize(9)
         .text(`${formatDate(startDate)}, ${checkInTime}`, 310, stayContentTop)
         .fillColor(textGray).text('to', 310, stayContentTop + 11)
         .fillColor(primaryNavy).text(`${formatDate(endDate)}, ${checkOutTime}`, 310, stayContentTop + 22);
         
      // Guests
      const guestCount = guests ? guests.length : 1;
      const primaryGuest = guests && guests[0] ? guests[0].firstName : userName?.split(' ')[0];
      doc.fillColor(primaryNavy).fontSize(9).font('Helvetica-Bold').text(`${guestCount} Guests (Adults)`, 450, stayContentTop)
         .fillColor(textGray).font('Helvetica').text(`Primary: ${primaryGuest}`, 450, stayContentTop + 13);

      doc.rect(40, stayTableTop, 515, 80).lineWidth(1).strokeColor(lightGray).stroke();

      // --- PRICING SUMMARY ---
      const priceTop = 440;
      doc.fillColor(primaryNavy).fontSize(14).font('Helvetica-Bold').text('Pricing ', 40, priceTop, { continued: true })
         .fillColor(primaryOrange).text('Summary');

      const priceTableTop = 465;
      doc.rect(40, priceTableTop, 515, 25).fill(primaryNavy);
      
      doc.fillColor('white').fontSize(9).font('Helvetica-Bold')
         .text('DESCRIPTION', 55, priceTableTop + 8, { width: 220 })
         .text('QTY / NIGHTS', 280, priceTableTop + 8, { width: 80, align: 'center' })
         .text('RATE', 370, priceTableTop + 8, { width: 80, align: 'right' })
         .text('AMOUNT', 460, priceTableTop + 8, { width: 80, align: 'right' });

      const p1Top = priceTableTop + 35;
      const nights = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
      const basePerNight = basePrice / nights;
      
      doc.fillColor(primaryNavy).fontSize(9).font('Helvetica')
         .text(`${roomType || 'Standard'} Base Price`, 55, p1Top, { width: 220 })
         .text(nights.toString(), 280, p1Top, { width: 80, align: 'center' })
         .text(formatCurrency(basePerNight), 370, p1Top, { width: 80, align: 'right' })
         .text(formatCurrency(basePrice), 460, p1Top, { width: 80, align: 'right' });
         
      doc.moveTo(40, p1Top + 20).lineTo(555, p1Top + 20).lineWidth(1).strokeColor(lightGray).stroke();

      const p2Top = p1Top + 35;
      
      doc.text('Taxes & Fees', 55, p2Top, { width: 220 })
         .text('-', 280, p2Top, { width: 80, align: 'center' })
         .text('-', 370, p2Top, { width: 80, align: 'right' })
         .text(formatCurrency(taxes), 460, p2Top, { width: 80, align: 'right' });
         
      doc.moveTo(40, p2Top + 20).lineTo(555, p2Top + 20).lineWidth(1).strokeColor(lightGray).stroke();

      // Summary Box
      const subTotal = basePrice + taxes;
      let calculatedTotal = totalPrice > 0 ? totalPrice : subTotal;
      const discount = subTotal - calculatedTotal;

      const sumTop = p2Top + 40;
      const hasDiscount = discount > 0;
      doc.rect(330, sumTop, 225, hasDiscount ? 95 : 55).lineWidth(1).strokeColor(borderGray).stroke();
      
      doc.fillColor(textGray).fontSize(10).font('Helvetica')
         .text('Subtotal', 345, sumTop + 15)
         .fillColor(primaryNavy).font('Helvetica-Bold')
         .text(formatCurrency(subTotal), 450, sumTop + 15, { width: 90, align: 'right' });

      let totalTop = sumTop + 40;

      if (hasDiscount) {
        doc.moveTo(330, sumTop + 35).lineTo(555, sumTop + 35).lineWidth(1).strokeColor(borderGray).stroke();
        
        doc.fillColor(primaryNavy).fontSize(10).font('Helvetica-Bold')
           .text('Promo Code Applied', 345, sumTop + 45)
           .fillColor(textGray).fontSize(8).font('Helvetica')
           .text('(Discount)', 345, sumTop + 60)
           .fillColor(primaryNavy).fontSize(10).font('Helvetica-Bold')
           .text(`- ${formatCurrency(discount)}`, 450, sumTop + 50, { width: 90, align: 'right' });
           
        totalTop = sumTop + 75;
      }

      doc.rect(330, totalTop, 225, 40).fill(primaryOrange);
      doc.fillColor('white').fontSize(14).font('Helvetica-Bold')
         .text('TOTAL PAID', 345, totalTop + 14)
         .text(formatCurrency(calculatedTotal), 420, totalTop + 14, { width: 120, align: 'right' });

      // Footer
      const footerTop = 730;
      
      // Fix for PDFKit 'continued' bug with alignment
      doc.fillColor(primaryNavy).fontSize(8).font('Helvetica-Bold')
         .text('Cancellation Policy: Free cancellation up to 48 hours before check-in. ', 40, footerTop, { align: 'center' });
         
      doc.fillColor(textGray).font('Helvetica')
         .text('This is a computer-generated invoice and does not require a physical signature.', 40, footerTop + 15, { align: 'center' })
         .text('Thank you for choosing COUUP!', 40, footerTop + 30, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
