import Vue from "vue"
import Vuex from "vuex"
import axios from "../axios"

Vue.use(Vuex)

const store = new Vuex.Store({
    namespaced: true,
    state: {
        status: "",
        token: sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token"),
        user: {},
        config: {}
    },
    mutations: {
        authRequest(state) {
            state.status = "loading"
        },
        authSuccess(state, data) {
            state.status = "success"
            state.token = data.token

            axios.defaults.headers.common["Authorization"] = `Bearer` + state.token
        },
        authError(state) {
            state.status = "error"
        },
        authUser(state, data) {
            if ("settings" in data) {
                state.config = data.settings
            }
            state.user = data
        },
        logout(state) {
            state.status = ""
            state.token = ""
        },
        updateBusinessData(state, businessData) {
            state.user.business = businessData
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit("authRequest")
                axios.post("user/login", user).then(response => {
                    commit("authSuccess", response.data)
                    if (user.remember_me === '1') {
                        localStorage.setItem("auth_token", response.data.token)
                    } else {
                        sessionStorage.setItem("auth_token", response.data.token)
                    }
                    resolve(response)
                }).catch(err => {
                    commit("authError")
                    localStorage.removeItem("token")
                    reject(err)
                })
            })
        },
        user({ commit }) {
            return new Promise((resolve) => {
                axios.get("user").then(user => {
                    commit("authUser", user.data)
                    resolve(user)
                })
            })
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                commit("logout")
                localStorage.clear()
                sessionStorage.clear()
                delete axios.defaults.headers.common["Authorization"]
                resolve()
            })
        },
        updateBusinessData({ commit }, businessData) {
            commit("updateBusinessData", businessData)
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        user: state => state.user,
        config: state => state.config
    }
})

export default store