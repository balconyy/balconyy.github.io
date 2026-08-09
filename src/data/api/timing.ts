import {baseClient} from "@/data/http";
import {TimingRequestDto} from "@/data/dto/timingRequestDto";
import {TimingResponseDto} from "@/data/dto/timingResponseDto";

export const timingApi = {
    getTimings(kpId: number) {
        return baseClient.get<TimingResponseDto[]>(`/timings/${kpId}`, {
            withCredentials: true,
        });

    },
    saveTiming(timing: TimingRequestDto) {
        return baseClient.post("/timings", timing, {
            withCredentials: true,
        });
    },

    deleteTiming(timingId: number) {
        return baseClient.delete(`/timings/${timingId}`, {
            withCredentials: true,
        });
    }

};