<template>
    <overlay :show="showLoader" class="login" :style="{width: showLoader ? '500px' : 'auto'}">
        <template v-if="!showLoader">
            <h1 class="mb-2">Reset your password</h1>
            <p>Set your new password here. Make sure to set a strong password.</p>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                    <ValidationProvider vid="password" name="Password" :rules="{required: true, min: 7, one_number: true, one_uppercase: true, one_lowercase: true}" v-slot="{errors}">
                        <b-form-group label="Password *" label-for="password">
                            <b-input-group>
                                <b-form-input :type="showNewPassword ? 'text' : 'password'" ref="password" v-model="form.new_password" :class="{'is-invalid': errors[0]}" />
                                <b-input-group-append>
                                    <b-input-group-text style="cursor: pointer;" @click="showNewPassword = !showNewPassword">
                                        <b-icon-eye-slash-fill v-if="!showNewPassword"></b-icon-eye-slash-fill>
                                        <b-icon-eye-fill v-else></b-icon-eye-fill>
                                    </b-input-group-text>
                                </b-input-group-append>
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-input-group>
                        </b-form-group>
                    </ValidationProvider>
                    <ValidationProvider vid="confirm_password" name="Confirm Password" :rules="{required: true, confirmed: 'password'}" v-slot="{errors}">
                        <b-form-group label="Confirm Password *" label-for="confirm_password">
                            <b-input-group>
                                <b-form-input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirm_password" :class="{'is-invalid': errors[0]}" />
                                <b-input-group-append>
                                    <b-input-group-text style="cursor: pointer;" @click="showConfirmPassword = !showConfirmPassword">
                                        <b-icon-eye-slash-fill v-if="!showConfirmPassword"></b-icon-eye-slash-fill>
                                        <b-icon-eye-fill v-else></b-icon-eye-fill>
                                    </b-input-group-text>
                                </b-input-group-append>
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-input-group>
                        </b-form-group>
                    </ValidationProvider>
                    <div class="form-group">
                        <submit-button ref="submit-button" type="submit" class="btn-block w-100" :disabled="invalid">Reset Password</submit-button>
                    </div>
                </b-form>
            </ValidationObserver>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import Overlay from "../helpers/overlay.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            Overlay,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                showNewPassword: false,
                showConfirmPassword: false,
                form: {
                    token: this.$route.params.token,
                    new_password: null,
                    confirm_password: null
                }
            }
        },
        created: function () {
            this.$http.get("check-token-expiry/reset-password/" + this.$route.params.token)
            .then(response => {
                this.showLoader = false
                if (!response.data.success) {
                    this.$helpers.showToast("danger", response.data.message)
                    this.$router.push({name: "auth.login"})
                }
            })
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.post("reset-password/" + this.$route.params.token, this.form)
                .then(response => {
                    this.$refs["submit-button"].displayLoader = false
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$router.push({name: "auth.login"})
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
                .catch(() => {
                    this.$refs["submit-button"].displayLoader = false
                    this.$router.push({name: "auth.login"})
                })
            }
        }
    }
</script>