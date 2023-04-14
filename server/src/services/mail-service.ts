import * as nodemailer from 'nodemailer'

class MailService {
  private readonly transporter: nodemailer.Transporter
  constructor() {
    this.transporter = nodemailer.createTransport({
    // service: 'yandex',
    host: 'smtp.yandex.ru',
    // port: 993,
    port: 465,
    secure: true,
      auth: {
        user: 'homer37@yandex.ru',
        pass: 'bwmdpoeddykjjllf',
        //  pass: '111083rom'
      },
    })
  }

  async sendActivationMail(to: string, link: string, ) {
    console.log('mail was successfully sent', to, link)
    await this.transporter.sendMail({
        from: 'homer37@yandex.ru',
        to,
        subject: 'Активация аккаунта' + process.env.API_URL,
        text: '',
        html: `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href="${link}">${link}</a>
            </div>
        `
    });
  }
}

export const mailService = new MailService()
