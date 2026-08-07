import {Player} from "@/models/player";
import {MovieInfo} from "@/models/movie";


export interface MovieDto {
    movie: MovieInfo
    players: Player[]
}

