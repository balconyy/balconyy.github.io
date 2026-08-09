import {MovieKp} from "@/models/movieKp";
import {SearchDTO} from "../dto/searchDTO";


export class SearchMapper {
    static toDomain(dto: SearchDTO): MovieKp {
        return {
            kpId: dto.filmId,
            titleMain: dto.nameRu,
            titleSecond: dto.nameEn,
            posterUrl: dto.posterUrlPreview,
            year: dto.year,
            type: dto.type,
        };
    }

    static toDomainList(dtoList: SearchDTO[]): MovieKp[] {
        return dtoList.map(this.toDomain);
    }
}