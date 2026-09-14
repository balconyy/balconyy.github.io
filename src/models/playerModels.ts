import {Player} from "@/models/player";

export interface PlayerStateError {
    message?: string
    code?: string | number | null
}

export interface PlayerState {
    isLoading: boolean
    isError: boolean
    error?: PlayerStateError | null
    data?: Player[] | null
}

export type AspectRatio = '16:9' | '12:5' | '4:3'
