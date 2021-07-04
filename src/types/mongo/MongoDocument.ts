import { Document } from "mongoose";
import { DeepRequired } from "../general";

/**
 * A type for mongodb document with its document structure
 * defined as `T`.
 */
export type MongoDocument<T> = Document<unknown> & DeepRequired<T>;
