import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    async sendConfirmationEmail(email: string, token: string) {
        const port = process.env.PORT || 3000;
        const confirmUrl = `http://localhost:${port}/api/confirm/${token}`;

        await this.transporter.sendMail({
            from: '"Weather App" <no-reply@weather.app>',
            to: email,
            subject: 'Please confirm your subscription',
            html: `
        <h3>Weather Subscription</h3>
        <p>Click the link below to confirm your subscription:</p>
        <a href="${confirmUrl}">${confirmUrl}</a>
      `,
        });
    }
    async sendWeatherUpdate(email: string, text: string) {
        await this.transporter.sendMail({
            from: '"Weather Updates" <no-reply@weather.app>',
            to: email,
            subject: 'Your weather update',
            text,
        });
    }

}

