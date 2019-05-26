import { Store } from './store';
import { Action } from './action';
import { ActionType } from './action';

export class Reducer {
    public static reduce(oldStore: Store, action: Action): Store {
        const newStore = { ...oldStore };

        switch (action.type) {

            case ActionType.CurrentUser:
                newStore.user = action.payload;
                break;

            case ActionType.OtherUsers:
                newStore.users = action.payload;
                break;

            case ActionType.getReceiver:
                newStore.receiver = action.payload;
                break;

            case ActionType.Login:
                newStore.isLoggedIn = true;
                break;
        }

        return newStore;
    }
}
