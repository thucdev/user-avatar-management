import * as nodemailer from 'nodemailer';

export class MailService {
  constructor() {}

  async sendDummyEmail(
    subject: string,
    content: string,
    toEmail: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password',
      },
    });

    await transporter.sendMail({
      from: 'your_email@gmail.com',
      to: toEmail,
      subject,
      text: content,
    });
  }
}
