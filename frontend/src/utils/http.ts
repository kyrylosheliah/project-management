export const SERVER = "http://localhost:3000"

export const emitHttp = (method: string, path: string) =>
  fetch(SERVER + path, {
    method
  });

export const emitHttpRaw = (method: string, path: string, body: any = undefined) =>
  fetch(SERVER + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body,
  });

export const emitHttpJson = (method: string, path: string, body: any = undefined) =>
  fetch(SERVER + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });

export const emitHttpForm = (method: string, path: string, body: any = undefined) => {
  const formData = new FormData();
  body && Object.keys(body).map((key) => {
    formData.append(key, body[key]);
  });
  return fetch(SERVER + path, {
    method,
    body: formData,
  });
};