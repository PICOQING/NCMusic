// 跳转歌单列表页
import { useRouter } from 'vue-router';
const router = useRouter();
export const handleMusicListClick = (id: number) => {
    if(!id) return;
    router.push({
        path: '/musicList',
        query: { id }
    });
};

// 跳转歌曲页面
export const handleMusicPlyerClick = (songData: { id: number, name: string, cover: string }) => {
    const { id, name, cover } = songData;
    console.log(songData)
    if (!id) return
        router.push({
        path: '/musicplyer',
        query: { id,name,cover }
    });
}