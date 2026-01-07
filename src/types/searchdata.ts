export interface SearchData{
    songs: {
        id: number;
        name: string;
        al:{
            picUrl: string;
        }
        ar: {
            id: number;
            name: string;
        }[]
    }[]
}