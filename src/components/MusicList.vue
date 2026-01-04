<template>
    <div class="playlist-wrapper">
        <div class="playlist-back">
            <div class="playlist-inner">
                <div class="playlist-info">
                    <div class="playlist-cover">
                        <img :src="playlistdetail.covimg" alt="歌单封面">
                    </div>
                    <div class="playlist-information">
                        <h2>{{playlistdetail.name}}</h2>
                        <div ref="containerRef" class="expandable-tooltip-text">
                            <p ref="textRef"
                                class="truncated-text">
                                {{ playlistdetail.des }}
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
                                 {{ playlistdetail.des }}
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
                <div class="playlist-songs">
                    <ul>
                        <li
                        v-for="song in playListSongs"
                        :key="song.id"
                        class="songs-item"
                        @click="handleMusicPlyerClick({ id:song.id ,name:song.al.name,cover:song.al.cover})">
                        <div class="songs-cover">
                            <img :src="song.al.cover" :alt="song.al.name">
                            {{ song.al.cover }}
                        </div>
                        <div class="songs-info">
                            <p>{{song.al.name}}</p>
                            <p>
                                <ul>
                                    <li
                                    v-for="value in song.ar"
                                    :key="value.id"
                                    >{{value.name}}</li>
                                </ul>
                            </p>
                        </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup lang="ts">
import { computed, onMounted, reactive, nextTick, ref, onBeforeUnmount,watch} from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';

import {handleMusicPlyerClick} from '@/utils/commonFunction'

import type { PlayListDetail ,PlayListSongs} from '@/types/playlist';

const route = useRoute();
const playlistId = computed(() => route.query.id)
// 获取歌单详情

interface PlayListDetailItem{
    name: string;
    covimg: string;
    des: string;
    dess:string
    tags: string[];
}

const playlistdetail = reactive<PlayListDetailItem>({
  name: '',
  covimg: '',
    des: '',
  dess:'',
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
    }catch(error) {
        console.error('获取歌单内容失败:', error);
    }
}

// 歌单详情省略
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

// 获取歌单所有歌曲

interface PlayListSongsItem{
    id: number;
    al: {
        name: string;
        cover: string;
    };
    ar: {
        id: number,
        name: string
    }[]
}
const playListSongs = ref<PlayListSongsItem[]>([])
const fetchPlayListSongs = async() => {
    try {
        const id = playlistId.value
        if(!id) return
        const response = await api.get<PlayListSongs[]>('/playlist/track/all', { id })
        playListSongs.value = (response.songs || []).map((item) => ({
            id: item.id,
            al: {
                name: item.al.name,
                cover:item.al.picUrl
            },
            ar: item.ar.map(artist => ({
                id: artist.id,
                name:artist.name
            }))
        }));
    }catch(error) {
        console.error('获取歌单歌曲失败:', error);
    }
}


onMounted(async () => {
    await fetchPlayListDetail();
    await fetchPlayListSongs();
    await nextTick();
    await measureHeights(); // 执行测量

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

<style scoped>
    .playlist-wrapper{
        padding: 20px;
        background-color: #f5f7fb;
    }
    .playlist-back{
        max-width: 1200px;
        margin: 0 auto;
        background-color: rgb(255, 255, 255);
    }
    .playlist-inner
    {
        max-width: 1100px;
        margin: 0 auto;
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
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 增强阴影 */
        border-radius: 8px; /* 更圆润的边角 */
        transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
    }
    .playlist-cover img{
        width: auto;
        height: 100%;
        object-fit: cover;
        border-radius: 8px
    }
    .playlist-information{
        display: grid;
        gap: 20px;
        align-items: center;
    }
    .playlist-information h2 {
          margin: 0px 0 0 0; /* 上边距 20px，其他边距为 0 */
        /* 或者根据需要设置具体数值，例如 */
        /* margin-top: 30px; */
        padding: 0; /* 确保没有默认或额外的 padding */
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

    .playlist-songs ul {
    list-style: none;
    padding: 0;
    margin: 0;
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
</style>