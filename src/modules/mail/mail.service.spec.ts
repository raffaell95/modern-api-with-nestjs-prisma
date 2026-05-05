import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailModule } from './mail.module';

describe('MailService', () => {
  let service: MailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule],
    }).compile()

    service = module.get<MailService>(MailService)
  })

  it('should be able to send the forgot password e-mail', async () => {
    jest.spyOn(service, 'sendPasswordRequest').mockImplementation()
    await service.sendPasswordRequest('email', 'token')
    expect(service.sendPasswordRequest).toHaveBeenCalledTimes(1)
  })
})
