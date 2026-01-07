import './assets/css/reset.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createRouter, createWebHistory} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import MusicHall from './components/MusicHall.vue'
import MyMusic from './components/MyMusic.vue'
import MusicSearch from './components/MusicSearch.vue'
import UserLogin from './components/UserLogin.vue'
import MusicList from './components/MusicList.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import MusicArtist from './components/MusicArtist.vue'

const app = createApp(App)

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: MusicHall
    },
    {
        path: '/myMusic',
        component: MyMusic
    },
    {
        path: '/search',
        component: MusicSearch
    },
    {
        path: '/login',
        component: UserLogin
    },
    {
        path: '/musicList',
        component: MusicList
    },
    {
        path: '/musicplyer',
        component: MusicPlayer
    },
    {
        path: '/musicartist',
        component:MusicArtist
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach(() => {
  window.scrollTo(0, 0);
});

app.use(createPinia())
app.use(router)

app.mount('#app')

export default router