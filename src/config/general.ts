/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-14
 */

export interface GeneralConfig {
  /** The domain which this server is running on. */
  serverDomain: string;
  /** Domain of emails sending from this server.
   * The `serverDomain` will be used if this field is not provided. */
  emailDomain?: string;
}

export const generalConfig = {
  serverDomain: "thepolyteam.com",
};
