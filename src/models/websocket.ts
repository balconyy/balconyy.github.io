import {Message} from "@/models/message";
import {CinemaSyncDto} from "@/data/dto/cinemaSyncDto";

export type WebSocketEvent =
    | { type: 'count'; scope: string | null; count: number }
    | { type: 'message'; message: Message }
    | ({ type: 'cinema_sync' } & CinemaSyncDto)
    | { type: 'cinema_stop' }

