import {Movie} from "@/models/movie";
import {SearchDTO} from "../dto/searchDTO";


export class SearchMapper {
    static toDomain(dto: SearchDTO): Movie {
        return {
            kpId: dto.filmId,
            titleMain: dto.nameRu,
            titleSecond: dto.nameEn,
            posterUrl: dto.posterUrlPreview,
            year: dto.year,
            type: dto.type,
            ratingKP: dto.rating,
        };
    }

    static toDomainList(dtoList: SearchDTO[]): Movie[] {
        return dtoList.map(this.toDomain);
    }
}