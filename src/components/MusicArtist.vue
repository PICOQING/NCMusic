<template>
    <div class="musicartist-wrapper">
        <div class="musicartist-back">
            <div class="musicaritst-inner">
                <div class="artist-section">
                    <div class="musicartist-cover">
                        <img :src="musicartist.picUrl" :alt="musicartist.name">
                    </div>
                    <div class="musicartist-detail">
                        <h2 class="section-title">{{ musicartist.name }}</h2>
                        <div class="music-size">
                            <div class="stat-item">
                                <span class="stat-label">专辑数量：</span>
                                <span class="stat-value">{{ musicartist.albumSize }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">歌曲数量：</span>
                                <span class="stat-value"> {{ musicartist.musicSize }}</span>
                            </div>
                        </div>
                        <div ref="containerRef" class="expandable-tooltip-text">
                                <p ref="textRef"
                                    class="truncated-text">
                                    {{ musicartist.briefDesc }}
                                </p>
                        <!-- 展开按钮（仅当溢出时显示） -->
                            <button
                            v-if="shouldShowButton"
                            @click="openTooltip"
                            class="toggle-btn"
                            >
                            展开
                            </button>
                        <!-- 浮窗（Portal 到 body，避免父容器 overflow:hidden 遮挡） -->
                            <Teleport to="body">
                            <div
                                v-if="isTooltipOpen"
                                ref="tooltipRef"
                                class="tooltip-overlay"
                                @click="closeTooltip"
                            >
                                <div
                                class="tooltip-content"
                                @click.stop
                                >
                                <p class="full-text">
                                    <!-- <slot></slot> -->
                                    {{ musicartist.briefDesc }}
                                </p>
                                <button @click="closeTooltip" class="close-btn">
                                ×
                                </button>
                                </div>
                            </div>
                            </Teleport>
                        </div>
                    </div>
                </div>
                <div class="songs-section">
                    <div class="songs-title">
                    </div>
                    <div class="songs-list">
                        <ul v-for="song in paginatedSongs" 
                        :key="song.id" 
                        class="song-item" 
                        @click="handleMusicPlyerClick(router,{ id:song.id ,name:song.name,cover:song.picUrl})">
                            <li>
                                <div class="song-name">{{ song.name }}</div>
                                <div class="song-artists">{{ song.ar.map(artist => artist.name).join('/') }}</div>
                            </li>
                        </ul>
                    </div>
                    <!-- 分页控件 -->
                    <div class="pagination-controls">
                        <button
                            @click="goToPage(currentPage - 1)"
                            :disabled="currentPage <= 1"
                            class="pagination-btn"
                        >
                            上一页
                        </button>
                        <span class="pagination-info">
                            {{ currentPage }} / {{ totalPages }}
                        </span>
                        <button
                            @click="goToPage(currentPage + 1)"
                            :disabled="currentPage >= totalPages"
                            class="pagination-btn"
                        >
                            下一页
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute ,useRouter} from 'vue-router';
import {computed, onMounted, reactive, nextTick, ref, onBeforeUnmount,watch} from 'vue'
import api from '@/api';

import type { MusicArtist ,ArtistSongs} from '@/types/musicartist';

const route = useRoute();
const artistData = computed(() => route.query);

// 获取歌手详情
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

// 歌手详情省略
const props = defineProps({
  maxLines: {
    type: [Number, String],
    default: 2
  }
})

const containerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const isTooltipOpen = ref(false)
const actualHeight = ref(0)
const truncatedHeight = ref(0)

// 是否需要显示“展开”按钮
const shouldShowButton = computed(() => {
  return actualHeight.value > truncatedHeight.value
})

// 打开浮窗
function openTooltip(e: MouseEvent) {
  e.stopPropagation()
  isTooltipOpen.value = true
  // 可选：定位浮窗到按钮附近（这里简化为居中）
}

// 关闭浮窗
function closeTooltip() {
  isTooltipOpen.value = false
}

// 点击外部关闭
function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node | null
  if (
    isTooltipOpen.value &&
    tooltipRef.value &&
    containerRef.value &&
    !tooltipRef.value.contains(target) &&
    !containerRef.value?.contains(target)
  ) {
    closeTooltip()
  }
}

const measureHeights = async () => {
  const el = textRef.value;
  if (!el) return;

// 获取歌手全部歌曲

  // 确保 props.maxLines 是数字
  const lines = Number(props.maxLines) || 2;

   // 设置 line-clamp 为指定行数
  el.style.webkitLineClamp = lines.toString();

  await nextTick(); // 等待样式应用

  // 获取截断后的高度
  truncatedHeight.value = el.clientHeight; // clientHeight 表示当前显示的高度
  
  // 临时取消截断以测完整高度
  el.style.webkitLineClamp = 'unset';
  await nextTick();
  actualHeight.value = el.scrollHeight; // scrollHeight 表示全部内容的高度

  // 恢复截断样式
  el.style.webkitLineClamp = lines.toString();
};

// --- 添加分页相关的响应式数据 ---
// 定义数据格式

const currentPage = ref(1);
const limit = 25; // 每页显示的歌曲数量
interface ArtistSongsItem{
    name: string;
    id: number;
    picUrl: string;
    ar: {
        name: string;
        id: number;
    }[];
}

const songs = ref<ArtistSongsItem[]>([]); // 用于存储歌曲数据的数组，请确保您的歌曲获取逻辑将数据填充到这里
let allsongs:ArtistSongsItem[] = []
// 获取歌手全部歌曲
const fetchAllMusics = async () => {
    try {
        const id = artistData.value.id;
        if (!id) return;
        const order = 'hot';
        let hasmore = true;
        let offset = 0;
        while (hasmore) {
            const response = await api.get<ArtistSongs[]>('/artist/songs?', { id, order, limit, offset });
            const data = response.songs || [];
            allsongs = allsongs.concat(data.map((item) => ({
                id: item.id,
                name: item.name,
                picUrl: item.picUrl || '',
                ar: item.ar.map((artist) => ({
                    id: artist.id,
                    name:artist.name
                }))
            })))
            if (data.length < limit) {
                hasmore = false;
             }
            else {
                offset += limit;
            }
        }
        songs.value = allsongs;
        console.log('获取到'+songs.value.length+'首歌',songs.value)
    } catch (error) {
        console.error('获取歌手歌曲失败:', error);
    }
}

// --- 计算属性：当前页的歌曲列表 ---
const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * limit;
  const end = start + limit;
  return songs.value.slice(start, end);
});

// --- 计算属性：总页数 ---
const totalPages = computed(() => {
  return Math.ceil(songs.value.length / limit);
});

// --- 翻页方法 ---
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    }
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 可选：平滑滚动（用户体验更好）
  })
};

// 跳转歌曲播放页面

import { handleMusicPlyerClick } from '@/utils/commonFunction'
const router = useRouter();



onMounted(async() => {
    await fetchArtist();
    await nextTick();
    await measureHeights();
    await fetchAllMusics();

    document.addEventListener('click', handleClickOutside);
})

watch(() => props.maxLines, async () => {
    await nextTick(); // 等待可能的 DOM 更新
    await measureHeights(); // 重新测量

});

// 组件卸载时清理
defineExpose({
  closeTooltip
})

// 清理事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})


</script>

<style>
    .musicartist-wrapper {
        padding: 20px;
        background-color: #f5f7fb;
        box-sizing: border-box; /* 确保 padding 不会增加总宽度 */
    }
    .musicartist-back{
        max-width: 1200px;
        margin: 0 auto;
        height: auto;
        background-color: rgb(255, 255, 255);
    }
    .musicartist-inner {
        max-width: 1100px;
        margin: 0 auto;
    }
    .artist-section {
        display: flex; /* Flexbox 布局 */
        gap: 30px; /* 左右两部分之间的间距 */
        align-items: flex-start; /* 顶部对齐，防止右侧内容过高影响封面 */
        padding: 20px; /* 内边距 */
        background-color: #ffffff; /* 白色背景 */
    }
    /* 4. 歌手封面部分 */
    .musicartist-cover {
        flex-shrink: 0; /* 防止封面在空间不足时被压缩 */
        /* 定义封面图片的尺寸 */
    }
    .musicartist-cover img {
        width: 200px; /* 固定宽度 */
        height: 200px; /* 固定高度 */
        object-fit: cover; /* 保持图片比例并填满容器，可能会裁剪 */
        border-radius: 8px; /* 图片圆角 */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* 图片阴影 */
    }
    /* 5. 歌手详情部分 */
    .musicartist-detail {
    flex: 1; /* 占据剩余空间 */
    display: flex;
    flex-direction: column; /* 内容垂直排列 */
    justify-content: center; /* 垂直居中内容（可选，这里主要是顶部对齐） */
    gap: 15px; /* 内部元素之间的间距 */
    }

    /* 6. 标题样式 */
    .section-title {
    margin: 0; /* 重置默认外边距 */
    font-size: 2em; /* 标题大小 */
    color: #333; /* 标题颜色 */
    font-weight: bold; /* 标题加粗 */
    text-align: left;
    }

    /* 7. 统计信息样式 */
    .music-size {
    display: flex;
    flex-direction: column; /* 垂直排列统计项 */
    gap: 8px; /* 统计项之间的间距 */
    }

    .stat-item {
    display: flex;
    align-items: center; /* 垂直居中标签和数值 */
    }

    .stat-label {
    font-weight: bold;
    color: #555;
    margin-right: 8px; /* 标签和数值之间的间距 */
    white-space: nowrap; /* 防止标签换行 */
    }

    .stat-value {
    color: #333;
    font-weight: 500;
    }

    .expandable-tooltip-text {
    position: relative;
    max-width: 100%;
    }

    .truncated-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    }

    .toggle-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 13px;
    padding: 4px 0;
    margin-top: 4px;
    outline: none;
    }

    /* 浮窗遮罩 */
    .tooltip-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 80px;
    z-index: 2000;
    }

    .tooltip-content {
    position: relative;
    background: white;
    border-radius: 8px;
    padding: 16px;
    max-width: 90vw;
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    line-height: 1;
    }

    .full-text {
    padding-top:18px;
    padding-bottom: 10px;
    margin: 0;
    white-space: pre-wrap;
    }

    .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #999;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    }

    .close-btn:hover {
    background: #f0f0f0;
    }

    /* 9. 歌曲部分 */
    .songs-section {
    margin-top: 20px; /* 与上半部分的间距 */
    height: auto; /* 占位高度 */
    background-color: #f0f0f0; /* 占位背景色 */
    }
     /* 9. 歌曲部分样式 */
    .songs-section {
        margin-top: 20px;
        padding: 0 20px 70px; /* 给内部元素添加内边距，底部留出空间给固定定位的分页控件 */
        background-color: #ffffff; /* 保持与上方一致的背景色 */
        position: relative; /* 为分页控件的绝对定位提供参照 */
        min-height: 300px; /* 设置一个最小高度，防止内容过少时分页控件遮挡 */
    }

    .songs-title h3 {
        margin-top: 0; /* 重置标题顶部外边距 */
        margin-bottom: 15px; /* 与列表之间留出间距 */
        font-size: 1.5em;
        color: #333;
        border-bottom: 1px solid #eee; /* 添加下边框 */
        padding-bottom: 8px; /* 边框与文字的间距 */
    }

    .songs-list {
        display: flex;
        flex-direction: column;
        gap: 10px; /* 歌曲项目之间的间距 */
        min-height: auto; /* 固定高度，容纳 25 首歌 */
        overflow: hidden;  /* 隐藏超出部分，禁止内部滚动 */
        margin-bottom: 0; /* 移除底部内边距，给按钮留空间 */
        padding-bottom: 60px;
    }

    .song-item {
        display: flex;
        flex-direction: column; /* 歌曲名和作者垂直排列 */
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background-color: #fafafa;
        transition: background-color 0.2s ease; /* 悬停效果过渡 */
    }

    .song-item:hover {
        background-color: #f0f0f0; /* 悬停时改变背景色 */
    }

    .song-name {
        font-weight: bold;
        color: #333;
        margin-bottom: 4px; /* 与作者之间的间距 */
        white-space: nowrap; /* 防止歌曲名换行，超出部分可后续处理 */
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .song-artists {
        font-size: 0.9em;
        color: #666;
        white-space: nowrap; /* 防止作者换行，超出部分可后续处理 */
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* 分页控件样式 - 固定在底部 */
    .pagination-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0; /* 仍然保留，用于水平居中 */
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        background-color: #ffffff;
        padding: 10px 0;
        border-top: 1px solid #e0e0e0;
        z-index: 10;
        width: 100%; /* 显式设置宽度，避免溢出 */
        box-sizing: border-box;
    }

    .pagination-info {
        font-size: 14px;
        color: #666;
    }

    .pagination-btn {
        padding: 8px 16px;
        border: 1px solid #ddd;
        background-color: #fff;
        color: #333;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
        background-color: #e9ecef;
        border-color: #adb5bd;
    }

    .pagination-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #f8f9fa;
        border-color: #dee2e6;
        color: #6c757d;
    }
</style>