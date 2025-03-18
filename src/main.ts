import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vLongPress, vInfiniteScroll } from './directives'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('long-press', vLongPress)
app.directive('infinite-scroll', vInfiniteScroll)

app.mount('#app')
