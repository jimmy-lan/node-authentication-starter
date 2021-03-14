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
    public text?: string,
    public html?: string
  ) {
    sgMail.setApiKey(process.env.SENDGRID_KEY!);
  }

  async send() {
    const { recipient, from, subject, html, text } = this;
    if (!from || !text || !html) {
      throw new Error("Attributes 'from', 'text', 'html' must be provided.");
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

export class TemplateEmailSender {
  constructor(
    public recipient?: string,
    public from?: string,
    public templateId?: string,
    public dynamicTemplateData?: { [p: string]: string }
  ) {
    sgMail.setApiKey(process.env.SENDGRID_KEY!);
  }

  async send() {
    const { recipient, from, templateId, dynamicTemplateData } = this;
    if (!from || !templateId) {
      throw new Error("Attributes 'from', 'templateId' must be provided.");
    }
    const email: sgMail.MailDataRequired = {
      to: recipient,
      from,

      templateId,
      dynamicTemplateData,
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

  setDynamicTemplateData(dynamicTemplateData: { [p: string]: string }) {
    this.dynamicTemplateData = dynamicTemplateData;
    return this;
  }

  setTemplateId(templateId: string) {
    this.templateId = templateId;
    return this;
  }
}
