import {CinemaMovie} from "@/models/cinemaMovie";

export interface CinemaSyncDto {
    movie: CinemaMovie
    iframe: string
    startedTimeSec: number
}
