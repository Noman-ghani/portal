<template>
    <div class="login">
        <h1 class="mb-2">Log in to your account</h1>
        <p class="intro-text">Access your account to manage your business</p>
        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <ValidationProvider vid="email" name="E-mail address" :rules="{required: true, email: true}" v-slot="{errors}">
                    <b-form-group label="E-mail address *" label-for="email">
                        <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" autofocus />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <ValidationProvider vid="password" name="Password" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Password *" label-for="password" class="mb-2">
                        <b-input-group>
                            <b-form-input :type="showPassword ? 'text' : 'password'" v-model="form.password" :class="{'is-invalid': errors[0]}" />
                            <b-input-group-append>
                                <b-input-group-text style="cursor: pointer;" @click="showPassword = !showPassword">
                                    <b-icon-eye-slash-fill v-if="!showPassword"></b-icon-eye-slash-fill>
                                    <b-icon-eye-fill v-else></b-icon-eye-fill>
                                </b-input-group-text>
                            </b-input-group-append>
                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                        </b-input-group>
                    </b-form-group>
                </ValidationProvider>
                <checkbox v-model="form.remember_me" value="1" unchecked-value="0">Remember me</checkbox>
                <div class="form-group mt-4">
                    <submit-button ref="submit-button" type="submit" class="btn-block w-100" :disabled="invalid">Log In</submit-button>
                </div>
            </b-form>
        </ValidationObserver>
        <div class="signup-footer mt-4 text-center">
            Don't have an account? <router-link :to="{name: 'auth.signup'}">Sign up</router-link><br />
            <router-link :to="{name: 'auth.forgot-password'}" class="ml-auto">Forgot your password?</router-link>
        </div>
    </div>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import Checkbox from "@/components/helpers/checkbox.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)
    
    export default {
        components: {
            Checkbox,
            SubmitButton
        },
        data: function () {
            return {
                form: {
                    email: null,
                    password: null,
                    remember_me: '0',
                },
                showPassword: false
            }
        },
        created: function () {
            if (this.$route.query.status == "1") {
                this.$helpers.showToast("info", "Your email address is now verified. Please login to continue.")
            } else if (this.$route.query.status == "2") {
                this.$helpers.showToast("danger", "Your email verification link has expired.", {title: "Email Verification"})
            } else if (this.$route.query.status == "3") {
                this.$helpers.showToast("danger", "Access denied. Please login to continue.")
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$store.dispatch("login", this.form)
                .then(res => {
                    this.$helpers.showToast("success", res.data.message)
                    this.$store.dispatch("user").then(user => {
                        if (user.data.business.is_profile_complete) {
                            this.$router.push({name: "calendar"})
                        } else {
                            this.$router.push({name: "setup.locations.add"})
                        }
                    })
                })
                .catch(errors => {
					this.$refs.form.setErrors(errors.response.data)
                    this.$refs["submit-button"].displayLoader = false
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    @media only screen and (max-width: 640px) {
        h1 {
            font-size: 1.2rem;
        }
        .intro-text {
            font-size: 0.8rem;
        }
    }
</style>