import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalProperty {

    //static _serverUrl: string = "https://localhost:8090";          // 로컬 테스트용
    //static _serverUrl: string = "https://158.180.86.87:8090";        // 오라클 클라우드
    static _serverUrl: string = "https://connect-one.kro.kr";    // 오라클 클라우드

    static serverUrl() {
      const url  = sessionStorage.getItem('serverUrl');
      if (url) return url;

      return this._serverUrl;
    }
}
