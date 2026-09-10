import {baseClient} from "../http";
import {Config} from "@/models/config";

export const panelApi = {
    getConfig() {
        return baseClient.get<Config>("/config");
    },
    setConfig(config: Config) {
        return baseClient.post(
            `/admin/config`,
            config,
            {withCredentials: true}
        );
    },
    syncStreamerRating() {
        return baseClient.get(
            `/admin/kp/sync`,
            {withCredentials: true}
        );
    },
    setCinemaMovie(kpId: number) {
        return baseClient.post(
            `/admin/cinema/set`,
            kpId,
            {withCredentials: true}
        );
    },
    skipCinemaMovie() {
        return baseClient.get(
            `/admin/cinema/skip`,
            {withCredentials: true}
        );
    },
    stopCinemaPlaying() {
        return baseClient.get(
            `/admin/cinema/stop`,
            {withCredentials: true}
        );
    },
    autoplay(value: boolean) {
        return baseClient.post(
            `/admin/cinema/autoplay`,
            value,
            {withCredentials: true}
        );
    }
};
