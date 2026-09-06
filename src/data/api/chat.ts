import {baseClient} from "@/data/http";
import {Message} from "@/models/message";

export const chatApi = {
    getMessages() {
        return baseClient.get<Message[]>("/chat/messages", {
            withCredentials: true,
        });
    },
    sendMessage(message: string) {
        return baseClient.post<void, MessageRequest>("/chat/send", {message}, {
            withCredentials: true,
        });
    }
};