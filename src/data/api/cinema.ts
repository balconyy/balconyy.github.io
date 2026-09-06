import {baseClient} from "@/data/http";
import {CinemaSyncDto} from "@/data/dto/cinemaSyncDto";

export const cinemaApi = {
    getSync() {
        return baseClient.get<CinemaSyncDto>('/cinema/sync')
    },
}
