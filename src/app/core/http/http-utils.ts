import { HttpHeaders } from "@angular/common/http";

export function getAuthorizedHttpHeaders(): HttpHeaders {
  return new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', sessionStorage.getItem('token') as string);
}

export function getHttpOptions(params?: any) {
  if (params) {
    return {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    }
  }

  return {
    headers: getAuthorizedHttpHeaders(),
    withCredentials: true
  }
}
