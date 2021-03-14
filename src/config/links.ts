/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-14
 * Description:
 *     This configuration file stores information relating to links.
 */

/**
 * CONVENTION:
 * Please **DO NOT** add any trialing slashes ("/") at the end
 * of any link.
 */
export interface LinksConfig {
  passwordReset: string;
}

export const linksConfig: LinksConfig = {
  passwordReset: "http://localhost:5000/api/v1/users/reset-password",
};
