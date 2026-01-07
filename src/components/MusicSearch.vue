<template>
    <div class="musicsearch-wrapper">
        <div class="musicsearch-inner">
            <div class="songs-section">
                <div class="songs-title">
                </div>
                <div class="songs-list">
                    <!-- <ul v-for="song in paginatedSongs" 
                    :key="song.id" 
                    class="song-item" 
                    @click="handleMusicPlyerClick(router,{ id:song.id ,name:song.name,cover:''})">
                        <li>
                            <div class="song-name">{{ song.name }}</div>
                            <div class="song-artists">{{ song.artists.map((artist) => artist.name).join('/') }}</div>
                        </li>
                    </ul> -->
                    <ul>
                        <li
                        v-for="song in paginatedSongs"
                        :key="song.id"
                        class="songs-item"
                        @click="handleMusicPlyerClick(router,{ id:song.id ,name:song.name,cover:song.album.picUrl})">
                        <div class="songs-cover">
                            <img :src="song.album.picUrl" :alt="song.name">
                            {{ song.album.picUrl }}
                        </div>
                        <div class="songs-info">
                            <p>{{song.name}}</p>
                            <p>
                                <ul>
                                    <li
                                    v-for="value in song.artists"
                                    :key="value.id"
                                    >{{value.name}}</li>
                                </ul>
                            </p>
                        </div>
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
</template>

<script setup lang="ts">
import { computed ,onMounted ,ref, watch} from 'vue';
import { useRoute ,useRouter} from 'vue-router';
import api from '@/api';
import type { SearchData } from '@/types/searchdata';

const route = useRoute();
const keyword = computed(() => route.query)

// --- 添加分页相关的响应式数据 ---
// 定义数据格式

const currentPage = ref(1);
const limit = 25; // 每页显示的歌曲数量

interface SearchDataItem{
    id: number;
    name: string;
    artists: {
        id: number;
        name: string;
    }[]
    album: {
        picUrl: string;
    }
}

const searchdata = ref<SearchDataItem[]>([]);
let allsongs: SearchDataItem[] = []

const fetchSearch = async () => {
    try {
        const keywords = keyword.value.keyword;
        console.log(keywords);
        allsongs = [];
        let hasmore = true;
        let offset = 0;
        while (hasmore) {
            const response = await api.get<SearchData>('/cloudsearch?', { keywords, limit, offset });
            const data = response.result.songs || [];
            allsongs = allsongs.concat(data.map((item) => ({
                id: item.id,
                name: item.name,
                album: {
                    picUrl:item.al.picUrl
                },
                artists: item.ar.map(artist => ({
                    id: artist.id,
                    name: artist.name,
                }))
            })))
                if (data.length < limit) {
                hasmore = false;
             }
            else {
                offset += limit;
            }
            if (offset >=(limit * 30)) {
                offset = 0;
                break;
            };
        }
        searchdata.value = allsongs;
        console.log('获取到'+searchdata.value.length+'首歌',searchdata.value)
    } catch (error) {
        console.error("获取搜索失败",error)
    }
}

// --- 计算属性：当前页的歌曲列表 ---
const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * limit;
  const end = start + limit;
  return searchdata.value.slice(start, end);
});

// --- 计算属性：总页数 ---
const totalPages = computed(() => {
  return Math.ceil(searchdata.value.length / limit);
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

// 在组件挂载时检查 URL 参数并执行搜索（如果存在）
onMounted(() => {
    fetchSearch();
});

watch(
  () => route.query.keyword,
  (newKeyword, oldKeyword) => {
    if (newKeyword !== oldKeyword) {
      fetchSearch()
    }
  }
)
</script>

<style scoped>
    .musicsearch-wrapper {
        padding: 20px;
        background-color: #f5f7fb;
        display: flex;
        justify-content: center;
    }
    .musicsearch-inner {
        max-width: 1200px;
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        text-align: center; /* 让内容居中 */   
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

    .songs-item {
        display: flex; /* 关键：使用 flex 布局 */
        gap: 10px; /* 设置项目之间的间距 */
        align-items: center; /* 垂直居中对齐 */
        /* border-bottom: 1px solid #eee; 可选：添加分隔线 */
        border: 1px solid transparent; /* 初始边框为透明 */
        padding: 8px 0; /* 可选：添加内边距 */
        cursor: pointer;
        transition: box-shadow 0.3s ease;
        /* 可选：添加一点圆角使选中效果更柔和 */
        border-radius: 4px;
    }
    
    .songs-item:hover{
        transform: translateY(-2px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* 示例阴影 */
    }

    .songs-cover {
        width: 50px; /* 设置图片宽度 */
        height: 50px; /* 设置图片高度 */
        border-radius: 8px; /* 可选：圆形图片 */
        overflow: hidden; /* 隐藏超出部分 */
    }

    .songs-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 裁剪图片以填满容器 */
    }

    .songs-info {
        flex-grow: 1; /* 让文本区域占据剩余空间 */
        text-align: left;
    }

    .songs-info p {
        margin: 0;
        font-size: 14px;
        color: #333;
    }

    .songs-info ul {
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 12px;
        color: #666;
    }

    .songs-info li {
        display: inline-block; /* 将列表项并排显示 */
        margin-right: 8px;
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