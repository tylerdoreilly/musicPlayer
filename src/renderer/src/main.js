import './assets/main.css'
import router from './router'

import { createApp } from 'vue'
import App from './App.vue'

import "@fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/700.css"; // Optional: specific weight

/* import fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faPlay, faPause, faAngleRight, faAngleLeft, faHome, faCog, faUserCircle } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faPlay, faPause, faAngleRight, faAngleLeft, faHome, faCog, faUserCircle)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router) // Register the router plugin
app.mount('#app')
