/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-14
 */

/**
 * CONVENTION:
 * Please **DO NOT** add any trialing slashes ("/") at the end
 * of any link.
 */
export interface ResetPasswordConfig {
  passwordResetLink: string;
}

export const resetPasswordConfig: ResetPasswordConfig = {
  passwordResetLink: "http://localhost:5000/api/v1/users/reset-password",
};
