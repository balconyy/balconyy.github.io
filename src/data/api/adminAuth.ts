import {baseClient} from "../http";

export const adminAuthApi = {
    login(login: string, password: string) {
        return baseClient.post("/admin/auth", {
            login: login, password: password
        }, {withCredentials: true,});
    },
    check() {
        return baseClient.get(`/admin/auth/check`, {withCredentials: true});
    }
};