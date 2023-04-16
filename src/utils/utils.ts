export function utf8_to_b64(str: string) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export function b64_to_utf8(str: string) {
  return decodeURIComponent(escape(window.atob(str)));
}

export const jsonParse = <T>(data: unknown, errorResult?: T) => {
  if (data && typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      return errorResult;
    }
  }
  return errorResult;
};
