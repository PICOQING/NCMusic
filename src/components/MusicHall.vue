<template>
    <!-- 推荐歌单 -->
    <div class="hall-wrapper">
        <div class="hall-inner">
            <h2 class="section-title">推荐歌单</h2>
            <ul class="playlist-list">
                <li 
                    v-for="item in playlists"
                    :key="item.id"
                    class="playlist-item"
                    @click="handleMusicListClisk(item.id)">
                    <div class="playlist-cover">
                        <img :src="item.cover" :alt="item.name">
                    </div>
                    <div class="playlist-info">
                        <h3 class="playlist-name">{{ item.name }}</h3>
                        <p class="playlist-description">{{ item.des }}</p>
                    </div>
                </li>
            </ul>
            <!-- 推荐新音乐 -->
            <h2 class="section-title section-title-top">推荐新音乐</h2>
            <ul class="newmusic-list">
                <li 
                v-for="music in newMusics"
                :key="music.id"
                class="newmusic-item">
                    <div class="newmusic-cover">
                        <img :src="music.cover" :alt="music.name" />
                    </div>
                    <div class="newsong-info">
                        <h4 class="newmusic-name">{{ music.name }}</h4>
                        <p class="newmusic-artists">{{ music.artists }}</p>
                    </div>
                </li>
            </ul>
            <!-- 热门歌手 -->
            <h2 class="section-title section-title-top section-title-position">热门歌手</h2>
            <div class="hotsinger-carusel" v-if="hotSingers.length">
                <div class="hotsinger-carusel-track" >
                    <div v-for="(slide,index) in singerSlides" :key="index"
                        v-show="index == CurrentSignerSlide"
                        class="hotsinger-slide">
                        <ul class="hotsinger-list" :start=" 1">
                            <li 
                            v-for="(singer) in slide"
                            :key="singer.id"
                            class="hotsinger-item">
                                <div class="hotsinger-cover">
                                    <img :src="singer.picUrl" :alt="singer.name" />
                                </div>
                                <div class="hotsinger-info">
                                    <h4 class="hotsinger-name">{{ (singer.rank) }}、{{ singer.name }}</h4>
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>
                <div class="hotsinger-carusel-controls">
                    <button @click="prevSlide" class="hotsinger-carusel-controls-btn">‹</button>
                    <button @click="nextSlide" class="hotsinger-carusel-controls-btn">›</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import api from '@/api';
import { computed, onMounted, ref} from 'vue';
import type { Playlist } from '@/types/playlist';
import type { NewMusic } from '@/types/newsong';
import type { HotSingers } from '@/types/hotsinger';

// 推荐歌单数据
interface PlaylistItem {
    id: number;
    name: string;
    des: string;
    cover: string;
}

const playlists = ref<PlaylistItem[]>([]);
const fetchPlaylists = async () => {
    try {
    const response = await api.get<Playlist[]>('/personalized', {limit:5});
    playlists.value = (response.result || []).map((item) => ({
        id: item.id,
        name: item.name,
        des: item.copywriter,
        cover: item.picUrl,
    }));
    console.log('推荐歌单数据:', playlists.value);
    } catch (error) {
        console.error('获取推荐歌单失败:', error);
    }
};

// 推荐新音乐数据

interface NewMusicItem {
    id: number;
    name: string;
    cover: string;
    artists: string;
}


const newMusics = ref<NewMusicItem[]>([]);
const fetchNewMusics = async () => {
    try {
        const response = await api.get<NewMusic[]>('/personalized/newsong', {limit:10});
        newMusics.value = ( response.result || []).map((item) => ({
            id: item.id,
            name: item.name,
            cover: item.picUrl,
            artists: item.song?.artists?.map((artists) => artists.name).join('/ ') || '',
        }));
        console.log('推荐新音乐数据:', newMusics.value);
    } catch (error) {
        console.error('获取推荐新音乐失败:', error);
    }
};

// 获取热门歌手数据

interface HotSingersItem {
    id: number;
    name: string;
    picUrl: string;
    rank: number;
}
const hotSingers = ref<HotSingersItem[]>([]);
const fetchHotSingers = async () => {
    try {
        const response = await api.get<HotSingers[]>('/top/artists', {limit:20});
        hotSingers.value = (response.artists || []).map((item,index) => ({
            id: item.id,
            name: item.name,
            picUrl: item.picUrl,
            rank: index + 1
        }));
        console.log('热门歌手数据:', hotSingers.value);
    } catch (error) {
        console.error('获取热门歌手失败:', error);
    }
};

//轮播图

const CurrentSignerSlide = ref(0);

const SLIDES_PAGE_SIZE = 5;

const singerSlides = computed(() => {
    const list = hotSingers.value || [];
    const slides = [];
    for (let i = 0; i < list.length; i += SLIDES_PAGE_SIZE) {
        slides.push(list.slice(i, i + SLIDES_PAGE_SIZE));
    }
    return slides;
});

// 左右切换按钮事件
const prevSlide = () => {
    if (!singerSlides.value.length) return;
CurrentSignerSlide.value =
    (CurrentSignerSlide.value - 1 + singerSlides.value.length) %
    singerSlides.value.length;
};
const nextSlide = () => {
    if (!singerSlides.value.length) return;
    CurrentSignerSlide.value =
    (CurrentSignerSlide.value + 1) % singerSlides.value.length;
};


onMounted(() => {
    fetchPlaylists();
    fetchNewMusics();
    fetchHotSingers();
});

// 跳转歌单列表页
import { useRouter } from 'vue-router';
const router = useRouter();
const handleMusicListClisk = (id: number) => {
    if(!id) return;
    router.push({
        path: '/musicList',
        query: { id }
    });
};

</script>
<style scoped>  
    .hall-wrapper {
        padding: 20px;
        background-color: #f5f7fb;
    }
    .hall-inner {
        max-width: 1200px;
        margin: 0 auto;
    }
    .section-title {
        font-size: 24px;
        margin-bottom: 15px;
        color: #333;
    }
    .section-title-top {
        margin-top: 40px;
    }
    .section-title-position {
        text-align: center;
    }
    .playlist-list {
        display: flex;
        gap: 20px;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .playlist-item {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        width: 200px;
        cursor: pointer;
        transition: transform 0.3s;
    }
    .playlist-item:hover {
        transform: translateY(-5px);
    }
    .playlist-cover img {
        width: 100%;
        height: auto;
        display: block;
    }
    .playlist-info {
        padding: 10px;
    }
    .playlist-name {
        font-size: 12px;
        margin: 0 0 5px;
        color: #000;
    }
    .playlist-description {
        font-size: 10px;
        color: #666;
        margin: 0;
    }
    .newmusic-list {
        display: grid;
        grid-template-columns: repeat(2,1fr);
        gap: 16px 40px;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .newmusic-item {
        display: flex;
        gap: 12px;
        align-items: center;
        cursor: pointer;
    }
    .newmusic-item:hover {
        transform: translateY(-5px);
    }
    .newmusic-cover {
        width: 82px;
        height: 82px;
        border-radius: 4px;
        overflow: hidden;
        background: #eee;
        flex-shrink: 0;
        cursor: pointer;
    }
    .newmusic-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: all 0.3s ease;
    }
    .newmusic-cover:hover img {
        transform: scale(1.1);
    }
    .newmusic-info {
        padding: 10px;
    }
    .newmusic-name {
        font-size: 14px;
        margin: 0 0 5px;
        color: #000;
    }
    .newmusic-artists {
        font-size: 12px;
        color: #666;
        margin: 0;
    }
    .hotsinger-list {
        display: flex;
        gap: 5px;
        padding: 0;
        margin: 0;
        justify-content: center;
    }
    .hotsinger-item {
        background: #f5f7fb;
        overflow: hidden;
        width: 200px;
        height: auto;
        cursor: pointer;
        transition: transform 0.3s;
        text-align: center;
    }
    .hotsinger-item:hover {
        transform: translateY(-5px);
    }
    .hotsinger-cover {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 0 auto 10px;
        overflow: hidden;
        background: #eee;
    }
    .hotsinger-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: all 0.3s ease;
    }
    .hotsinger-cover:hover img {
        transform: scale(1.1);
    }
    .hotsinger-info {
        padding: 10px;
    }
    .hotsinger-name {
        font-size: 14px;
        margin: 0;
        color: #000;
    }
    .hotsinger-carusel {
        position: relative;
        overflow: hidden;
        margin-top: 20px;
    }
    .hotsinger-carusel-track {
        display: flex;
        transition: transform 0.5s ease-in-out;
    }
    .hotsinger-slide {
        min-width: 100%;
        box-sizing: border-box;
        padding: 10px 0;
    }
    .hotsinger-carusel-controls {
        position: absolute;
        top: 50%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        transform: translateY(-50%);
    }
    .hotsinger-carusel-controls button {
        background: rgba(231, 231, 231, 0.5);
        border: none;
        color: #000000;
        font-size: 24px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: all 0.3s;
    }
    .hotsinger-carusel-controls button:hover {
        background: rgba(212, 212, 212, 0.8);
    }
</style>