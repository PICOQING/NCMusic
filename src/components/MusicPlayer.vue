<template>
    <div class="musicplayer-wrapper">
        <div class="musicplayer-inner">
            <div class="musicplayer-cover">
                <img :src="musicplayer[0]?.cover" 
                :alt="musicplayer[0]?.name" 
                class="cover-image"/>
            </div>
            <h2 class="section-title">{{musicplayer[0]?.name}}</h2>
            <div v-if="musicplayer[0]?.url"
                class="musicplayer-item">
                <audio :src="musicplayer[0]?.url"
                controls 
                preload="metadata"
                >您的浏览器不支持 audio 标签。</audio>
            </div>
            <div v-else class="error-message">
                <p>无法加载音频，请稍后重试。</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import type { MusicPlayer } from '@/types/musicplyer';

const route = useRoute();
const musicdata = computed(() => route.query);
console.log(musicdata.value)
interface MusicPlayerItem{
    id: string;
    name: string;
    url: string;
    cover: string;
}
const MusicQuality = ref('standard')
const musicplayer = ref<MusicPlayerItem[]>([])

const fetchMusic = async () => {
    try {
        const id = musicdata.value.id;
        if (!id) return;
        const response = await api.get<MusicPlayer[]>("/song/url/v1?", { id, level:MusicQuality.value });
        musicplayer.value = (response.data || []).map((item) => ({
            id: item.id,
            name: musicdata.value.name as string,
            url: item.url,
            cover: musicdata.value.cover as string,
        }))
        console.log(musicplayer.value);
    }catch(error){
        console.error('获取歌曲失败:', error);
    }
}

onMounted(() => {
    fetchMusic();
})
</script>

<style>
    .musicplayer-wrapper {
        padding: 20px;
        background-color: #f5f7fb;
        display: flex;
        justify-content: center;
    }
    .musicplayer-inner {
        max-width: 1200px;
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        text-align: center; /* 让内容居中 */
        
    }
    .musicplayer-cover{
        height: 500px; /* 调整高度以适应整体布局 */
        width: 70%; /* 使用百分比宽度使其响应式 */
        margin: 0 auto; /* 在父容器中水平居中 */
        overflow: hidden;
        border-radius: 10px;
        position: relative;
        margin-bottom: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 图片会保持宽高比，并覆盖整个容器 */
        transition: transform .5s ease;
    }
    /* 当鼠标悬停在封面图片上时的动画效果 */
    .musicplayer-cover:hover .cover-image {
        transform: scale(1.1);
    }

    /* 标题样式 */
    .section-title {
        font-size: 24px;
        color: #333;
        text-align: center;
        margin-bottom: 20px;
    }

    /* 音频播放器样式 */
    .musicplayer-item {
        text-align: center;
        margin-bottom: 20px;
    }

    /* 错误信息样式 */
    .error-message {
        color: #e64949;
        text-align: center;
    }
</style>