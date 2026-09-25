export interface BoostyPostDto {
    kpId: number;
    postId: string;
    boostyChannel: string;
    dateTimestamp: number;
    streamerName: string;
    avatar: string;
    link: string;
    vid: number;
    season: number | null;
    episodeFrom: number | null;
    episodeTo: number | null;
}