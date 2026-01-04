// src/types/playlist.ts
export interface Playlist {
  id: number;
  name: string;
  copywriter: string;
  picUrl: string;
  // ...其他字段
}

export interface PlayListDetail{
  name: string;
  coverImgUrl: string;
  description: string;
  tags: string[];
}

export interface PlayListSongs{
  id: number;
  al: {
      name: string;
      picUrl: string;
  };
  ar: [{
      id: number,
      name: string
      }
    ]
}
