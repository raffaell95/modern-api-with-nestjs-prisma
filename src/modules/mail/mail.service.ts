import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MAIL_SERVICE, SEND_PASSWORD_RESET } from 'src/consts';

@Injectable()
export class MailService {
    constructor(@Inject(MAIL_SERVICE) private client: ClientProxy) {}

    async sendPasswordReset(email: string, token: string) {
        const url = `http://localhost:3000/v1/auth/reset-password?token=${token}`

        this.client.emit(SEND_PASSWORD_RESET, { email, url })
    }
}
