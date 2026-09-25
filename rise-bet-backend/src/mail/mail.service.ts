import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly logger = new Logger(MailService.name);
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
    const host =
      this.config.get<string>('SMTP_HOST') ||
      this.config.get<string>('MAIL_HOST');
    const portRaw =
      this.config.get<string>('SMTP_PORT') ||
      this.config.get<string>('MAIL_PORT') ||
      '587';
    const port = Number(portRaw);
    const user =
      this.config.get<string>('SMTP_USER') ||
      this.config.get<string>('MAIL_USER');
    const pass =
      this.config.get<string>('SMTP_PASS') ||
      this.config.get<string>('MAILCOW_PASSWORD') ||
      this.config.get<string>('MAIL_PASSWORD');
    const secureRaw = this.config.get<string>('SMTP_SECURE');
    const secure = secureRaw === 'true' || port === 465;

    this.fromAddress =
      this.config.get<string>('MAIL_FROM') ||
      (user ? `"RiseBet" <${user}>` : '"RiseBet" <no-reply@playrise.vip>');

    const transportOptions: SMTPTransport.Options = {
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      tls: { rejectUnauthorized: false },
    };

    try {
      this.transporter = nodemailer.createTransport(transportOptions);
    } catch (err) {
      this.logger.error(
        'Failed to create nodemailer transport — mail will not send: ' +
          (err instanceof Error ? err.message : String(err)),
      );
      throw err;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
      return true;
    } catch (err) {
      this.logger.error(
        'SMTP verify failed: ' + (err instanceof Error ? err.message : String(err)),
      );
      return false;
    }
  }

  async sendOtp(to: string, otp: string) {
    const mailOptions = {
      from: this.fromAddress,
      to,
      subject: 'Your RiseBet OTP Code',
      text: `Your RiseBet one-time code is: ${otp}\n\nThis code expires in 10 minutes.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
          <div style="background: linear-gradient(135deg, #111 0%, #1f1a0f 100%); border-radius: 12px; padding: 28px; color: #f7e28d; text-align: center;">
            <h2 style="margin: 0 0 8px; font-size: 20px;">RiseBet Verification</h2>
            <p style="margin: 0; font-size: 13px; color: rgba(247,226,141,0.7);">One-time passcode</p>
          </div>
          <div style="padding: 28px; border: 1px solid #e9e3c7; border-top: none; border-radius: 0 0 12px 12px; background: #fffdf4;">
            <p style="margin: 0 0 16px;">Hi there,</p>
            <p style="margin: 0 0 20px;">Use the code below to verify your request. It expires in 10 minutes.</p>
            <div style="background: #111; color: #f7e28d; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 18px 16px; border-radius: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
            <p style="margin: 20px 0 0; font-size: 12px; color: #6b634a;">If you didn't request this code, ignore this email.</p>
          </div>
        </div>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent to ${to} (msgId=${info.messageId})`);
      return info;
    } catch (error) {
      this.logger.error(
        `Failed to send OTP email to ${to}: ` +
          (error instanceof Error ? error.message : String(error)),
      );
      throw error;
    }
  }
}
