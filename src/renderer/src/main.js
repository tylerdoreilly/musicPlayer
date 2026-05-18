import './assets/main.css'
import router from './router'

import { createApp } from 'vue'
import App from './App.vue'

import "@fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/700.css"; // Optional: specific weight

import registerGlobalComponents from './utils/registerGlobalComponents'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(fas,far)
   

const app = createApp(App)

registerGlobalComponents(app)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
