import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Credentials } from '../../models/credentials';
import { LoginService } from '../../services/login.service';
import { Router } from '../../../../node_modules/@angular/router';
import { Store } from '../../redux/store';
import { NgRedux } from '../../../../node_modules/ng2-redux';
import { SocketService } from '../../services/socket.service';
import { ActionType } from '../../redux/action';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public credentials = new Credentials();
    public loginFailed: boolean = false;
    public user = new User();
    public alreadyLogged: boolean = false;

    constructor(private loginService: LoginService, private redux: NgRedux<Store>, private router: Router, private socket: SocketService) { }

    ngOnInit() {
    }

    public login() {
        this.loginService.login(this.credentials)
            .subscribe((user) => {

                if (user !== null) {
                    const userName = user.userName;

                    // check if user already online from another platform..
                    this.loginService.isUserloggedIn(userName)
                        .subscribe((isUser) => {
                            if (isUser.length > 0) {
                                this.alreadyLogged = true;
                                return;
                            }
                            // insert user name into session storage
                            sessionStorage.setItem("user", userName);
                            sessionStorage.setItem("isLoggedIn", "true");

                            // update redux that user logged in and can active the room page
                            const action = { type: ActionType.Login };
                            this.redux.dispatch(action);

                            // redirect to room
                            this.router.navigate(["/room"]);
                        }, response => {
                            alert("Error: " + response.error.message)
                        })
                }
                else {
                    this.loginFailed = true;
                    return;
                }
            }, response => {
                alert("Error: " + response.error.message)
            });
    }

}
