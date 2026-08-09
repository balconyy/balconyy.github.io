import {TimingResponseDto} from "@/data/dto/timingResponseDto";
import {Timing} from "@/models/timing";

export function mapDtoToTiming(dto: TimingResponseDto): Timing {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}