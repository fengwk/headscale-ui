import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, mergeMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  ///Machine api start
  machineList(user: string): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.get(`/api/v1/node?user=${user}`)
    }else{
      return this.http.get(`/api/v1/machine?user=${user}`)
    }
  }

  machineRegister(user: string, key: string): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.post(`/api/v1/node/register?user=${user}&key=${key}`, null);
    }else{
      return this.http.post(`/api/v1/machine/register?user=${user}&key=${key}`, null);
    }
  }

  machineDetail(machineId: string): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.get(`/api/v1/node/${machineId}`);
    }else{
      return this.http.get(`/api/v1/machine/${machineId}`);
    }
  }

  machineExpire(machineId: string): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.post(`/api/v1/node/${machineId}/expire`, null);
    }else{
      return this.http.post(`/api/v1/machine/${machineId}/expire`, null);
    }
  }

  machineDelete(machineId: string): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.delete(`/api/v1/node/${machineId}`);
    }else{
      return this.http.delete(`/api/v1/machine/${machineId}`);
    }
  }

  machineRename(machineId: string, name: string): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.post(`/api/v1/node/${machineId}/rename/${name}`, null);
    }else{
      return this.http.post(`/api/v1/machine/${machineId}/rename/${name}`, null);
    }
  }

  machineRoutes(machineId: string): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.get(`/api/v1/node/${machineId}/routes`);
    }else{
      return this.http.get(`/api/v1/machine/${machineId}/routes`);
    }
  }

  machineTag(machineId: string, tags: Array<string>): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.post(`/api/v1/node/${machineId}/tags`, {tags});
    }else{
      return this.http.post(`/api/v1/machine/${machineId}/tags`, {tags});
    }
  }

  machineChangeUser(machineId: string, user: string): Observable<any> {
    let version = localStorage.getItem('hsVersion') ?? 'v0.23';
    if (version == 'v0.23'){
      return this.http.post(`/api/v1/node/${machineId}/user?user=${user}`, null);
    }else{
      return this.http.post(`/api/v1/machine/${machineId}/user?user=${user}`, null);
    }
  }


  ///User api start
  userList(): Observable<any> {
    return this.http.get('/api/v1/user')
  }

  userAdd(name: string): Observable<any> {
    return this.http.post('/api/v1/user', {name});
  }

  userDetail(name: string): Observable<any> {
    return this.http.get(`/api/v1/user/${name}`);
  }

  userDelete(name: string): Observable<any> {
    return this.http.delete(`/api/v1/user/${name}`);
  }

  userRename(old: string, name: string): Observable<any> {
    return this.http.post(`/api/v1/user/${old}/rename/${name}`, {});
  }


  ///route api start
  routeList(): Observable<any> {
    // return this.http.get(`/api/v1/routes`);
    return of({routes:[]});
  }

  routeDelete(id: string): Observable<any> {
    // return this.http.delete(`/api/v1/routes/${id}`);
    return of({});
  }

  routeEnable(id: string): Observable<any> {
    // return this.http.post(`/api/v1/routes/${id}/enable`, null);
    return of({});
  }

  routeDisable(id: string): Observable<any> {
    // return this.http.post(`/api/v1/routes/${id}/disable`, null);
    return of({});
  }

  ///preauth key start
  preAuthKeyList(user: string): Observable<any> {
    if (user) {
      return this.userList().pipe(mergeMap(x => {
        for (var u of x.users) {
          if (u.name === user) {
            var url = `/api/v1/preauthkey?user=${u.id}`;
            return this.http.get(url);
          }
        }
        return of({preAuthKeys:[]});
      }));
    } else {
      var url = `/api/v1/preauthkey`
      return this.http.get(url);
    }
  }

  preAuthKeyAdd(user: string, expiration: string, aclTags: Array<string> = [], reusable = false, ephemeral = false): Observable<any> {
    return this.userList().pipe(mergeMap(x => {
      for (var u of x.users) {
        if (u.name === user) {
          return this.http.post('/api/v1/preauthkey', {user: u.id, reusable, ephemeral, aclTags, expiration})
        }
      }
      return of({});
    }));
  }

  preAuthKeyExpire(user: any, key: string): Observable<any> {
    return this.http.post('/api/v1/preauthkey/expire', {user: user.id, key});
  }

  ///api key start
  apikeyList(): Observable<any> {
    return this.http.get(`/api/v1/apikey`);
  }

  apikeyCreate(expiration: string): Observable<any> {
    return this.http.post('/api/v1/apikey', {expiration});
  }

  apikeyExpire(prefix: string): Observable<any> {
    return this.http.post('/api/v1/apikey/expire', {prefix});
  }
}
