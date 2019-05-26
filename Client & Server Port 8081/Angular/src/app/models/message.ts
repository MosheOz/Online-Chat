import { User } from './user';

export class Message {
    public constructor(
        public _id?: string,
        public sender?: any,
        public receiver?: any,
        public messageBody?: string,
    ) { }
}