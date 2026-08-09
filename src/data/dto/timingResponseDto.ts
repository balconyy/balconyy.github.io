import {TimingState} from "@/models/timing";

export interface TimingResponseDto {
    id: number
    nickname: string
    nameColor: string | null
    timingText: string
    state: TimingState
    isOwner: boolean
    createdAt: string
}
