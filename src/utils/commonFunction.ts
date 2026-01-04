import type { Router } from 'vue-router'; // 导入 Router 类型，用于类型提示
// 跳转歌单列表页
export const handleMusicListClick = (router: Router,id: number) => {
    if(!id) return;
    router.push({
        path: '/musicList',
        query: { id }
    });
};

// 跳转歌曲页面
export const handleMusicPlyerClick = (router: Router,songData: { id: number, name: string, cover: string }) => {
    const { id, name, cover } = songData;
    console.log(songData)
    if (!id) return
        router.push({
        path: '/musicplyer',
        query: { id,name,cover }
    });
}