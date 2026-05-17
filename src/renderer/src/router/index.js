import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainView,
    children: [
      { 
        path: '', 
        name: 'home',
        component: () => import('../views/HomeView.vue'),
      },
      { 
        path: 'artists', 
        name: 'artists',
        component: () => import('../views/ArtistsView.vue')
      },
      { 
        path: 'artists/:artistId/albums/:id',
        name: 'album-detail',
        component: () => import('../views/AlbumView.vue'),
        props: true
      },
      { 
        path: 'artists/:id',
        name: 'artist-detail',
        component: () => import('../views/ArtistView.vue'),
        props: true
      },
      { 
        path: 'preferences', 
        name: 'preferences', 
        component: () => import('../views/PreferencesView.vue'),
      }
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