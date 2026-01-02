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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

app.use(createPinia())
app.use(router)

app.mount('#app')

export default router