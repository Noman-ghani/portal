import Vue from "vue"
import { ValidationObserver, ValidationProvider, extend } from "vee-validate"
import * as rules from "vee-validate/dist/rules"

Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
})

extend("url", {
    validate(value) {
        return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(value)
    },
    message: "This is not a valid URL"
})

extend("password", {
    params: ["target"],
    validate(value, { target }) {
        return value === target;
    },
    message: "Password confirmation does not match"
})

extend("one_number", {
    validate(value) {
        return /\d/.test(value)
    },
    message: "x Contains a number"
})

extend("one_lowercase", {
    validate(value) {
        return /[a-z]/.test(value)
    },
    message: "x Contains a lowecase letter"
})

extend("one_uppercase", {
    validate(value) {
        return /[A-Z]/.test(value)
    },
    message: "x Contains a uppercase letter"
})

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);