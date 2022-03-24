import { MessageType } from "./MessageType";

export interface Message {
    type: MessageType;
    data: any;
}
