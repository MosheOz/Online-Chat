import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';
import { Message } from '../models/message';
import { User } from '../models/user';
import { NgRedux } from '../../../node_modules/ng2-redux';
import { Store } from '../redux/store';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private httpClient: HttpClient, private redux: NgRedux<Store>) { }

    public getSender(name): Observable<User> {
        return this.httpClient.get<User>(`http://localhost:8081/api/get-sender-details/${name}`);
    }

    public getReceiver(name): Observable<User> {
        return this.httpClient.get<User>(`http://localhost:8081/api/get-receiver-details/${name}`);
    }

    public getMessagesByID(senderID, receiverID): Observable<Message[]> {
        return this.httpClient.get<Message[]>(`http://localhost:8081/api/get-messages/${senderID}/${receiverID}`);
    }

    public sendMsg(message): Observable<Message> {
        return this.httpClient.post<Message>("http://localhost:8081/api/add-message", message);
    }

}
