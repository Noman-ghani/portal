<template>
    <overlay :show="showLoader" full-height class="centralized">
        <template v-if="!showLoader">
            <heading-with-back :back-link-to="{name: $route.params.id ? 'clients.view' : 'clients', params: {id: $route.params.id}}">
                <template #title>
                    {{$route.params.id ? 'Edit Client' : 'Add Client'}}
                </template>
            </heading-with-back>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                <b-form @submit.stop.prevent="handleSubmit(onSubmit)" autocomplete="off">
                    <b-card>
                        <template #header>
                            <h2>Basic Info</h2>
                        </template>
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
                                <ValidationProvider vid="email" name="E-mail address" :rules="{email: true}" v-slot="{errors}">
                                    <b-form-group label="E-mail address" label-for="email">
                                        <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <ValidationProvider vid="gender" name="Gender" v-slot="{errors}">
                                    <b-form-group label="Gender" label-for="gender">
                                        <div class="select-wrap">
                                            <b-form-select v-model="form.gender" :class="{'is-invalid': errors[0]}" :options="[{value: 'male', text: 'Male'}, {value: 'female', text: 'Female'}, {value: null, text: 'Unknown'}]" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="Birthday" label-for="birthday">
                                    <div class="form-control d-flex align-items-center">
                                        <date-range-picker control-container-class="" :locale-data="{firstDay: 1, format: 'mmmm dd, yyyy'}" single-date-picker show-dropdowns v-model="form.birthday"></date-range-picker>
                                        <b-icon-calendar-fill></b-icon-calendar-fill>
                                    </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="12">
                                <b-form-group label="Notes" label-for="notes">
                                    <b-form-textarea v-model="form.notes" rows="6" />
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h2>Address</h2>
                        </template>
                        <b-row>
                            <b-col md="12">
                                <ValidationProvider vid="address" name="Address" v-slot="{errors}">
                                    <b-form-group label="Address" label-for="address">
                                        <b-form-input v-model="form.address" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <ValidationProvider vid="suburb" name="Suburb" v-slot="{errors}">
                                    <b-form-group label="Suburb" label-for="suburb">
                                        <b-form-input v-model="form.suburb" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="Zip/Post Code" label-for="zip_code">
                                    <b-form-input type="number" v-model="form.zip_code" />
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <ValidationProvider vid="state" name="State" v-slot="{errors}">
                                    <b-form-group label="State" label-for="state">
                                        <div class="select-wrap">
                                            <b-form-select v-model="form.state_id" :options="states" value-field="id" text-field="name" :class="{'is-invalid': errors[0]}">
                                                <template #first>
                                                    <b-form-select-option :value="null">Please Select</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </div>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <ValidationProvider vid="city" name="City" :rules="{required: (form.state != null)}" v-slot="{errors}">
                                    <b-form-group label="City" label-for="city">
                                        <div class="select-wrap">
                                            <overlay :show="cities.loader" is-field>
                                                <b-form-select v-model="form.city_id" :options="cities.items" value-field="id" text-field="name" :class="{'is-invalid': errors[0]}">
                                                    <template #first>
                                                        <b-form-select-option :value="null">Please Select</b-form-select-option>
                                                    </template>
                                                </b-form-select>
                                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                            </overlay>
                                        </div>
                                    </b-form-group>
                                </ValidationProvider>
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
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import moment from "moment"
    import DateRangePicker from "vue2-daterange-picker"
    import Overlay from "../helpers/overlay.vue"
    import HeadingWithBack from "../heading-with-back.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            DateRangePicker,
            Overlay,
            HeadingWithBack,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                form: {
                    phone_country_id: this.$store.getters.user.business.country.id,
                    state_id: null,
                    city_id: null,
                    gender: null
                },
                countries: [],
                states: [],
                cities: {
                    items: [],
                    loader: false
                }
            }
        },
        created: async function () {
            const countriesResponse = await this.$http.get("utilities/countries")
            this.countries = countriesResponse.data

            const statesResponse = await this.$http.get("utilities/states?country_id=" + this.$store.getters.user.business.country.id)
            this.states = statesResponse.data

            if (this.$route.params.id) {
                const clientResponse = await this.$http.get("clients/" + this.$route.params.id)
                this.form.first_name = clientResponse.data.first_name
                this.form.last_name = clientResponse.data.last_name
                this.form.phone_number = clientResponse.data.phone_number
                this.form.email = clientResponse.data.email
                this.form.gender = clientResponse.data.gender
                this.form.birthday = clientResponse.data.birthday
                this.form.notes = clientResponse.data.notes
                this.form.address = clientResponse.data.address
                this.form.suburb = clientResponse.data.suburb
                this.form.state_id = clientResponse.data.state_id
                this.form.city_id = clientResponse.data.city_id
            }

            this.showLoader = false
        },
        computed: {
            country: function () {
                return this.countries.find(countryRow => countryRow.id == this.form.phone_country_id) ?? {}
            }
        },
        watch: {
            "form.state_id": {
                handler: function (state_id) {
                    this.cities.items = []
                    if (state_id) {
                        this.cities.loader = true
                        this.$http.get("utilities/cities?state_id=" + state_id)
                        .then(cities => {
                            this.cities.items = cities.data
                            this.cities.loader = false
                        })
                    }
                }
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let axios = null

                let formData = {...this.form}
                formData["birthday"] = moment(formData["birthday"]).format("YYYY-MM-DD")

                if (this.$route.params.id) {
                    axios = this.$http.put("clients/" + this.$route.params.id, formData)
                } else {
                    axios = this.$http.post("clients", formData)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)

                        if (this.$route.params.id) {
                            this.$router.push({name: "clients.view", params: {id: this.$route.params.id}})
                        } else {
                            this.$router.push({name: "clients", params: {reload: true}})
                        }
                    } else {
                        this.$helpers.showToast("danger", res.data.message)
                    }
                })
                .catch((errors) => {
                    this.$refs["submit-button"].displayLoader = false
                    this.$refs.form.setErrors(errors.response.data)
                })
            }
        }
    }
</script>