/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-14
 */

import { emailSenders } from "./email";

/**
 * CONVENTION:
 * Please **DO NOT** add any trialing slashes ("/") at the end
 * of any link.
 */
export interface ResetPasswordConfig {
  /** Email address to send emails for reset password requests. */
  emailSender: string;
  /** Root url for password reset. Token will be appended to this link.
   * Please **DO NOT** add any trialing slashes ("/") at the end. */
  passwordResetLink: string;
  /** Sendgrid template id for password reset request email. */
  requestEmailTemplateId: string;
  /** Sendgrid template id for password reset confirmation email. */
  confirmationEmailTemplateId: string;
}

export const resetPasswordConfig: ResetPasswordConfig = {
  emailSender: emailSenders.account,
  passwordResetLink: "http://localhost:5000/api/v1/users/reset-password",
  requestEmailTemplateId: "d-9c30543786c5498c9281c32e8d552683",
  confirmationEmailTemplateId: "d-c7534e35a1f5472d957df1a4b6120d1a",
};
