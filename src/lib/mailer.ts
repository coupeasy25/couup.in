import nodemailer from "nodemailer";

export async function sendBookingConfirmationEmail(
  userEmail: string,
  userName: string,
  listingTitle: string,
  pdfBuffer: Buffer
) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing EMAIL_USER or EMAIL_PASS in environment variables. Email cannot be sent.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Booking Confirmed: ${listingTitle} - Couup Hotels & Resorts`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background-color: #0f3d30; padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; }
          .header p { color: #86efac; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 1px; }
          .content { padding: 40px 30px; }
          .title { color: #1f2937; font-size: 24px; font-weight: bold; margin-top: 0; margin-bottom: 20px; }
          .greeting { color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px; }
          .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px; }
          .details-title { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; margin-bottom: 10px; }
          .property-name { font-size: 20px; color: #0f3d30; font-weight: bold; margin-top: 0; margin-bottom: 5px; }
          .info-text { color: #334155; font-size: 15px; margin: 5px 0; }
          .footer { background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
          .footer p { color: #64748b; font-size: 13px; margin: 5px 0; line-height: 1.5; }
          .btn-primary { display: inline-block; background-color: #0f3d30; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>COUUP</h1>
            <p>HOTELS & RESORTS</p>
          </div>
          <div class="content">
            <h2 class="title">Your Booking is Confirmed!</h2>
            <p class="greeting">Dear <strong>${userName}</strong>,</p>
            <p class="greeting">Thank you for choosing Couup Hotels & Resorts. Your payment has been successfully processed, and we are thrilled to confirm your upcoming stay.</p>
            
            <div class="details-box">
              <div class="details-title">Booking Overview</div>
              <h3 class="property-name">${listingTitle}</h3>
              <p class="info-text">A detailed invoice including your booking dates, guest information, and payment breakdown is attached to this email as a PDF.</p>
            </div>
            
            <p class="greeting">Please keep the attached invoice for your records. If you need any assistance prior to your arrival, our support team is always here to help.</p>
            
            <div style="text-align: center;">
              <a href="#" class="btn-primary">View Your Trips</a>
            </div>
          </div>
          <div class="footer">
            <p><strong>Couup Support Team</strong></p>
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Couup Hotels & Resorts. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: 'Booking_Confirmation.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("FAILED_TO_SEND_EMAIL", error);
    return false;
  }
}
