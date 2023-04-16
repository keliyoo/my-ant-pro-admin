export type RequestFail = {
  success: false;
  msg: string;
  result?: null;
};
export type RequestSuccess<T = null> = {
  success: true;
  msg?: string;
  result: T;
};
export type RequestResult<T = null> = RequestFail | RequestSuccess<T>;

const api = <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<RequestResult<T>> =>
  fetch(input, init)
    .then((res) => res.json())
    .then(
      (res: T) =>
        ({
          success: true,
          result: res,
        } as const),
    )
    .catch(() => ({
      success: false,
      msg: '请求失败',
    }));

export default api;
