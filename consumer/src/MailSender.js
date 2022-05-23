const nodemailer = require('nodemailer');
const { NODEMAILER_CONFIG } = require('./config');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport(
      NODEMAILER_CONFIG.TRANSPORT_OPTIONS,
    );
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'OpenMusic',
      to: targetEmail,
      subject: 'Export Playlist Songs',
      text: 'Attached is the result of export playlist songs',
      attachments: [
        {
          filename: 'playlist-songs.json',
          content,
        },
      ],
    };
    return this._transporter.sendMail(message);
  }
}

module.exports = { MailSender };
