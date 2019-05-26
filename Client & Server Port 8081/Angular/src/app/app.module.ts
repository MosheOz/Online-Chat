import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgRedux, NgReduxModule } from "ng2-redux";
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from "./components/login/login.component";
import { RoomComponent } from './components/room/room.component'
import { HttpClientModule } from "@angular/common/http";
import { Store } from './redux/store';
import { Reducer } from './redux/reducer';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './services/socket.service';
import { Page404Component } from './components/page404/page404.component';


const config: SocketIoConfig = { url: 'http://localhost:8081', options: {} };

@NgModule({
    declarations: [AppComponent, LoginComponent, RoomComponent, Page404Component],
    imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, NgReduxModule, CommonModule, SocketIoModule.forRoot(config)],
    providers: [SocketService],
    bootstrap: [AppComponent]
})
export class AppModule {

    public constructor(redux: NgRedux<Store>) {
        redux.configureStore(Reducer.reduce, new Store());
    }
}
