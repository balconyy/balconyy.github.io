import {baseClient} from "@/data/http";

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