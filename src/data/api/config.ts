import {baseClient} from "../http";
import {Config} from "@/models/config";

export const configApi = {
    getConfig() {
        return baseClient.get<Config>("/config");
    },
    setConfig(config: Config) {
        return baseClient.post(
            `/admin/config`,
            config,
            {withCredentials: true}
        );
    }
};