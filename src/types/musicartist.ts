export interface MusicArtist {
    name: string;
    id: number;
    briefDesc: string;
    albumSize: number;
    musicSize: number;
    picUrl: string;
}

export interface ArtistSongs{
    name: string;
    id: number;
    picUrl?: string;
    ar: {
        name: string;
        id: number;
    }[];
}