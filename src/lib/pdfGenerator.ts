import PDFDocument from 'pdfkit';

export async function generateBookingPDF(reservationData: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const { 
        listingTitle, 
        locationValue, 
        startDate, 
        endDate, 
        totalPrice, 
        basePrice, 
        taxes,
        roomType,
        guests,
        userName,
        userEmail,
        paymentId,
        orderId,
        bookingDate
      } = reservationData;

      // --- BACKGROUND HEADER ---
      doc.rect(0, 0, 595, 120).fill('#F97316');

      // --- BRANDING ---
      doc
        .fillColor('#ffffff')
        .fontSize(32)
        .font('Helvetica-Bold')
        .text('COUUP', 50, 40, { characterSpacing: 2 })
        .fontSize(10)
        .font('Helvetica')
        .text('HOTELS & RESORTS', 50, 75, { characterSpacing: 4 });

      // --- INVOICE BADGE ---
      doc
        .fillColor('#86efac')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('INVOICE', 400, 50, { align: 'right' });
      
      doc.moveDown(5);

      // --- BOOKING INFO (Left) ---
      doc.fillColor('#F97316').fontSize(14).font('Helvetica-Bold').text('Booking Details', 50, 150);
      doc.fillColor('#4b5563').fontSize(10).font('Helvetica')
        .text(`Date: ${new Date(bookingDate).toLocaleString()}`, 50, 170)
        .text(`Payment ID: ${paymentId || 'N/A'}`, 50, 185)
        .text(`Order ID: ${orderId || 'N/A'}`, 50, 200);

      // --- CUSTOMER INFO (Right) ---
      doc.fillColor('#F97316').fontSize(14).font('Helvetica-Bold').text('Billed To', 350, 150, { align: 'right' });
      doc.fillColor('#4b5563').fontSize(10).font('Helvetica')
        .text(`${userName}`, 350, 170, { align: 'right' })
        .text(`${userEmail}`, 350, 185, { align: 'right' });

      // --- DIVIDER ---
      doc.moveTo(50, 230).lineTo(545, 230).strokeColor('#e2e8f0').stroke();

      // --- PROPERTY DETAILS TABLE ---
      doc.fillColor('#F97316').fontSize(14).font('Helvetica-Bold').text('Stay Information', 50, 250);
      
      // Table Header
      const tableTop = 275;
      doc.rect(50, tableTop, 495, 30).fill('#f8fafc');
      doc.fillColor('#64748b').fontSize(10).font('Helvetica-Bold')
        .text('PROPERTY', 60, tableTop + 10)
        .text('ROOM TYPE', 280, tableTop + 10)
        .text('CHECK-IN / OUT', 400, tableTop + 10, { width: 140, align: 'right' });
      
      // Table Row
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica')
        .text(listingTitle, 60, tableTop + 40, { width: 200 })
        .text(locationValue || '', 60, tableTop + 55, { width: 200 })
        .text(roomType || 'Standard', 280, tableTop + 40)
        .text(`${new Date(startDate).toLocaleDateString()} to`, 400, tableTop + 40, { width: 140, align: 'right' })
        .text(`${new Date(endDate).toLocaleDateString()}`, 400, tableTop + 55, { width: 140, align: 'right' });

      doc.moveTo(50, tableTop + 80).lineTo(545, tableTop + 80).strokeColor('#e2e8f0').stroke();

      // --- GUESTS ---
      let currentY = tableTop + 100;
      if (guests && guests.length > 0) {
        doc.fillColor('#F97316').fontSize(14).font('Helvetica-Bold').text('Guest Details', 50, currentY);
        currentY += 20;
        doc.fillColor('#4b5563').fontSize(10).font('Helvetica');
        guests.forEach((guest: any, index: number) => {
          doc.text(`${index + 1}. ${guest.firstName} ${guest.lastName} (${guest.gender}, ${guest.age} yrs)`, 50, currentY);
          currentY += 15;
        });
        currentY += 10;
        doc.moveTo(50, currentY).lineTo(545, currentY).strokeColor('#e2e8f0').stroke();
        currentY += 20;
      }

      // --- SUMMARY ---
      doc.fillColor('#F97316').fontSize(14).font('Helvetica-Bold').text('Payment Summary', 350, currentY, { align: 'right' });
      currentY += 25;

      doc.fillColor('#4b5563').fontSize(10).font('Helvetica')
        .text('Base Price:', 350, currentY, { align: 'right', width: 100 })
        .text(`Rs. ${basePrice.toLocaleString()}`, 450, currentY, { align: 'right', width: 95 });
      currentY += 20;

      doc.text('Taxes (18% GST):', 350, currentY, { align: 'right', width: 100 })
        .text(`Rs. ${taxes.toLocaleString()}`, 450, currentY, { align: 'right', width: 95 });
      currentY += 25;

      // Total Box
      doc.rect(345, currentY, 200, 40).fill('#F97316');
      doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold')
        .text('TOTAL PAID', 355, currentY + 14)
        .fontSize(14)
        .text(`Rs. ${totalPrice.toLocaleString()}`, 400, currentY + 12, { align: 'right', width: 135 });

      // --- FOOTER ---
      doc.fillColor('#94a3b8').fontSize(9).font('Helvetica')
        .text('Thank you for booking with Couup Hotels & Resorts.', 50, 750, { align: 'center' })
        .text('If you have any questions, please contact our support.', 50, 765, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
