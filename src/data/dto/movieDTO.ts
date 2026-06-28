import {Player} from "../../models/player";
import {Movie} from "../../models/movie";
import {Link} from "../../models/link";


export interface MovieDto {
    movieInfo: Movie
    players: Player[]
    links: Link[]
}

