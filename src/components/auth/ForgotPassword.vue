<template>
    <div class="login">
        <h1 class="mb-2">Reset your password</h1>
        <p class="intro-text mb-4">Enter your registered login email address to receive a secure link to set a new password</p>
        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <ValidationProvider vid="email" name="E-mail address" :rules="{required: true, email: true}" v-slot="{errors}">
                    <b-form-group label="E-mail address *" label-for="email">
                        <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <div class="form-group">
                    <submit-button ref="submit-button" type="submit" class="btn-block w-100" :disabled="invalid">Send Password Reset</submit-button>
                </div>
            </b-form>
        </ValidationObserver>
        <div class="text-center">
            <router-link :to="{name: 'auth.login'}">Back to Login</router-link>
        </div>
    </div>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            SubmitButton
        },
        data: function () {
            return {
                form: {
                    email: null
                }
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.post("forgot-password", this.form)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "auth.login"})
                    } else {
                        this.$helpers.showToast("danger", res.data.message)
                    }
                })
                .catch(errors => {
                    this.$refs["submit-button"].displayLoader = false
                    this.$refs.form.setErrors(errors.response.data)
                })
            }
        }
    }
</script>