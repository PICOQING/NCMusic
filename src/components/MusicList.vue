<template>
    <div class="" >{{playlistdetail.name}}</div>
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

let playlistdetail = reactive<PlayListDetailItem>({
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
        playlistdetail = {
            name: detail?.name || "歌曲列表",
            covimg: detail?.coverImgUrl || "",
            des: detail?.description || "",
            tags:detail?.tags || []
        }
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

<style>

</style>