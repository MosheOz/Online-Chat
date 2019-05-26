import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';
import { User } from '../models/user';
import { Online } from '../models/online';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private httpClient: HttpClient) { }

    public login(credentials): Observable<User> {
        return this.httpClient.get<User>(`http://localhost:8080/api/user/${credentials.userName}/${credentials.password}`);
    }

    public isUserloggedIn(username): Observable<Online[]> {
        return this.httpClient.get<Online[]>(`http://localhost:8080/api/users-online/${username}`);
    }

    public getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>("http://localhost:8080/api/users");
    }

    public loginTrue(_id, user): Observable<User> {
        return this.httpClient.put<User>("http://localhost:8080/api/user-change-status-login/"+_id, user);
    }
}
