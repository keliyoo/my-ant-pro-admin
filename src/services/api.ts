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

const api = <T = null>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<RequestResult<T>> =>
  fetch(input, init)
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`${res.status}`);
      } else {
        return res.json();
      }
    })
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
