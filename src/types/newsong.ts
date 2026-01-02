// import { Artist, Song, } from './newsong';
// 推荐新音乐数据类型
export interface NewMusic {
    id: number;
    name: string;
    picUrl: string;
    song: {
        artists:{ name: string }[];
    };
  // ...其他字段
}
