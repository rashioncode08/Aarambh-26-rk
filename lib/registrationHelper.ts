import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// PDF RECEIPT GENERATOR helper (A4 Layout with dynamic aspect scaling)
// ============================================================================
export async function generatePDF(data: any, id: string, paymentId: string, orderId: string, dateOfPayment: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Standard A4 Dimensions
  const { width, height } = page.getSize();
  
  // Brand Colors
  const primaryColor = rgb(1.0, 0.094, 0.549); // #FF188C Bold Pink
  const darkColor = rgb(0.012, 0.016, 0.016);  // #030404 Ink Black
  const lightGray = rgb(0.961, 0.945, 0.898);  // #F5F1E5 Cloud White
  const greyColor = rgb(0.4, 0.4, 0.4);

  // 1. Left Logo: JKLU Logo (Colored PNG variant)
  let jkluScaledWidth = 0;
  let jkluScaledHeight = 0;
  let jkluLogoImage;
  try {
    const jkluLogoPath = path.join(
      process.cwd(), 
      'public', 
      'AARAMBH\'26 Design Assets', 
      'JKLU Logo.png'
    );
    const jkluLogoBytes = await fs.readFile(jkluLogoPath);
    jkluLogoImage = await pdfDoc.embedPng(jkluLogoBytes);
    const targetHeight = 46;
    const scaleFactor = targetHeight / jkluLogoImage.height;
    jkluScaledWidth = jkluLogoImage.width * scaleFactor;
    jkluScaledHeight = jkluLogoImage.height * scaleFactor;
  } catch (error) {
    console.warn('PDF Left Logo (JKLU) load failed:', error);
  }

  // 2. Right Logo: AARAMBH Main Logo (Transparent removebg PNG variant)
  let aarambhScaledWidth = 0;
  let aarambhScaledHeight = 0;
  let aarambhLogoImage;
  try {
    const aarambhLogoPath = path.join(
      process.cwd(), 
      'public', 
      'AARAMBH\'26 Design Assets', 
      'Main_Logo', 
      'AARAMBH_26_Logo-removebg.png'
    );
    const aarambhLogoBytes = await fs.readFile(aarambhLogoPath);
    aarambhLogoImage = await pdfDoc.embedPng(aarambhLogoBytes);
    const targetHeight = 44;
    const scaleFactor = targetHeight / aarambhLogoImage.height;
    aarambhScaledWidth = aarambhLogoImage.width * scaleFactor;
    aarambhScaledHeight = aarambhLogoImage.height * scaleFactor;
  } catch (error) {
    console.warn('PDF Right Logo (Aarambh) load failed:', error);
  }

  // Draw Left Logo (JKLU Logo) directly on white background
  if (jkluLogoImage) {
    page.drawImage(jkluLogoImage, {
      x: 40,
      y: height - 95,
      width: jkluScaledWidth,
      height: jkluScaledHeight,
    });
  }

  // Draw Right Logo (AARAMBH Logo) directly on white background
  if (aarambhLogoImage) {
    page.drawImage(aarambhLogoImage, {
      x: width - 40 - aarambhScaledWidth,
      y: height - 95,
      width: aarambhScaledWidth,
      height: aarambhScaledHeight,
    });
  }

  // Center-aligned Header Title text on white background
  page.drawText('Registration Receipt', {
    x: 200,
    y: height - 70,
    size: 20,
    color: darkColor,
  });
  page.drawText('Aarambh Registration · JK Lakshmipat University', {
    x: 185,
    y: height - 85,
    size: 8.5,
    color: greyColor,
  });

  // Solid Black Divider line under header
  page.drawLine({
    start: { x: 40, y: height - 110 },
    end: { x: 555, y: height - 110 },
    thickness: 2,
    color: darkColor
  });

  // QR Code Verification Box
  const qrDataUrl = await QRCode.toDataURL(id, { margin: 1, width: 300 });
  const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  
  // Draw outer QR Card Border
  page.drawImage(qrImage, {
    x: 257,
    y: 647,
    width: 80,
    height: 80
  });

  // Metadata Row
  // Receipt No
  page.drawText('Receipt No.'.toUpperCase(), { x: 40, y: 590, size: 7.5, color: greyColor });
  page.drawText(`AARAMBH2026-${data.registrationNumber || id.slice(-4).toUpperCase()}`, { x: 40, y: 575, size: 10.5, color: darkColor });

  // Date of Issue
  page.drawText('Date of Issue'.toUpperCase(), { x: 250, y: 590, size: 7.5, color: greyColor });
  page.drawText(dateOfPayment, { x: 250, y: 575, size: 10.5, color: darkColor });

  // Payment Status
  page.drawText('Payment Status'.toUpperCase(), { x: 450, y: 590, size: 7.5, color: greyColor });
  page.drawRectangle({
    x: 450,
    y: 570,
    width: 50,
    height: 16,
    color: rgb(0.85, 0.95, 0.85),
    borderColor: rgb(0.1, 0.5, 0.2),
    borderWidth: 1
  });
  page.drawText('PAID', { x: 462, y: 574, size: 9, color: rgb(0.1, 0.5, 0.2) });

  // Horizontal separator line
  page.drawLine({
    start: { x: 40, y: 550 },
    end: { x: 555, y: 550 },
    thickness: 1,
    color: rgb(0.88, 0.9, 0.94)
  });

  const clean = (text: string) => (text || '').replace(/[^\x20-\x7E]/g, '');

  // Helper function to draw a section header
  const drawSectionHeader = (title: string, y: number) => {
    page.drawText(title.toUpperCase(), { x: 40, y, size: 9.5, color: darkColor });
    page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: 555, y: y - 5 }, thickness: 1.5, color: darkColor });
  };

  // Helper function to draw grid cells
  const drawField = (label: string, value: string, x: number, y: number) => {
    page.drawText(label.toUpperCase(), { x, y, size: 7.5, color: greyColor });
    page.drawText(clean(value), { x, y: y - 13, size: 10.5, color: darkColor });
  };

  // 1. STUDENT INFORMATION Section
  drawSectionHeader('STUDENT INFORMATION', 525);
  drawField('Full Name', data.name, 40, 502);
  drawField('Enrollment No.', data.registrationNumber || 'N/A', 300, 502);
  
  drawField('Branch / Programme', data.course || 'B.Tech', 40, 469);
  
  drawField('Email Address', data.email, 40, 436);
  drawField('Mobile Number', data.mobile || data.phone, 300, 436);

  // 2. PARENT DETAILS Section
  drawSectionHeader('PARENT DETAILS', 395);
  drawField('Parent Name', data.parentName || data.fatherName || 'N/A', 40, 372);
  drawField('Parent Phone', data.parentPhone || data.fatherMobile || 'N/A', 300, 372);
  
  drawField('Parent Email', data.parentEmail || data.fatherEmail || 'N/A', 40, 339);

  // 3. PERMANENT ADDRESS Section
  drawSectionHeader('PERMANENT ADDRESS', 298);
  drawField('Street / Locality', data.address || 'N/A', 40, 275);
  drawField('City / State / PIN', `Jaipur, Rajasthan - ${data.address ? (data.address.match(/\b\d{6}\b/)?.[0] || '302017') : '302017'}`, 40, 242);

  // 4. PAYMENT SUMMARY Section
  drawSectionHeader('PAYMENT SUMMARY', 201);
  drawField('Amount Paid', `Rs. ${data.coupon?.toUpperCase() === 'TESTTEST' ? '1.00' : '1,500.00'}`, 40, 178);
  drawField('Mode of Payment', 'Online Transfer / UPI', 220, 178);
  
  page.drawText('TRANSACTION STATUS', { x: 410, y: 178, size: 7.5, color: greyColor });
  page.drawText('Confirmed', { x: 410, y: 165, size: 10.5, color: rgb(0.1, 0.5, 0.2) });

  // Disclaimer Notes
  page.drawText('This receipt confirms successful registration and payment for Aarambh 2026. Please retain this document for your records.', {
    x: 40,
    y: 110,
    size: 7,
    color: greyColor
  });
  page.drawText('For queries, contact the university administration.', {
    x: 40,
    y: 99,
    size: 7,
    color: greyColor
  });

  // Bottom Footer Line
  page.drawLine({
    start: { x: 40, y: 80 },
    end: { x: 555, y: 80 },
    thickness: 1,
    color: rgb(0.88, 0.9, 0.94)
  });

  // Footer Content
  page.drawText('JK Lakshmipat University · www.jklu.edu.in · +91-141-5117000', {
    x: 40,
    y: 65,
    size: 7.5,
    color: greyColor
  });
  page.drawText('This is a system-generated receipt.', {
    x: 420,
    y: 65,
    size: 7.5,
    color: greyColor
  });

  return await pdfDoc.save();
}

// ============================================================================
// SMTP EMAIL NOTIFICATION helper (Nodemailer STARTTLS Client)
// ============================================================================
export async function sendEmail(to: string, name: string, pdfBytes: Uint8Array) {
  const nodemailer = await import('nodemailer');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #1a1a1a; padding: 40px 20px; text-align: center; }
        .logo-text { color: #FACC15; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 2px; }
        .content { padding: 40px 30px; background-color: #ffffff; color: #333; line-height: 1.6; }
        .success-badge { display: inline-block; padding: 6px 12px; background-color: #dcfce7; color: #166534; border-radius: 4px; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #eeeeee; }
        .button { display: inline-block; padding: 12px 24px; background-color: #FACC15; color: #1a1a1a; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo-text">AARAMBH '26</h1>
          <p style="color: #fff; margin: 5px 0 0 0; opacity: 0.8;">The Awakening of Future</p>
        </div>
        <div class="content">
          <div class="success-badge">✓ Registration Confirmed</div>
          <h2 style="margin-top: 0;">Hello ${name}!</h2>
          <p>Your registration for <strong>Aarambh '26</strong> at JK Lakshmipat University has been successfully processed.</p>
          <p>We are thrilled to have you as part of our signature event. Your attendance contributes to the vibrant spirit of this celebration.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">What's next?</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
              <li>Keep the attached PDF receipt safe.</li>
              <li>Show the QR code at the check-in desk for instant entry.</li>
              <li>Check our website for the latest schedule updates.</li>
            </ul>
          </div>

          <p>See you at the event!</p>
          <p>Best Regards,<br/><strong>Team Aarambh</strong></p>
        </div>
        <div class="footer">
          <p>JK Lakshmipat University, Jaipur</p>
          <p>&copy; 2026 Aarambh Event Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Aarambh Team" <${process.env.SMTP_FROM || ''}>`,
    to: to,
    subject: "Aarambh'26 | Your Registration is Confirmed!",
    html: htmlContent,
    attachments: [
      {
        filename: 'Aarambh_Registration_Receipt.pdf',
        content: Buffer.from(pdfBytes),
        contentType: 'application/pdf'
      }
    ]
  });
}

// ============================================================================
// REGISTRATION COMPLETION PIPELINE (reconciles DB, Webhooks, Receipts, Emails)
// ============================================================================
export async function finalizeRegistration(formData: any, paymentId: string, orderId: string) {
  console.log("Saving registration to Firestore...");
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const rawDate = new Date();
  const day = rawDate.getDate();
  const month = months[rawDate.getMonth()];
  const year = rawDate.getFullYear().toString().slice(-2);
  
  const dateOfPayment = `${day}-${month}-${year}`; // e.g., "24-May-26"
  const dateGroup = `${day}-${month}`; // e.g., "24-May"
  
  // 1. Save data to Firestore Registration Collection
  const registrationsRef = collection(db, 'registrations');
  const docRef = await addDoc(registrationsRef, {
    ...formData,
    name: formData.name,
    email: formData.email,
    phone: formData.mobile,
    rollNumber: formData.registrationNumber,
    gender: formData.gender || 'N/A',
    course: formData.course || 'N/A',
    pincode: formData.pincode || (formData.address ? (formData.address.match(/\b\d{6}\b/)?.[0] || 'N/A') : 'N/A'),
    parentName: formData.parentName || 'N/A',
    parentPhone: formData.parentPhone || 'N/A',
    parentEmail: formData.parentEmail || 'N/A',
    paymentAmount: formData.coupon?.toUpperCase() === 'TESTTEST' ? 1 : 1500,
    receivedAmount: formData.coupon?.toUpperCase() === 'TESTTEST' ? 1 : 1500,
    dateOfPayment: dateOfPayment,
    dateGroup: dateGroup,
    hasEntered: false,
    paymentId: paymentId,
    orderId: orderId,
    registeredAt: serverTimestamp(),
  });
  console.log("Registration saved. Firestore ID:", docRef.id);

  // 1.5 Synchronize Registration Data to Microsoft Excel Online (Power Automate Webhook)
  const excelWebhook = process.env.EXCEL_SYNC_WEBHOOK_URL;
  if (excelWebhook) {
    console.log("Syncing registration details to Microsoft Excel...");
    try {
      let lastDate = "";
      try {
        const q = query(collection(db, 'registrations'), orderBy('registeredAt', 'desc'), limit(2));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 1) {
          const lastDoc = querySnapshot.docs[1].data();
          lastDate = lastDoc.dateOfPayment || "";
        }
      } catch (err) {
        console.warn("Could not query last registration date:", err);
      }

      let studentIndex = 1;
      try {
        const countSnapshot = await getDocs(collection(db, 'registrations'));
        studentIndex = countSnapshot.size;
      } catch (err) {
        console.warn("Could not count registrations:", err);
      }

      if (lastDate && lastDate !== dateOfPayment) {
        console.log(`Date changed from ${lastDate} to ${dateOfPayment}. Sending Excel date separator...`);
        await fetch(excelWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: dateGroup,
            name: '', email: '', phone: '', rollNumber: '', registeredAt: '',
            gender: '', course: '',
            parentName: '', parentPhone: '', parentEmail: '',
            address: '', pincode: '',
            paymentAmount: 0, receivedAmount: 0,
            dateOfPayment: '', dateGroup: dateGroup,
            paymentId: '', orderId: ''
          })
        });
      }

      await fetch(excelWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: studentIndex.toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          rollNumber: formData.registrationNumber,
          registeredAt: new Date().toISOString(),
          gender: formData.gender || 'N/A',
          course: formData.course || 'N/A',
          parentName: formData.parentName || 'N/A',
          parentPhone: formData.parentPhone || 'N/A',
          parentEmail: formData.parentEmail || 'N/A',
          fatherName: formData.parentName || 'N/A',
          fatherMobile: formData.parentPhone || 'N/A',
          fatherEmail: formData.parentEmail || 'N/A',
          motherName: '',
          motherMobile: '',
          motherEmail: '',
          address: formData.address || 'N/A',
          pincode: formData.pincode || (formData.address ? (formData.address.match(/\b\d{6}\b/)?.[0] || 'N/A') : 'N/A'),
          paymentAmount: formData.coupon?.toUpperCase() === 'TESTTEST' ? 1 : 1500,
          receivedAmount: formData.coupon?.toUpperCase() === 'TESTTEST' ? 1 : 1500,
          dateOfPayment: dateOfPayment,
          dateGroup: dateGroup,
          paymentId: paymentId,
          orderId: orderId
        })
      });
      console.log("Excel sync webhook fired successfully.");
    } catch (excelError) {
      console.error("Excel sync webhook failed (non-blocking):", excelError);
    }
  }

  // 2. Generate PDF Receipt
  console.log("Generating PDF receipt...");
  const pdfBytes = await generatePDF(formData, docRef.id, paymentId, orderId, dateOfPayment);
  console.log("PDF receipt generated.");

  // 3. Send Email using SMTP
  console.log("Attempting to send confirmation email to:", formData.email);
  try {
    await sendEmail(formData.email, formData.name, pdfBytes);
    console.log("Email sent successfully.");
  } catch (emailError) {
    console.error("Email delivery failed (non-blocking):", emailError);
  }

  // 4. Create Audit Log
  console.log("Recording audit log...");
  try {
    await addDoc(collection(db, 'auditLogs'), {
      timestamp: serverTimestamp(),
      action: 'REGISTRATION_COMPLETE',
      performedBy: formData.email,
      targetEntity: `registration/${docRef.id}`,
      details: `New registration for ${formData.name} (${formData.registrationNumber}) completed via ${paymentId === 'mock_payment_id' ? 'MOCK' : 'CASHFREE'}`
    });
  } catch (auditError) {
    console.error("Audit logging failed:", auditError);
  }

  return docRef.id;
}
