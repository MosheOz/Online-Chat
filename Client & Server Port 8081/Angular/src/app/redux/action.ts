export enum ActionType {
    CurrentUser,
    OtherUsers,
    getReceiver,
    Login
}

export interface Action {
    type: ActionType,
    payload?: any
}