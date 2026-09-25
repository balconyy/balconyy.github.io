export enum TabId {
    Search = 0,
    History = 1,
    Vods = 2,
    Popular = 3,
}

export interface Tab {
    id: TabId
    label: string
}