/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-13
 */

import sgMail from "@sendgrid/mail";

export class EmailSender {
  constructor(
    public recipient?: string,
    public from?: string,
    public subject?: string,
    public text: string = "",
    public html: string = ""
  ) {
    sgMail.setApiKey(process.env.SENDGRID_KEY!);
  }

  async send() {
    const { recipient, from, subject, html, text } = this;
    if (!from) {
      throw new Error("Attribute 'from' must be provided.");
    }
    const email: sgMail.MailDataRequired = {
      to: recipient,
      from,
      subject,
      text,
      html,
    };
    return await sgMail.send(email);
  }

  // Build methods

  setRecipient(recipient: string) {
    this.recipient = recipient;
    return this;
  }

  setFrom(from: string) {
    this.from = from;
    return this;
  }

  setSubject(subject: string) {
    this.subject = subject;
    return this;
  }

  setText(text: string) {
    this.text = text;
    return this;
  }

  setHtml(html: string) {
    this.html = html;
    return this;
  }
}
