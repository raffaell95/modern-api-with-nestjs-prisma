import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'node:path';
import Handlebars from 'handlebars';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import strict from 'node:assert/strict';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EMAIL_QUEUE, MAIL_SERVICE } from 'src/consts';
import { MailConsumer } from './mail.consumer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: `"Project NestJS" <no-reply@project-nestjs.com>`,
      },
      template: {
        dir: path.join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }),
    ClientsModule.register([
      {
        name: MAIL_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: EMAIL_QUEUE,
          queueOptions: { durable: true }
        }

      }
    ])
  ],
  providers: [MailService],
  exports: [MailService, ClientsModule],
  controllers: [MailConsumer]
})
export class MailModule { }
