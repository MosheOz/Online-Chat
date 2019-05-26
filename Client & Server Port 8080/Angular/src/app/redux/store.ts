import { User } from '../models/user';

export class Store {
    public user: any;
    public users: User[];
    public receiver: User;
    public isLoggedIn: boolean;

    public constructor() {
        if (sessionStorage.getItem("isLoggedIn") === "true") {
            this.isLoggedIn = true;
        }
        
        if (sessionStorage.getItem("user")) {
            this.user = (sessionStorage.getItem('user'));
        }
    }
}
