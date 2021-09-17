<template>
    <div class="signup">
        <h1>Create your free partner account</h1>
        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <b-row>
                    <b-col md="12">
                        <ValidationProvider vid="name" name="Business name" :rules="{required: true}" v-slot="{errors}">
                            <b-form-group label="Business name *" label-for="name">
                                <b-form-input v-model="form.name" :class="{'is-invalid': errors[0]}" autofocus />
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
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
                    <b-col md="6">
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
                    <b-col md="6">
                        <ValidationProvider vid="email" name="E-mail address" :rules="{required: true, email: true}" v-slot="{errors}">
                            <b-form-group label="E-mail address *" label-for="email">
                                <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" />
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="password" name="Password" :rules="{required: true, min: 7, one_number: true, one_uppercase: true, one_lowercase: true}" v-slot="{errors}">
                            <b-form-group label="Password *" label-for="password">
                                <b-input-group>
                                    <b-form-input :type="showPassword ? 'text' : 'password'" ref="password" v-model="form.password" :class="{'is-invalid': errors[0]}" />
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
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="confirm_password" name="Confirm Password" :rules="{required: true, confirmed: 'password'}" v-slot="{errors}">
                            <b-form-group label="Confirm Password *" label-for="confirm_password">
                                <b-input-group>
                                    <b-form-input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirm_password" :class="{'is-invalid': errors[0]}" />
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
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="country_id" name="Country" :rules="{required: true}" v-slot="{errors}">
                            <b-form-group label="Country *" label-for="country_id">
                                <overlay :show="countries.loader" is-field>
                                    <b-form-select v-model="form.country_id" :options="countries.items" value-field="id" text-field="name" :class="{'is-invalid': errors[0]}">
                                        <template #first>
                                            <b-form-select-option value="">Select country</b-form-select-option>
                                        </template>
                                    </b-form-select>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </overlay>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="timezone" name="Timezone" :rules="{required: true}" v-slot="{errors}">
                            <b-form-group label="Timezone *" label-for="timezone">
                                <overlay :show="timezones.loader" is-field>
                                    <b-form-select v-model="form.timezone" :options="timezones.items" :class="{'is-invalid': errors[0]}">
                                        <template #first>
                                            <b-form-select-option value="">Select timezone</b-form-select-option>
                                        </template>
                                    </b-form-select>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </overlay>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="12">
                        <ValidationProvider vid="privacy_policy" name="Privacy Policy" :rules="{required: true}" v-slot="{errors}">
                            <checkbox v-model="form.privacy_policy" checked_value="1" unchecked_value="" :class="{'is-invalid': errors[0]}">
                                I agree to the <a href="https://servuapp.com/privacy-policy" target="_blank">privacy policy</a> and <a href="https://servuapp.com/terms-conditions" target="_blank">terms</a>
                            </checkbox>
                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="12" class="mt-3">
                        <b-form-group class="mb-0">
                            <submit-button ref="submit-button" type="submit" class="btn-block w-100" :disabled="invalid">Sign Up</submit-button>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
        </ValidationObserver>
        <div class="signup-footer mt-4 text-center">
            Already have a professional account?<br />
            <router-link :to="{name: 'auth.login'}">Sign in now</router-link>
        </div>
    </div>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import VueMask from "v-mask"
    import Overlay from "../overlay"
    import Checkbox from "../checkbox"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)
    Vue.use(VueMask)

    export default {
        components: {
            Overlay,
            Checkbox,
            SubmitButton
        },
        data: function () {
            return {
                form: {
                    phone_country_id: null
                },
                showPassword: false,
                showConfirmPassword: false,
                countries: {
                    loader: true,
                    items: []
                },
                timezones: {
                    loader: true,
                    items: []
                }
            }
        },
        created: function () {
            this.$http.get("utilities/countries").then((countries) => {
                this.countries.items = countries.data
            })

            this.$http.get("utilities/timezones").then((timezones) => {
                this.timezones.items = timezones.data.map((timezone) => {
                    return {
                        value: timezone.id,
                        text: "(GMT " + timezone.offset + ") " + timezone.timezone
                    }
                })

                this.$http.get("locale")
                .then(locale => {
                    const countryRow = this.countries.items.find((row) => row.name == locale.data.country)
                    const timezoneRow = timezones.data.find((row) => row.timezone == locale.data.timezone)
                    
                    if (countryRow) {
                        this.form.phone_country_id = countryRow.id
                        this.form.country_id = countryRow.id
                    } else {
                        this.form.phone_country_id = this.countries.items[0]
                    }

                    if (timezoneRow) {
                        this.form.timezone = timezoneRow.id
                    } else {
                        this.form.timezone = this.timezones.items[0]
                    }

                    this.countries.loader = false
                    this.timezones.loader = false
                })
            })
        },
        computed: {
            country: function () {
                if (this.form.phone_country_id) {
                    return this.countries.items.find(countryRow => countryRow.id == this.form.phone_country_id)
                }

                return {}
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.post("business", this.form)
                .then((res) => {
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
<style lang="scss" scoped>
    form {
        width: 554px;
        .terms {
            font-weight: 400;
            margin: 0 0 15px 0;
        }
    }
    .select-wrap {
        position: relative;
        &.flag-wrap {
            .flag-code {
                position: absolute;
                background: #FFF;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding-right: 20px;
                z-index: 1;
                pointer-events: none;
                width: 100%;
            }
            select {
                min-width: 80px;
                max-width: 90px;
                border: 0;
                max-height: 45px;
            }
        }
        select {
            -moz-appearance: none !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            cursor: pointer;
            padding: 10px 30px 10px 10px;
            outline: none !important;
            border: none;
            position: relative;
            background: transparent;
            option {
                padding-right: 10px;
            }
        }
        .select-icon {
            position: absolute;
            z-index: 1;
            height: 25px;
            width: 16px;
            right: 8px;
            top: 0;
            bottom: 0;
            margin: auto;
            pointer-events: none;
        }
}
.phone {
    flex-wrap: nowrap;
    .input-group-prepend {
        max-height: 46px;
        &~span,
        &~div {
            flex-grow: 1;
            input {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }
}
</style>