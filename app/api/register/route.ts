import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PDFDocument, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Save data to Firestore Registration Collection
    const registrationsRef = collection(db, 'registrations');
    const docRef = await addDoc(registrationsRef, {
      ...data,
      // Mapping the complex form to simpler representation if needed, but keeping all
      name: data.name,
      email: data.email,
      phone: data.mobile, // standardizing based on old code
      rollNumber: data.registrationNumber, // mapping
      branch: data.cohortNameNumber, // mapped for old code compat
      year: "Fresher", 
      hasEntered: false,
      registeredAt: serverTimestamp(),
    });

    // 2. Generate PDF Receipt using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    
    page.drawText('AARAMBH 2026 REGISTRATION RECEIPT', { x: 50, y: height - 50, size: 20 });
    page.drawText(`Registration ID: ${docRef.id}`, { x: 50, y: height - 80, size: 12 });
    page.drawText(`Date: ${new Date().toLocaleString()}`, { x: 50, y: height - 100, size: 12 });
    
    page.drawText('Student Details:', { x: 50, y: height - 140, size: 16 });
    page.drawText(`Name: ${data.name}`, { x: 50, y: height - 160, size: 12 });
    page.drawText(`Registration No: ${data.registrationNumber}`, { x: 50, y: height - 180, size: 12 });
    page.drawText(`Email: ${data.email}`, { x: 50, y: height - 200, size: 12 });
    page.drawText(`Mobile: ${data.mobile}`, { x: 50, y: height - 220, size: 12 });
    page.drawText(`Cohort: ${data.cohortNameNumber}`, { x: 50, y: height - 240, size: 12 });
    
    page.drawText('Parents Details:', { x: 50, y: height - 280, size: 16 });
    page.drawText(`Father: ${data.fatherName} (${data.fatherMobile})`, { x: 50, y: height - 300, size: 12 });
    page.drawText(`Mother: ${data.motherName} (${data.motherMobile})`, { x: 50, y: height - 320, size: 12 });
    
    page.drawText('Address:', { x: 50, y: height - 360, size: 16 });
    page.drawText(`${data.address}`, { x: 50, y: height - 380, size: 12 });

    page.drawText('Payment Status: SUCCESS', { x: 50, y: height - 420, size: 16, color: rgb(0, 0.5, 0) });

    const pdfBytes = await pdfDoc.save();

    // 3. Send Email using nodemailer
    // Note: We are using a test account / mock transport for demo.
    // In production, configure with actual SMTP credentials (e.g., SendGrid, AWS SES)
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'mock_user', 
        pass: 'mock_pass',
      },
    });

    try {
      // We will just log this as success since we are mocking
      console.log(`[MOCK EMAIL SEND] Sending receipt to ${data.email} with PDF attachment.`);
      console.log(`[MOCK EMAIL SEND] Email sent successfully.`);
      
      // If we had real creds, it would be:
      /*
      await transporter.sendMail({
        from: '"Aarambh 2026" <noreply@aarambh26.com>',
        to: data.email,
        subject: "Your Aarambh'26 Registration Receipt",
        text: "Thank you for registering for Aarambh'26. Please find your receipt attached.",
        attachments: [
          {
            filename: 'Aarambh_Receipt.pdf',
            content: Buffer.from(pdfBytes)
          }
        ]
      });
      */
    } catch (emailError) {
      console.error("Email sending failed (expected if mocking without real creds): ", emailError);
      // We don't fail the registration if email fails in demo
    }

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to process registration' }, { status: 500 });
  }
}
