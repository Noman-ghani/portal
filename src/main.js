"use strict"

import Vue from "vue"
import VueRouter from "vue-router"
import VueStore from "./store"
import router from "./router"
import { BootstrapVue, IconsPlugin } from "bootstrap-vue"
import App from "./App.vue"
import Axios from "./axios"
import "bootstrap-vue/dist/bootstrap-vue-icons.min.css"
import Helpers from "./helpers"

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(VueStore)
Vue.use({
    install() {
        Vue.helpers = Helpers
        Vue.prototype.$helpers = Helpers
    }
})

Vue.prototype.$http = Axios
Vue.prototype.$store = VueStore

Vue.config.productionTip = (process.env.NODE_ENV === "development")

new Vue({
    render: h => h(App),
    router,
}).$mount("#app")