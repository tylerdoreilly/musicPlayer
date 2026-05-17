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
import { 
    faPlay, 
    faPause,
    faStepForward,
    faStepBackward,
    faVolumeUp,
    faRandom,
    faRepeat,
    faAngleRight, 
    faAngleLeft, 
    faHome, 
    faCog, 
    faUserCircle, 
    faBars, 
    faCircleMinus,
    faSortAlphaAsc, 
    faSortAlphaDesc, 
    faList,
    faTh,
    faSearch,
    faMusic,
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
    faPlay, 
    faPause,
    faStepForward,
    faStepBackward,
    faVolumeUp,
    faRandom,
    faRepeat,
    faAngleRight, 
    faAngleLeft, 
    faHome, 
    faCog, 
    faUserCircle, 
    faBars, 
    faCircleMinus, 
    faSortAlphaAsc, 
    faSortAlphaDesc, 
    faList, 
    faTh, 
    faSearch,
    faMusic,
    )

const app = createApp(App)

registerGlobalComponents(app)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
