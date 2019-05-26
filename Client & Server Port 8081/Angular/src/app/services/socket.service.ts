import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from '../../../node_modules/rxjs';
import { Message } from '../models/message';

@Injectable()
export class SocketService {

    constructor(public socket: Socket) { }

    // create login event
    public login(name) {
        this.socket.emit("login", name);
    }

    public findHwoIsOnline() {
        this.socket.emit("findHwoIsOnline");
    }

    public sendMessage(msg: Message) {
        this.socket.emit("message", msg);
    }
    // get the message back from the event
    getMessages() {
        let observable = new Observable(observer => {
            this.socket.on('message', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    getOnlineUsers() {
        let observable = new Observable(observer => {
            this.socket.on('login', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    getdisconnectedUser() {
        let observable = new Observable(observer => {
            this.socket.on('disconnect', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
}