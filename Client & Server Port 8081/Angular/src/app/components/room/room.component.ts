import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user';
import { NgRedux } from '../../../../node_modules/ng2-redux';
import { Store } from '../../redux/store';
import { ActionType } from '../../redux/action';
import { Message } from '../../models/message';
import { SocketService } from '../../services/socket.service';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

    public user: object;
    public users: User[];
    public messages: Message[];
    public message = new Message();
    public sender: User;
    public receiver: User;
    public msg: any;

    constructor(private loginService: LoginService, private redux: NgRedux<Store>, private socket: SocketService, private chatService: ChatService) { }

    ngOnInit() {
        // on init, get all sent and received msgs and push then into the convarsation        
        this.socket.getMessages().subscribe((msg) => {
            if (this.messages !== undefined) {
                this.messages.push(msg);
            }
        })

        // prevent refresh issues with socket with this event every refrehs;
        const currentUser = sessionStorage.getItem("user");
        this.socket.login(currentUser);

        // get all users and display their online status
        this.loginService.getUsers()
            .subscribe((users) => {
                const current = sessionStorage.getItem("user");

                for (let i = 0; i < users.length; i++) {
                    if (users[i].userName === current) {
                        users.splice(i, 1);
                    }
                }

                this.users = users;

                const action = { type: ActionType.CurrentUser, payload: current };
                this.redux.dispatch(action);
            })

        // get onlilne users
        this.socket.getOnlineUsers()
            .subscribe((username) => {
                const userToLogin = username;
                const current = sessionStorage.getItem("user");

                if (this.users !== undefined) {
                    for (let i = 0; i < this.users.length; i++) {
                        if (this.users[i].userName === current) {
                            this.users.splice(i, 1);
                        }
                        if (this.users[i].userName === userToLogin) {
                            this.users[i].login = true;
                        }
                    }
                }
            })

        // get user disconnected and mark him as logged out
        this.socket.getdisconnectedUser()
            .subscribe((username) => {
                const userToLogOut = username;
                const current = sessionStorage.getItem("user");

                if (this.users !== undefined) {
                    for (let i = 0; i < this.users.length; i++) {
                        if (this.users[i].userName === current) {
                            this.users.splice(i, 1);
                        }
                        if (this.users[i].userName === userToLogOut) {
                            this.users[i].login = false;
                        }
                    }
                }
            })


        // get the current user using redux subscription
        this.redux.subscribe(() => {
            this.user = this.redux.getState().user;
        })

    }

    // on user click, start convs
    public startConvs(receiver) {

        const msgReceiver = receiver;
        const sender = sessionStorage.getItem("user");

        //get current user - sender
        this.chatService.getSender(sender)
            .subscribe((sender) => {
                if (sender !== null) {
                    this.sender = sender;

                    // get current receiver
                    this.chatService.getReceiver(msgReceiver)
                        .subscribe((receiver) => {
                            if (receiver !== null) {
                                this.receiver = receiver;

                                //get the old conversetion between sender and receiver
                                this.chatService.getMessagesByID(this.sender._id, this.receiver._id)
                                    .subscribe((messages) => {
                                        if (messages !== null) {
                                            this.messages = messages;
                                        }
                                    }, response => {
                                        alert("Error: " + response.error.message)
                                    })
                            }

                        }, response => {
                            alert("Error: " + response.error.message)
                        })
                }
            }, response => {
                alert("Error: " + response.error.message)
            })

        //update redux with receiver details
        const action = { type: ActionType.getReceiver, payload: receiver };
        this.redux.dispatch(action);
    }

    // on submit form click 
    public sendMsg() {
        // build the message with sender- receiver details
        this.message.receiver = this.receiver._id;
        this.message.sender = this.sender._id;

        // add this msg to DB
        this.chatService.sendMsg(this.message)
            .subscribe((message) => {

                this.message.receiver = this.receiver;
                this.message.sender = this.sender;
                // create msg event
                this.socket.sendMessage(this.message);

            }, response => {
                alert("Error:" + response.error.message);
            });
    }

    ngOnDestroy(): void {

    }
}
