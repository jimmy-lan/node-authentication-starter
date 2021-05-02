/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */

import { SerializedHttpError } from "../../errors";

export interface ResBody {
  success: boolean;
  time?: string;
  /**
   * If request is successful, some data may be returned
   * from the server. This attribute will not be set if
   * request fails.
   */
  payload?: object;
  /**
   * If request results in an error, success will be set
   * to false and some error message will be returned.
   */
  errors?: SerializedHttpError[];
}
