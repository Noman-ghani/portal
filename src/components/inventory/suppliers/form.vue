<template>
    <overlay :show="showLoader" full-height class="centralized">
        <template v-if="!showLoader">
            <heading-with-back :back-link-to="{name: 'inventory.suppliers'}">
                <template #title>
                    {{$route.params.id ? 'Edit Supplier' : 'Add Supplier'}}
                </template>
            </heading-with-back>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                <b-form @submit.stop.prevent="handleSubmit(onSubmit)" autocomplete="off">
                    <b-card>
                        <template #header>
                            <h2>Supplier Details</h2>
                        </template>
                        <b-row>
                            <b-col md="12">
                                <ValidationProvider vid="name" name="Business name" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Business name *" label-for="name">
                                        <b-form-input v-model="form.name" :class="{'is-invalid': errors[0]}" />
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
                                <b-form-group label="Phone number" label-for="phone_number">
                                    <b-input-group class="phone">
                                        <b-input-group-prepend>
                                            <b-input-group-text class="p-0">
                                                <div class="select-wrap flag-wrap">
                                                    <div class="flag-code">
                                                        <span v-html="country.flag"></span>
                                                        <span class="pl-1">{{country.phone_code}}</span>
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
                                        <ValidationProvider vid="phone_number" name="Phone number" v-slot="{errors}" tag="div">
                                            <b-form-input @keyup="($event.target.value[0] === '0') ? form.phone_number = $event.target.value.substring(1) : ''" v-model="form.phone_number" v-mask="country.phone_mask" :placeholder="country.phone_mask" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </ValidationProvider>
                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <ValidationProvider vid="email" name="E-mail address" :rules="{email: true}" v-slot="{errors}">
                                    <b-form-group label="E-mail address" label-for="email">
                                        <b-form-input type="email" v-model="form.email" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="12">
                                <ValidationProvider vid="description" name="Supplier description" v-slot="{errors}">
                                    <b-form-group label="Supplier description" label-for="description">
                                        <b-form-textarea rows="4" v-model="form.description" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h2>Physical Address</h2>
                        </template>
                        <b-row>
                            <b-col md="12">
                                <ValidationProvider vid="street" name="Street" v-slot="{errors}">
                                    <b-form-group label="Street" label-for="street">
                                        <b-form-input v-model="form.street" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="12">
                                <ValidationProvider vid="suburb" name="Suburb" v-slot="{errors}">
                                    <b-form-group label="Suburb" label-for="suburb">
                                        <b-form-input v-model="form.suburb" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="state" name="State" v-slot="{errors}">
                                    <b-form-group label="State" label-for="state">
                                        <overlay :show="states.loader" is-field>
                                            <b-form-select v-model="form.state_id" :class="{'is-invalid': errors[0]}" :options="states.items" value-field="id" text-field="name">
                                                <template #first>
                                                    <b-form-select-option :value="null">-- Please select an option --</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </overlay>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="city" name="City" v-slot="{errors}">
                                    <b-form-group label="City" label-for="city">
                                        <overlay :show="cities.loader" is-field>
                                            <b-form-select v-model="form.city_id" :class="{'is-invalid': errors[0]}" :options="cities.items" value-field="id" text-field="name">
                                                <template #first>
                                                    <b-form-select-option :value="null">-- Please select an option --</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </overlay>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="zipcode'" name="Zipcode" v-slot="{errors}">
                                    <b-form-group label="Zipcode" label-for="zipcode">
                                        <b-form-input v-model="form.zipcode" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
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
    import * as VeeValidate from "../../../plugins/vee-validate"
    import VueMask from "v-mask"
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"
    
    Vue.use(VeeValidate)
    Vue.use(VueMask)

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                form: {
                    phone_country_id: this.$store.getters.user.business.country_id,
                    state_id: null,
                    city_id: null
                },
                countries: [],
                states: {
                    items: [],
                    loader: true
                },
                cities: {
                    items: [],
                    loader: false
                }
            }
        },
        created: async function () {
            const countriesResponse = await this.$http.get("utilities/countries")
            this.countries = countriesResponse.data

            if (this.$route.params.id) {
                const suppliersResponse = await this.$http.get("inventory/suppliers/" + this.$route.params.id)
                this.form.name = suppliersResponse.data.name
                this.form.description = suppliersResponse.data.description
                this.form.first_name = suppliersResponse.data.first_name
                this.form.last_name = suppliersResponse.data.last_name
                this.form.email = suppliersResponse.data.email
                this.form.phone_country_id = suppliersResponse.data.phone_country_id
                this.form.phone_number = suppliersResponse.data.phone_number
                this.form.street = suppliersResponse.data.street
                this.form.suburb = suppliersResponse.data.suburb
                this.form.state_id = suppliersResponse.data.state_id
                this.form.city_id = suppliersResponse.data.city_id
                this.form.zipcode = suppliersResponse.data.zip_code
            }

            this.showLoader = false
        },
        computed: {
            country: function () {
                return this.countries.find(countryRow => countryRow.id == this.form.phone_country_id) ?? {}
            }
        },
        watch: {
            "form.phone_country_id": {
                handler: function (phone_country_id) {
                    this.states.loader = true
                    this.$http.get("utilities/states?country_id=" + phone_country_id)
                    .then(states => {
                        this.states.items = states.data
                        this.states.loader = false
                    })
                },
                immediate: true
            },
            "form.state_id": {
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
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("inventory/suppliers/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("inventory/suppliers", this.form)
                }

                axios.then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "inventory.suppliers"})
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