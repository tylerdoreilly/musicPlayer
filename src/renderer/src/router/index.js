import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import Home from '@renderer/components/Home.vue'
import Artists from '@renderer/components/Artists.vue'
import Artist from '@renderer/components/Artist.vue'
import Album from '@renderer/components/Album.vue'
import Preferences from '@renderer/components/Preferences.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainView,
    children: [
      // path '' renders by default when visiting /parent
      { path: '', name: 'home', component: Home },
      { 
        path: 'artists', 
        name: 'artists', 
        component: Artists
      },
      { 
        path: 'artists/:artistId/albums/:id',
        name: 'album-detail',
        component: Album,
        props: true
      },
      { 
        path: 'artists/:id',
        name: 'artist-detail',
        component: Artist,
        props: true
      },
      { path: 'preferences', name: 'preferences', component: Preferences }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // Lazy-loading components for better performance
  //   component: () => import('../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router