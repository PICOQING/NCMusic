<template>
    <div class="playlist-wrapper">
        <div class="playlist-inner">
            <div class="playlist-info">
                <div class="playlist-cover">
                    <img :src="playlistdetail.covimg" alt="歌单封面">
                </div>
                <div class="" >{{playlistdetail.name}}</div>
                <div>{{ playlistdetail.des }}</div>
            </div>

        </div>
    </div>

</template>

<script setup lang="ts">
import { computed, onMounted, reactive} from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';

import type { PlayListDetail } from '@/types/playlist';

const route = useRoute();
const playlistId = computed(() => route.query.id)
// 获取歌单详情

interface PlayListDetailItem{
  name: string;
  covimg: string;
  des: string;
  tags: string[];
}

const playlistdetail = reactive<PlayListDetailItem>({
  name: '',
  covimg: '',
  des: '',
  tags: []
});
const fetchPlayListDetail = async() => {
    try {
        const id = playlistId.value
        if(!id) return
        const response = await api.get<PlayListDetail>("/playlist/detail?", { id })
        const detail = response.playlist
        playlistdetail.name = detail?.name || "歌曲列表";
        playlistdetail.covimg = detail?.coverImgUrl || "";
        playlistdetail.des = detail?.description || "";
        playlistdetail.tags = detail?.tags || [];

        console.log(playlistdetail)
    }catch(error) {
        console.error('获取歌单内容失败:', error);
    }
}


onMounted(() => {
    // playlistId();
    fetchPlayListDetail();
});
</script>

<style scoped>
    .playlist-wrapper{
        padding: 20px;
        background-color: #f5f7fb;
    }
    .playlist-inner{
        max-width: 1200px;
        margin: 0 auto;
        background-color: rgb(255, 255, 255);
    }
    .playlist-info{
        display: flex;
        gap: 20px;
        height: 200px;
        align-items: center;
        padding: 0;
        margin: 0;
    }
    .playlist-cover {
    width: 150px; 
    height: 150px;
    flex-shrink: 0; 
    }
    .playlist-cover img{
        width: auto;
        height: 100%;
        object-fit: cover;
    }
</style>