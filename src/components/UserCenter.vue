<template>
    <div class="avatar-dropdown">
    <router-link to="/login" class="avatar-link">
        <img class="nav-login" src="../assets/images/LoginLogo.png" alt="Login Avatar" />
    </router-link>
    <div class="dropdown-content">
        <div v-if="login" class="dropdown-menu">
            <div class="dropdown-item">用户中心</div>
            <div class="dropdown-item">我的收藏</div>
            <div class="dropdown-item">播放历史</div>
            <div class="dropdown-item" @click="logout">退出登录</div>
        </div>
        <div v-else class="dropdown-menu">
            <router-link to="/login" class="dropdown-item">点击登录</router-link>
        </div>
    </div>
    </div>

</template>


<script setup lang="ts">
    import { ref } from 'vue';
    const login = ref(true); // 假设初始状态为已登录
    const logout = () => {
  console.log('执行退出登录逻辑');
  // 这里应该调用你的登录状态管理逻辑，比如 Pinia Store 或 API
  login.value = false; // 将 login 状态设为 false
};
</script>
<style>
    .avatar-link {
    text-decoration: none; /* 移除链接默认样式 */
    display: block; /* 确保容器是块级元素 */
    width: 40px; /* 与图片尺寸一致 */
    height: 40px;
    border-radius: 50%; /* 在容器上也设置圆角 */
    border: 1px solid #000; /* 在容器上设置边框 */
    overflow: hidden; /* 关键：隐藏超出容器边界的部分 */
    transition: border-color 0.2s ease; /* 容器边框过渡效果 */
    }
    .avatar-link:hover {
    border-color: #aaa; /* 鼠标悬停时改变容器边框颜色 */
    }
    .nav-login {
    width: 100%; /* 图片宽度占满容器 */
    height: 100%; /* 图片高度占满容器 */
    object-fit: cover; /* 保持图片比例并覆盖整个容器 */
    }
    .avatar-dropdown {
    position: relative;
    display: inline-block;
    }
    .dropdown-content {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #2c2c2c;
    min-width: 160px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    z-index: 1;
    border-radius: 8px;
    padding: 0;
    opacity: 0;
    visibility: hidden;
    transform-origin: top center; /* 动画中心点设在顶部中心 */
    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
    overflow: hidden;
    }
    .avatar-dropdown:hover .dropdown-content {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
    }
    /* 为用户已登录的菜单项添加样式 */
    .dropdown-menu {
    width: 100%; /* 确保菜单项占满容器 */
    }

    .dropdown-item {
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    display: block;
    transition: background-color 0.2s ease;
    cursor: pointer; /* 鼠标悬停时显示为手型 */
    }
    .dropdown-item:hover {
    border-radius: 8px;    
    background-color: #3a3a3a;
    }

    /* 为登录链接添加样式 */
    .login-link {
    color: white;
    text-decoration: none;
    display: block;
    width: 100%;
    height: 100%;
    padding: 8px 16px; /* 将上下内边距从 12px 改为 8px */
    }
    .login-link:hover {
    background-color: #3a3a3a; /* 与 .dropdown-item:hover 保持一致 */
    text-decoration: none; /* 去除链接默认下划线 */
    }
</style>