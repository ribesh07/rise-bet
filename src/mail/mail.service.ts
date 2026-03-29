import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // your Mailcow SMTP host
      port: process.env.MAIL_PORT, // usually 587 for TLS, 465 for SSL
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.MAIL_USER, // your Mailcow email
        pass: process.env.MAILCOW_PASSWORD, // email password
      },
      tls: {
            rejectUnauthorized: false, // allow self-signed certs
        },
    });
  }

  async sendOtp(to: string, otp: string) {
    const mailOptions = {
      from: '"Rise" <info@playrise.vip>', // sender address
      to: to, // recipient
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`, // plain text body
      html: `<p>Your OTP is: <b>${otp}</b></p>`, // html body
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
