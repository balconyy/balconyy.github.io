export interface BoostyMovieCardDto {
    kpId: number;
    titleMain: string;
    titleSecond: string | null;
    year: number;
    posterUrl: string;
    movieType: string;
    streamerId: number;
    boostyChannel: string;
    streamerRate: number | null;
    postId: string;
    vid: number;
    dateTimestamp: number;
    season: number | null;
    episodeFrom: number | null;
    episodeTo: number | null;
}