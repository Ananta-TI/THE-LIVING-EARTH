export interface ActionResult<T = undefined> {
  readonly ok: boolean;
  readonly message?: string;
  readonly error?: string;
  readonly fieldErrors?: Record<string, string>;
  readonly data?: T;
}

export function successResult<T = undefined>(
  message: string,
  data?: T,
): ActionResult<T> {
  return { ok: true, message, data };
}

export function errorResult<T = undefined>(
  error: string,
  fieldErrors?: Record<string, string>,
): ActionResult<T> {
  return { ok: false, error, fieldErrors };
}
