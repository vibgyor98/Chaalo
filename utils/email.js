const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.form = `Sourav Kar <${process.env.EMAIL_FROM}>`;
  }

  //create a transporter
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    //while in Development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //Format of an actual EMail
  async send(template, subject) {
    //1) Render HTML for the pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //2) Define Email options
    //define the email option
    const mailOptions = {
      from: this.form,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //3) Create a transport and send emial
    await this.newTransport().sendMail(mailOptions);
  }

  //send mail after new signup
  async sendWelcome() {
    await this.send('welcome', 'Welcome to Chaalo Company');
  }

  //send mail while reseting password
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
