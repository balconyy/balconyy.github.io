import {baseClient} from "@/data/http";
import {User} from "@/models/user";

export const userApi = {
    me() {
        return baseClient.get<User>("/auth/me", {
            withCredentials: true,
        });
    },
    logout() {
        return baseClient.get("/logout", {
            withCredentials: true,
        });
    }
};