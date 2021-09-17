<template>
    <div class="centralized">
        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <b-row>
                    <b-col md="6">
                        <h3>Personal Details</h3>
                        <p>Set your name and contact information, the email address entered here is used for your login access.</p>
                    </b-col>
                    <b-col md="6">
                        <b-card>
                            <b-row>
                                <b-col md="6">
                                    <ValidationProvider vid="first_name" name="First name" :rules="{required: true}" v-slot="{errors}">
                                        <b-form-group label="First name *" label-for="first_name">
                                            <b-form-input v-model="form.first_name" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6">
                                    <ValidationProvider vid="last_name" name="Last name" :rules="{required: true}" v-slot="{errors}">
                                        <b-form-group label="Last name *" label-for="last_name">
                                            <b-form-input v-model="form.last_name" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="12">
                                    <b-form-group label="Phone number *" label-for="phone_number">
                                        <overlay :show="countries.loader" is-field>
                                            <b-input-group class="phone">
                                                <b-input-group-prepend>
                                                    <b-input-group-text class="p-0">
                                                        <div class="select-wrap flag-wrap">
                                                            <div class="flag-code">
                                                                <span v-html="country.flag"></span>
                                                                <span class="pl-2">{{country.phone_code}}</span>
                                                            </div>
                                                            <b-form-select v-model="form.phone_country_id" class="b-0">
                                                                <b-form-select-option v-for="country in countries.items" v-bind:key="country.id" :value="country.id" v-html="country.name + ' ' + country.flag + ' +' + country.phone_code" />
                                                            </b-form-select>
                                                            <span class="select-icon">
                                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                                            </span>
                                                        </div>
                                                    </b-input-group-text>
                                                </b-input-group-prepend>
                                                <ValidationProvider vid="phone_number" name="Phone number" :rules="{required: true}" v-slot="{errors}">
                                                    <b-form-input @keyup="($event.target.value[0] === '0') ? form.phone_number = $event.target.value.substring(1) : ''" v-model="form.phone_number" v-mask="country.phone_mask" :placeholder="country.phone_mask" :class="{'is-invalid': errors[0]}" />
                                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                                </ValidationProvider>
                                            </b-input-group>
                                        </overlay>
                                    </b-form-group>
                                </b-col>
                                <b-col md="12">
                                    <ValidationProvider vid="email" name="Email" :rules="{required: true}" v-slot="{errors}">
                                        <b-form-group label="Email *" label-for="email">
                                            <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </b-row>
                <b-row class="mt-5">
                    <b-col md="6">
                        <h3>Change Password</h3>
                        <p>To make an update, enter your existing password followed by a new one. If you don't know your existing password, you can logout and use the Reset Password link on the Log In page.</p>
                    </b-col>
                    <b-col md="6">
                        <b-card>
                            <ValidationProvider vid="password" name="Password" v-slot="{errors}">
                                <b-form-group label="Password *" label-for="password">
                                    <b-input-group>
                                        <b-form-input :type="showPassword ? 'text' : 'password'" v-model="form.password" :class="{'is-invalid': errors[0]}" />
                                        <b-input-group-append>
                                            <b-input-group-text style="cursor: pointer;" @click="showPassword = !showPassword">
                                                <b-icon-eye-slash-fill v-if="!showPassword" />
                                            <b-icon-eye-fill v-else />
                                            </b-input-group-text>
                                        </b-input-group-append>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-input-group>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="new_password" name="New Password" :rules="{required: (form.password != null && form.password != ''), min: 7, one_number: true, one_lowercase: true, one_uppercase: true}" v-slot="{errors}">
                                <b-form-group label="New Password *" label-for="new_password">
                                    <b-input-group>
                                        <b-form-input :type="showNewPassword ? 'text' : 'password'" v-model="form.new_password" :class="{'is-invalid': errors[0]}" :disabled="!form.password" />
                                        <b-input-group-append>
                                            <b-input-group-text style="cursor: pointer;" @click="showNewPassword = !showNewPassword">
                                                <b-icon-eye-slash-fill v-if="!showNewPassword" />
                                                <b-icon-eye-fill v-else />
                                            </b-input-group-text>
                                        </b-input-group-append>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-input-group>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="confirm_password" name="Confirm Password" :rules="{required: (form.new_password != null && form.new_password != ''), password: '@new_password'}" v-slot="{errors}">
                                <b-form-group label="Confirm Password *" label-for="confirm_password">
                                    <b-input-group>
                                        <b-form-input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirm_password" :class="{'is-invalid': errors[0]}" :disabled="!form.new_password" />
                                        <b-input-group-append>
                                            <b-input-group-text style="cursor: pointer;" @click="showConfirmPassword = !showConfirmPassword">
                                                <b-icon-eye-slash-fill v-if="!showConfirmPassword" />
                                                <b-icon-eye-fill v-else />
                                            </b-input-group-text>
                                        </b-input-group-append>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-input-group>
                                </b-form-group>
                            </ValidationProvider>
                        </b-card>
                    </b-col>
                    <b-col md="12">
                        <b-form-group class="mt-5 text-right">
                            <submit-button type="submit" :disabled="invalid" ref="submit-button"></submit-button>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
        </ValidationObserver>
    </div>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../plugins/vee-validate"
    import VueMask from "v-mask"
    import SubmitButton from "../components/helpers/submit-button.vue"
    import Overlay from "../components/helpers/overlay.vue"

    Vue.use(VueMask)
    Vue.use(VeeValidate)
    
    export default {
        components: {
            Overlay,
            SubmitButton
        },
        data: function () {
            return {
                form: {
                    first_name: null,
                    last_name: null,
                    phone_country_id: null,
                    phone_number: null,
                    email: null,
                    password: null,
                    new_password: null,
                    confirm_password: null
                },
                countries: {
                    loader: true,
                    items: []
                },
                showPassword: null,
                showNewPassword: null,
                showConfirmPassword: null
            }
        },
        created: function () {
            this.$http.get("profile")
            .then(res => {
                this.form.first_name = res.data.staff.first_name
                this.form.last_name = res.data.staff.last_name
                this.form.phone_country_id = res.data.staff.phone_country_id
                this.form.phone_number = res.data.staff.phone_number
                this.form.email = res.data.user.email
            })

            this.$http.get("utilities/countries")
            .then(countries => {
                this.countries.items = countries.data
                this.countries.loader = false
            })
        },
        computed: {
            country: function () {
                if (this.form.phone_country_id && this.countries.items.length) {
                    return this.countries.items.find(countryRow => countryRow.id == this.form.phone_country_id)
                }

                return {}
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("profile", this.form)
                .then(res => {
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                    } else {
                        this.$helpers.showToast("danger", res.data.message)
                    }

                    this.form.password = null
                    this.form.new_password = null
                    this.form.confirm_password = null
                    this.$refs["submit-button"].displayLoader = false
                })
                .catch(errors => {
                    this.$refs["submit-button"].displayLoader = false
                    this.$refs.form.setErrors(errors.response.data)
                })
            }
        }
    }
</script>