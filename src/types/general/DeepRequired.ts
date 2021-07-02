/**
 * Mark all keys in type `T` as `Required`.
 */
export type DeepRequired<T> = {
  [K in keyof T]: Required<DeepRequired<T[K]>>;
};
