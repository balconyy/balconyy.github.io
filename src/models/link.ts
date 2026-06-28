export interface Link {
    type: LinkType
    id: string
}


export type LinkType = 'KP' | 'LETTERBOXD' | 'IMDB' | string