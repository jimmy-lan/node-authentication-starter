/*
 * Created by Jimmy Lan
 */

/**
 * Fields representing timestamp in a mongo db document.
 * We instruct mongoose to auto-populate these fields for us.
 */
export interface Timestamp {
  // These fields are automatically appended by mongodb.
  createdAt: Date;
  updatedAt: Date;
}
