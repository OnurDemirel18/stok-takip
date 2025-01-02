import nodemailer from 'nodemailer';
import { createStockReport } from './pdfService';
import { createStockExcel } from './excelService';
import { Buffer } from 'buffer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendReportEmail = async (to: string, data: any) => {
  try {
    const pdfBuffer = await createStockReport(data);
    const excelBuffer = await createStockExcel(data);
    
    await transporter.sendMail({
      from: `"Stok Takip Sistemi" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Günlük Stok Raporu',
      html: `
        <h2>Günlük Stok Raporu</h2>
        <p>Merhaba,</p>
        <p>Günlük stok raporunuz ekte yer almaktadır.</p>
        <p>İyi çalışmalar,<br>Stok Takip Sistemi</p>
      `,
      attachments: [
        {
          filename: 'stok-raporu.pdf',
          content: Buffer.from(pdfBuffer)
        },
        {
          filename: 'stok-raporu.xlsx',
          content: Buffer.from(excelBuffer)
        }
      ]
    });

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}; 