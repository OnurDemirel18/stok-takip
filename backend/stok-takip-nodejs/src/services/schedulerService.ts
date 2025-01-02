import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { ReportController } from '../controllers/reportController';
import { sendReportEmail } from './emailService';

const prisma = new PrismaClient();

export const initScheduler = () => {
  // Her gün saat 09:00'da
  cron.schedule('0 9 * * *', async () => {
    const users = await prisma.user.findMany({
      where: {
        emailReports: true,
        reportSchedule: 'daily'
      }
    });

    const reportData = await ReportController.getReportData();

    for (const user of users) {
      await sendReportEmail(user.email, reportData);
    }
  });

  // Her hafta Pazartesi 09:00'da
  cron.schedule('0 9 * * 1', async () => {
    const users = await prisma.user.findMany({
      where: {
        emailReports: { equals: true },
        reportSchedule: { equals: 'weekly' }
      }
    });

    const reportData = await ReportController.getReportData();

    for (const user of users) {
      await sendReportEmail(user.email, reportData);
    }
  });

  // Her ayın 1'i saat 09:00'da
  cron.schedule('0 9 1 * *', async () => {
    const users = await prisma.user.findMany({
      where: {
        emailReports: true,
        reportSchedule: 'monthly'
      }
    });

    const reportData = await ReportController.getReportData();

    for (const user of users) {
      await sendReportEmail(user.email, reportData);
    }
  });
}; 