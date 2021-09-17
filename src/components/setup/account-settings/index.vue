<template>
    <overlay :show="showLoader" full-height class="centralized">
        <ValidationObserver v-if="!showLoader" ref="form" v-slot="{handleSubmit, invalid}">
            <b-form @submit.stop.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <heading-with-back :back-link-to="{name: 'setup.index'}" title="Account Settings" description="Manage settings such as your business name and timezone." />
                <div class="business-row">
                    <div class="first-col">
                        <h3>Business Info</h3>
                        <p>Your business name is displayed across many areas including on your online booking profile, sales invoices and messages to clients.</p>
                    </div>
                    <div class="second-col">
                        <b-card>
                            <ValidationProvider vid="name" name="Business name" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Business name *" label-for="name">
                                    <b-form-input v-model="form.name" :class="{'is-invalid': errors[0]}" />
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                        </b-card>
                    </div>
                </div>
                <div class="business-row">
                    <div class="first-col">
                        <h3>Time and Calendar Settings</h3>
                        <p>Choose the time zone and format which suit your business. Daylight savings changes will automatically apply based on your selected time zone.</p>
                    </div>
                    <div class="second-col">
                        <b-card>
                            <ValidationProvider vid="timezone" name="Timezone" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Time zone *" label-for="timezone">
                                    <b-form-select v-model="form.time_zone" :options="timezones" :class="{'is-invalid': errors[0]}" />
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="time_format" name="Time format" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Time format *" label-for="time_format">
                                    <b-form-select v-model="form.time_format" :options="time_formats" :class="{'is-invalid': errors[0]}" />
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="week_start" name="Week start" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Week start *" label-for="week_start">
                                    <b-form-select v-model="form.week_start" :options="weeks" />
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                        </b-card>
                    </div>
                </div>
                <div class="business-row">
                    <div class="first-col">
                        <h3>Online Links</h3>
                        <p>Add your company website and social media links for sharing with clients.</p>
                    </div>
                    <div class="second-col">
                        <b-card>
                            <ValidationProvider vid="website" name="Website" :rules="{url: true}" v-slot="{errors}">
                                <b-form-group label="Website" label-for="website">
                                    <b-input-group>
                                        <b-input-group-prepend>
                                            <b-input-group-text>
                                                <b-icon-globe />
                                            </b-input-group-text>
                                        </b-input-group-prepend>
                                        <b-form-input v-model="form.website" :class="{'is-invalid': errors[0]}" placeholder="http://www.website.com" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-input-group>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="facebook" name="Facebook" :rules="{url: true}" v-slot="{errors}">
                                <b-form-group label="Facebook" label-for="facebook">
                                    <b-input-group>
                                        <b-input-group-prepend>
                                            <b-input-group-text>
                                                <b-icon-facebook />
                                            </b-input-group-text>
                                        </b-input-group-prepend>
                                        <b-form-input v-model="form.facebook" :class="{'is-invalid': errors[0]}" placeholder="http://www.facebook.com/yoursite" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-input-group>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="linkedin" name="Linkedin" :rules="{url: true}" v-slot="{errors}">
                                <b-form-group label="Linkedin" label-for="linkedin">
                                    <b-input-group>
                                        <b-input-group-prepend>
                                            <b-input-group-text>
                                                <b-icon-linkedin />
                                            </b-input-group-text>
                                        </b-input-group-prepend>
                                        <b-form-input v-model="form.linkedin" :class="{'is-invalid': errors[0]}" placeholder="http://www.linkedin.com/yoursite" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-input-group>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="instagram" name="Instagram" :rules="{url: true}" v-slot="{errors}">
                                <b-form-group label="Instagram" label-for="instagram">
                                    <b-input-group>
                                        <b-input-group-prepend>
                                            <b-input-group-text>
                                                <b-icon-instagram />
                                            </b-input-group-text>
                                        </b-input-group-prepend>
                                        <b-form-input v-model="form.instagram" :class="{'is-invalid': errors[0]}" placeholder="http://www.instagram.com/yoursite" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-input-group>
                                </b-form-group>
                            </ValidationProvider>
                        </b-card>
                    </div>
                </div>
                <div class="form-group fixedbutton text-right mt-4">
                    <submit-button ref="submit-button" type="submit" :disabled="invalid"></submit-button>
                </div>
            </b-form>
        </ValidationObserver>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                form: {},
                timezones: [],
                time_formats: [{
                    value: "12h",
                    text: "12 hours (e.g. 9:00pm)"
                }, {
                    value: "24h",
                    text: "24 hours (e.g. 21:00)"
                }],
                weeks: [{
                    value: 0,
                    text: "Sunday"
                }, {
                    value: 1,
                    text: "Monday"
                }, {
                    value: 2,
                    text: "Tuesday"
                }, {
                    value: 3,
                    text: "Wednesday"
                }, {
                    value: 4,
                    text: "Thursday"
                }, {
                    value: 5,
                    text: "Friday"
                }, {
                    value: 6,
                    text: "Saturday"
                }]
            }
        },
        created: async function () {
            const timezonesResponse = await this.$http.get("utilities/timezones")
            this.timezones = timezonesResponse.data.map((timezone) => {
                return {
                    value: timezone.id,
                    text: "(GMT " + timezone.offset + ") " + timezone.timezone
                }
            })

            const businessSettingsResponse = await this.$http.get("business/settings")
            this.form.name = businessSettingsResponse.data.name
            this.form.time_zone = businessSettingsResponse.data.time_zone_id
            this.form.time_format = businessSettingsResponse.data.time_format
            this.form.week_start = businessSettingsResponse.data.week_start
            this.form.website = businessSettingsResponse.data.website
            this.form.facebook = businessSettingsResponse.data.facebook
            this.form.instagram = businessSettingsResponse.data.instagram
            this.form.linkedin = businessSettingsResponse.data.linkedin

            this.showLoader = false
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("business/settings", this.form)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$store.getters.user.business = Object.assign(this.$store.getters.user.business, this.form)
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
    .business-row {
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        margin-bottom: 20px;
         @media only screen and (max-width: 980px) {
            flex-wrap: wrap;
        }
        .first-col {
            margin-right: 24px;
            @media only screen and (max-width: 980px) {
                width: 100%;
            }
        }
        .second-col {
            flex-shrink: 0;
            flex-basis: 560px;
            @media only screen and (max-width: 980px) {
                width: 100%;
                margin-bottom: 20px;
                flex-basis: auto;
            }
            select{
                color:#101928;
            }
        }
        h3 {
            margin-bottom: 1rem;
        }
        p {
            font-weight: 400;
            line-height: 21px;
            color: #878c93;
        }
    }
</style>