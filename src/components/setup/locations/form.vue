<template>
    <overlay :show="showLoader" full-height class="centralized">
        <ValidationObserver v-if="!showLoader" ref="form" v-slot="{handleSubmit, invalid}">
            <heading-with-back :back-link-to="$store.getters.user.business.is_profile_complete ? {name: 'setup.index'} : null">
                <template #title>
                    <template v-if="$store.getters.user.business.is_profile_complete">
                        {{$route.params.id ? 'Edit Location' : 'Add Location'}}
                    </template>
                    <template v-else>
                        Step 1: Add default location for your business
                    </template>
                </template>
            </heading-with-back>
            <b-form @submit.stop.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <b-card>
                    <template #header>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex align-items-center flex-wrap">
                                <h2>Basic Info</h2>
                            </div>
                            <div>
                                <div v-if="form.shorturl.url_code" class="text-center">
                                    <p>ShortURL for marketplace is: </p>
                                    <b-link :href="form.shorturl.base_url+form.shorturl.url_code" target="_blank">{{form.shorturl.base_url}}{{form.shorturl.url_code}}</b-link>
                                </div>
                            </div>
                        </div>
                    </template>
                    <b-row>
                        <b-col md="4" class="pr-0">
                            <div class="border rounded profile_image d-flex justify-content-center align-items-center" style="height: 174px;">
                                <template v-if="!form.profile_image">
                                    <b-form-file accept="image/*" @change="onUpload($event)" plain></b-form-file>
                                    <b-icon-camera-fill font-scale="1.5"></b-icon-camera-fill>
                                </template>
                                <template v-else>
                                    <b-img-lazy class="preview rounded" :src="form.profile_image"></b-img-lazy>
                                    <div class="change-image position-absolute rounded-circle bg-white theme-color">
                                        <b-icon-camera-fill font-scale="1.5"></b-icon-camera-fill>
                                    </div>
                                    <b-form-file accept="image/*" @change="onUpload($event)" plain></b-form-file>
                                </template>
                            </div>
                        </b-col>
                        <b-col md="8">
                            <b-row>
                                <b-col md="12">
                                    <ValidationProvider vid="name" name="Location name" :rules="{required: true}" v-slot="{errors}">
                                        <b-form-group label="Location name *" label-for="name">
                                            <b-form-input v-model="form.name" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6">
                                    <ValidationProvider vid="email" name="E-mail address" :rules="{email: true}" v-slot="{errors}">
                                        <b-form-group label="E-mail address" label-for="email">
                                            <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6">
                                    <ValidationProvider vid="phone_number" name="Phone number" :rules="{required: true}" v-slot="{errors}">
                                        <b-form-group label="Phone number *" label-for="phone_number">
                                            <b-input-group>
                                                <b-input-group-prepend>
                                                    <b-input-group-text class="pt-0 pb-0">
                                                        <span v-html="country.flag"></span>
                                                        <span class="pl-2">{{country.phone_code}}</span>
                                                    </b-input-group-text>
                                                </b-input-group-prepend>
                                                    <b-form-input @keyup="($event.target.value[0] === '0') ? form.phone_number = $event.target.value.substring(1) : ''" v-model="form.phone_number" v-mask="country.phone_mask" :placeholder="country.phone_mask" :class="{'is-invalid': errors[0]}" />
                                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                            </b-input-group>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col md="6">
                            <ValidationProvider vid="address" name="Address" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Address *" label-for="address">
                                    <b-form-input v-model="form.address" :class="{'is-invalid': errors[0]}" />
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                        </b-col>
                        <b-col md="3">
                            <ValidationProvider vid="state" name="State" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="State *" label-for="state">
                                    <b-form-select v-model="form.state" :class="{'is-invalid': errors[0]}" :options="states" value-field="id" text-field="name">
                                        <template #first>
                                            <b-form-select-option :value="null">-- Please Select --</b-form-select-option>
                                        </template>
                                    </b-form-select>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                        </b-col>
                        <b-col md="3">
                            <ValidationProvider vid="city" name="City" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="City *" label-for="city">
                                    <overlay is-field :show="cities.loader">
                                        <b-form-select v-model="form.city" :class="{'is-invalid': errors[0]}" :options="cities.items" value-field="id" text-field="name">
                                            <template #first>
                                                <b-form-select-option :value="null">-- Please Select --</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                    </overlay>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                </b-card>
                <b-card class="mt-5">
                    <template #header>
                        <h2>Business Types</h2>
                    </template>
                    <ul class="business-types d-flex flex-wrap">
                        <li v-for="businessType in businessTypes" v-bind:key="businessType.icon" v-bind:class="{active: form.business_types.indexOf(businessType.icon) > -1}" v-on:click="setAsSelected(businessType)">
                            <img :src="businessType.url" />
                            <p>{{businessType.title}}</p>
                        </li>
                    </ul>
                </b-card>
                <b-card class="mt-5">
                    <template #header>
                        <h2>Opening Hours</h2>
                    </template>
                    <b-row v-for="weekday in $helpers.weekdays()" v-bind:key="'weekday-' + weekday.value" :class="{'mt-4': weekday.value > 0}">
                        <b-col md="6" class="d-flex align-items-center">
                            <b-form-checkbox v-model="form.timings[weekday.value].is_closed" value="0" unchecked-value="1">
                                <p class="font-weight-700">{{weekday.text}}</p>
                            </b-form-checkbox>
                        </b-col>
                        <b-col md="6">
                            <b-row>
                                <b-col md="6">
                                    <b-form-select :disabled="form.timings[weekday.value].is_closed == 1" v-model="form.timings[weekday.value].starts_at" :options="$helpers.getTimeSlots(30)"></b-form-select>
                                </b-col>
                                <b-col md="6">
                                    <b-form-select :disabled="form.timings[weekday.value].is_closed == 1" v-model="form.timings[weekday.value].ends_at" :options="$helpers.getTimeSlots(30)"></b-form-select>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-card>
                <b-row>
                    <b-col md="12" class="text-right mt-4">
                        <submit-button type="submit" ref="submit-button" :disabled="invalid"></submit-button>
                    </b-col>
                </b-row>
            </b-form>
        </ValidationObserver>
        <b-modal ref="profile-photo-modal" no-close-on-esc no-close-on-backdrop title="Resize / Crop Image" ok-only ok-title="Apply" @ok="onCroppedOrResized($event)">
            <clipper-basic :src="profileImageURL" ref="clipper"></clipper-basic>
        </b-modal>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import VueMask from "v-mask"
    import VueRx from "vue-rx"
    import VuejsClipper from "vuejs-clipper"
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)
    Vue.use(VueMask)
    Vue.use(VueRx)
    Vue.use(VuejsClipper)

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                country: this.$store.getters.user.business.country,
                form: {
                    profile_image: null,
                    phone_country_id: this.$store.getters.user.business.country.id,
                    state: null,
                    city: null,
                    timings: [],
                    business_types: [],
                    shorturl: {
                        url_code: null,
                        type: 'branch'
                    },
                },
                profileImageURL: null,
                states: [],
                cities: {
                    items: [],
                    loader: false
                },
                businessTypes: []
            }
        },
        created: async function () {
            for (let day_of_week = 0; day_of_week < 7; day_of_week++) {
                this.form.timings.push({
                    day_of_week: day_of_week,
                    is_closed: 0,
                    starts_at: "09:00:00",
                    ends_at: "18:00:00"
                })
            }

            const businessTypes = await this.$http.get("utilities/business-types")
            this.businessTypes = businessTypes.data

            const states = await this.$http.get("utilities/states?country_id=" + this.form.phone_country_id)
            this.states = states.data
            
            if (this.$route.params.id) {
                const branch = await this.$http.get("branches/" + this.$route.params.id + "?with-state&with-city&with-timings")
                this.form.profile_image = branch.data.profile_image
                this.form.name = branch.data.name
                this.form.email = branch.data.email ?? ''
                this.form.phone_country_id = branch.data.phone_country_id
                this.form.phone_number = branch.data.phone_number
                this.form.address = branch.data.address
                this.form.state = branch.data.state.id
                this.form.city = branch.data.city.id

                if(branch.data.shorturl){
                    this.form.shorturl = branch.data.shorturl
                }

                if (branch.data.business_type_1) {
                    this.form.business_types.push(branch.data.business_type_1)
                }

                if (branch.data.business_type_2) {
                    this.form.business_types.push(branch.data.business_type_2)
                }

                if (branch.data.business_type_3) {
                    this.form.business_types.push(branch.data.business_type_3)
                }

                branch.data.timings.forEach(timing => {
                    const timingsRow = this.form.timings.find(t => t.day_of_week == timing.day_of_week)
                    timingsRow.is_closed = timing.is_closed
                    timingsRow.starts_at = timing.starts_at
                    timingsRow.ends_at = timing.ends_at
                })
            }

            this.showLoader = false
        },
        watch: {
            "form.state": {
                handler: function (state_id) {
                    this.cities.loader = true

                    this.$http.get("utilities/cities?state_id=" + state_id)
                    .then(res => {
                        this.cities.items = res.data
                        this.cities.loader = false
                    })
                }
            }
        },
        methods: {
            setAsSelected: function (row) {
                const indexOf = this.form.business_types.indexOf(row.icon)
                
                if (indexOf === -1) {
                    if (this.form.business_types.length < 3) {
                        this.form.business_types.push(row.icon)
                    } else {
                        this.$helpers.showToast("info", "You can select maximum 3 types")
                    }
                } else {
                    this.form.business_types.splice(indexOf, 1)
                }
            },
            onUpload: function ($event) {
                if ($event.target.files.length !== 0) {
                    if (this.profileImageURL) URL.revokeObjectURL(this.profileImageURL)
                    this.profileImageURL = window.URL.createObjectURL($event.target.files[0])
                    const context = this
                    let uploadImage = new Image()
                    uploadImage.onload = function () {
                        if (this.width < this.height) {
                            context.$helpers.showToast("danger", "Uploaded image must be in landscape mode")
                            return
                        }
                        if (this.width > 1024) {
                            context.$helpers.showToast("danger", "Max width allowed for upload is 1024px")
                            return
                        }
                        context.$refs["profile-photo-modal"].show()
                    }
                    uploadImage.src = this.profileImageURL
                }

                $event.target.value = null
            },
            onCroppedOrResized: function () {
                this.form.profile_image = this.$refs.clipper.clip().toDataURL("image/jpeg", 1)
                this.profileImageURL = null
                this.$refs["profile-photo-modal"].hide()
            },
            onSubmit: function () {
                if (!this.form.business_types.length) {
                    this.$helpers.showToast("danger", "Please select atleast one business type")
                    return
                }

                if (!this.form.profile_image) {
                    this.$helpers.showToast("danger", "Please upload a branch image")
                    return
                }

                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("branches/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("branches", this.form)
                }

                axios
                .then(async res => {
                    if (res.data.success) {
                        if (!this.$store.getters.user.business.is_profile_complete) {
                            await this.$http.put("business/settings", {is_profile_complete: 1, default_branch_id: res.data.branch_id})
                            this.$store.dispatch("updateBusinessData", {...this.$store.getters.user.business, ...{is_profile_complete: 1, default_branch_id: res.data.branch_id}})
                        }

                        this.$helpers.showToast("success", res.data.message)

                        if (this.$route.params.id) {
                            this.$router.push({name: "setup.locations.view", params: {id: this.$route.params.id}})
                        } else {
                            this.$router.push({name: "setup.locations"})
                        }
                    } else {
                        this.$helpers.showToast("danger", res.data.message)
                    }
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
<style lang="scss" scoped>
    .card {
        .card-body {
            .business-types {
                margin: 0;
                li {
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #d5d7da;
                    border-radius: 10px;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 0.5rem;
                    position: relative;
                    cursor: pointer;
                }
                span {
                    width: 50%;
                }
                img {
                    width: 80px;
                    height: 80px;
                }
                p {
                    margin: 1rem 0 0;
                }
                :hover,
                .active {
                    background: #e5f1ff;
                }
                .active {
                    &:after {
                        content: url('data:image/svg+xml; utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" /></svg>');
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        width: 20px;
                        height: 20px;
                        background: #0C56C9;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
    @media only screen and (max-width: 768px) {
        .card {
            .card-body {
                .business-types {
                    justify-content: center;
                    li {
                        width: 150px;
                        height: 150px;
                        margin: 10px;
                    }
                }
            }
        }
    }
    @media only screen and (min-width: 768px) {
        .card {
            .card-body {
                .business-types {
                    li {
                        width: calc(92% / 5);
                        height: 180px;
                        margin-right: 2%;
                    }
                    li:nth-child(5n+1),
                    li:nth-child(5n+2),
                    li:nth-child(5n+3),
                    li:nth-child(5n+4),
                    li:nth-child(5n+5) {
                        margin-bottom: 2%;
                    }
                    li:nth-child(5n+5) {
                        margin-right: 0;
                    }
                }
            }
        }
    }
    .profile_image {
        background-color: #cde4ff;
        color: #0C56C9;
        @media (max-width: 768px) {
            max-width: 250px;
            position: relative;
            margin: 0 auto 10px;
            height: 150px !important;
        }
        .preview {
            width: 100%;
            height: 100%;
        }
        .change-image {
            right: 10px;
            bottom: 25px;
            padding: 10px;
            cursor: pointer;
        }
        input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            border-radius : 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2;
        }
    }
</style>