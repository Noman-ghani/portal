import Vue from "vue"
import Axios from "axios"
import Store from "../store"
import Router from "../router"

const instance = Axios.create({
    baseURL: process.env.VUE_APP_API_URL
})

const token = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")

if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer` + token
}

instance.interceptors.response.use(
    response => response,
    error => {
        const vm = new Vue()
        if (error.response.status === 401) {
            Store.dispatch("logout")
            Router.push({ name: "auth.login", query: { status: 3 } })
        } else if (error.response.status === 400) {
            vm.$helpers.showToast("danger", error.response.data.message)
        } else if (error.response.status === 422) {
            if (typeof error.response.data === "string") {
                vm.$helpers.showToast("danger", error.response.data)
            }
        } else if (error.response.status === 500) {
            vm.$helpers.showToast("danger", error.response.data.message)
        }

        return Promise.reject(error)
    }
)

export default instance