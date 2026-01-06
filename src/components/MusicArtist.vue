<template>
    <div class="musicartist-wrapper">
        <div class="musicaritst-inner">
            <h2 class="section-title">{{ musicartist.name }}</h2>
            <div class="musicartist-cover">
                <img :src="musicartist.picUrl" :alt="musicartist.name">
            </div>
            <div class="musicartist-detail">
                <div class="music-size">
                    <div>专辑数量：{{ musicartist.albumSize }}</div>
                    <div>歌曲数量：{{ musicartist.albumSize }}</div>
                </div>
                <div class="musicartist-des">{{ musicartist.briefDesc }}</div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {computed, onMounted, reactive} from 'vue'
import api from '@/api';

import type { MusicArtist } from '@/types/musicartist';

const route = useRoute();
const artistData = computed(() => route.query);

interface MusicArtistItem{
    name: string;
    id: number;
    briefDesc: string;
    albumSize: number;
    musicSize: number;
    picUrl: string;
}

const musicartist = reactive<MusicArtistItem>({
    name: '',
    id: 0,
    briefDesc: '',
    albumSize: 0,
    musicSize: 0,
    picUrl: '',
});

// 获取歌手详情
const fetchArtist = async () => {
    try {
        const id = artistData.value.id;
        console.log(id);
        if (!id) return
        const response = await api.get<MusicArtist>('/artists?', {id});
        musicartist.name = response.artist?.name || '';
        musicartist.picUrl = response.artist?.picUrl || '';
        musicartist.briefDesc = response.artist?.briefDesc || '';
        musicartist.albumSize = response.artist?.albumSize || 0;
        musicartist.musicSize = response.artist?.musicSize || 0;
        musicartist.picUrl = response.artist?.picUrl || '';
    } catch(error){
        console.error('获取歌手失败:', error);
    }
}

onMounted(() => {
    fetchArtist();
})

</script>

<style>
    .musicartist-wrapper {
        padding: 20px;
        background-color: #f5f7fb;
        display: grid;
        justify-content: center;
    }
    .musicartist-inner {
        max-width: 1200px;
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        text-align: center; /* 让内容居中 */
        
    }
</style>