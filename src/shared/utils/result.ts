export type Result<T> = readonly [T, null] | readonly [null, Error];

export async function tryCatch<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return [data, null];
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }
}
