<template>
    <div class="app">
        <header class="top-nav">
            <div class="top-nav-inner">
                <a class="logo-link">
                    <img class="logo-img" src="@/assets/images/NCMusic.jpg" alt="网易云音乐">
                </a>
                <nav class="nav-links">
                    <router-link to="/" class="nav-link">音乐馆</router-link>
                    <router-link to="/mymusic" class="nav-link">我的音乐</router-link>
                </nav>
                <div class="nav-action">
                    <div class="search-box">
                        <input type="text" 
                        class="search-input" 
                        placeholder="搜索音乐/歌手/专辑"
                        v-model="searchKeyword"
                        @keydown.enter="handleSearch">
                    </div>
                    <div>
                        <router-link to="/login" class="login-btn">登录</router-link>
                    </div>
                </div>
            </div>
        </header>
        <main class="main-view">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView,useRouter } from 'vue-router';
import { ref } from 'vue';
const searchKeyword = ref('');
const router = useRouter();
const handleSearch = () => {
    const keyword = searchKeyword.value.trim();
    if(keyword === '') return
    console.log('搜索关键词:', keyword);
    router.push({
        path: '/search',
        query:{keyword}
    })
};
</script>

<style scoped>
.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f7fb;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.top-nav {
    height: 90px;
    background: #000000;
    color: #333;
    display: flex;
    align-items: center; 
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.top-nav-inner {
    width: 100%;
    max-width: 1200px;
    padding: 0 32px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.logo-link {
    display: flex;
    align-items: center;
    gap: 10px; /* 图标和文字之间的间距 */
    height: 100%; /* 占满导航栏高度 */
}
.logo-img {
    width: auto; /* 自动缩放宽度，保持宽高比 */
    height: 50px; /* 设置为实际高度，例如 50px */
    display: block; /* 防止下方出现空白 */
}
.nav-links {
    margin-left: 24px; /* 调整导航链接与logo的间距 */
    display: flex;
    gap: 24px; /* 导航链接之间的间距 */
}
.nav-link{
    color: #e5e5e5;
    text-decoration: none;
    font-size: 18px;
    padding: 8px 16px;
    border-radius: 18px;
    transition: all 0.2s;
}
.nav-link:hover {
    background: #c20c02;
    color: #fff;
}
.nav-link.router-link-exact-active {
    background: #c20c02;
    color: #fff;
}
.nav-action {
    margin-left: auto;
    display: flex;
    align-items: center;
}
.user-menu {
    position: relative;
}
.search-box {
    margin-right: 16px;
}
.search-input {
    padding: 0px 12px;
    width: 180px;
    height: 32px;
    border-radius: 16px;
    font-size: 13px;
    border: none;
    background: #fff;
    outline: none;
}
.search-input::placeholder {
    color: #999;
}
.login-btn{
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid #c20c02;
    color: #c20c02;
    font-size: 14px;
    text-decoration: none;
    transform: all 0.2s;
}
.login-btn:hover {
    background-color: #c20c02;
    color: #fff;
}
.main-view {
    flex: 1;
}
</style>