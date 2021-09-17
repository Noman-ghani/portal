<template>
    <overlay :show="showLoader" full-height class="centralized">
        <template v-if="!showLoader">
            <heading-with-back :back-link-to="{name: 'services'}">
                <template #title>
                    {{$route.params.id ? 'Edit Service' : 'Add Service'}}
                </template>
            </heading-with-back>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                <b-form @submit.stop.prevent="handleSubmit(onSubmit)" autocomplete="off">
                    <b-card>
                        <template #header>
                            <h2>Basic Info</h2>
                            <p>Add a service name</p>
                        </template>
                        <b-row>
                            <b-col md="6">
                                <ValidationProvider vid="title" name="Service name" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Service name *" label-for="title">
                                        <b-form-input v-model="form.title" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <ValidationProvider vid="category" name="Service category" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Service category *" label-for="category">
                                        <b-form-select v-model="form.category_id" :class="{'is-invalid': errors[0]}" :options="categories" text-field="title" value-field="id">
                                            <template #first>
                                                <b-form-select-option :value="null">No category selected</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="Treatment type *" label-for="treatment_type">
                                    <b-form-input @click="$refs['treatment-types-modal'].show()" v-model="treatment_type" readonly placeholder="Select treatment type" />
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="Service available for" label-for="available-for">
                                    <b-form-select v-model="form.available_for" :options="[{'value': 'male', 'text': 'Male'}, {'value': 'female', 'text': 'Female'}]">
                                        <template #first>
                                            <b-form-select-option :value="null">Everyone</b-form-select-option>
                                        </template>
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="12">
                                <b-form-group label="Service description" label-for="description">
                                    <b-form-textarea v-model="form.description" rows="6" />
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h2>Pricing and Duration</h2>
                            <p>Add the pricing options and duration of the service.</p>
                        </template>
                        <b-row style="background: #f2f2f7; border-radius: 8px;" v-for="n in form.pricing.length" v-bind:key="'pricing-' + n" :class="{'m-0': true, 'mt-5': n > 1, 'pt-4': true, 'pb-4': true, 'pl-3': true, 'pr-3': true}">
                            <b-col md="12">
                                <b-row class="mb-3">
                                    <b-col md="10">
                                        <h4>Pricing Option {{n}}</h4>
                                    </b-col>
                                    <b-col v-if="form.pricing.length > 1" @click="form.pricing.splice(n-1, 1)" md="2" class="text-right">
                                        <b-badge variant="danger" class="pointer">DELETE</b-badge>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col md="12">
                                <ValidationProvider vid="pricing_name" name="Pricing name (optional)" v-slot="{errors}">
                                    <b-form-group label="Pricing name (optional)" label-for="pricing_name">
                                        <b-form-input v-model="form.pricing[n-1].name" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="pricing_duration" name="Duration" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Duration *" label-for="pricing_duration">
                                        <b-form-select v-model="form.pricing[n-1].duration" :class="{'is-invalid': errors[0]}" :options="$store.getters.user.settings.durations" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="pricing_price" name="Price" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Price *" label-for="pricing_price">
                                        <b-input-group :prepend="$store.getters.user.business.country.currency">
                                            <b-form-input type="number" v-model="form.pricing[n-1].price" @blur.native="if (form.pricing[n-1].price) form.pricing[n-1].price = parseFloat(form.pricing[n-1].price).toFixed(2)" :class="{'is-invalid': errors[0]}" placeholder="0.00" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-input-group>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="pricing_special_price" name="Special Price" :rules="{max_value: (form.pricing[n-1].price - 1)}" v-slot="{errors}">
                                    <b-form-group label="Special price (optional)" label-for="pricing_special_price">
                                        <b-input-group :prepend="$store.getters.user.business.country.currency">
                                            <b-form-input type="number" v-model="form.pricing[n-1].special_price" @blur.native="if (form.pricing[n-1].special_price) form.pricing[n-1].special_price = parseFloat(form.pricing[n-1].special_price).toFixed(2)" :class="{'is-invalid': errors[0]}" :disabled="!form.pricing[n-1].price" placeholder="0.00" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-input-group>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                        <b-link @click="form.pricing.push({...form.pricing[0]})" class="mt-3 d-block w-100">
                            <b-icon-plus /> Add Pricing Option
                        </b-link>
                    </b-card>
                    <b-card no-body class="mt-5" header-class="border-0">
                        <template #header>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex flex-column">
                                    <h1>Online bookings</h1>
                                    <p>Enable online bookings, choose who the service is available for and add a short description.</p>
                                </div>
                                <toggle-button v-model="form.enable_online_booking" color="#0C56C9" :height="30" :width="50" :sync="true" class="m-0" />
                            </div>
                        </template>
                    </b-card>
                    <b-card no-body class="mt-5" header-class="border-0">
                        <template #header>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex flex-column">
                                    <h1>Enable Commission</h1>
                                    <p>Enable staff commission on checkout. Configure <router-link :to="{name: 'setup.sales-settings'}">sales settings</router-link> here</p>
                                </div>
                                <toggle-button v-model="form.enable_commission" color="#0C56C9" :height="30" :width="50" :sync="true" class="m-0" />
                            </div>
                        </template>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h1>Location</h1>
                            <p>Choose the location where the service will take place.</p>
                        </template>
                        <b-form-checkbox-group v-model="form.branch_ids">
                            <b-row>
                                <b-col md="6" class="pt-3 pb-3" v-for="branch in branches" v-bind:key="branch.id">
                                    <b-form-checkbox :value="branch.id" class="c-icon-wrap">
                                        <span class="d-flex align-items-center justify-content-center c-icon">
                                            <svg viewBox="0 0 25 23" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.75 20.75V15.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v5.25h4.5V12.5a.75.75 0 1 1 1.5 0v9a.75.75 0 0 1-.75.75h-16a.75.75 0 0 1-.75-.75v-9a.75.75 0 1 1 1.5 0v8.25h4.5zm1.5 0h2.5v-4.5h-2.5v4.5zm-1.416-10.5a3.727 3.727 0 0 1-2.669-1.124A3.743 3.743 0 0 1 .75 6.498a.75.75 0 0 1 .107-.384l3-5A.75.75 0 0 1 4.5.75h16a.75.75 0 0 1 .643.364l3 5a.75.75 0 0 1 .107.384 3.742 3.742 0 0 1-6.415 2.628 3.727 3.727 0 0 1-5.335.001 3.727 3.727 0 0 1-2.666 1.123zm-4.91-8L2.259 6.695a2.242 2.242 0 0 0 4.238.816.75.75 0 0 1 1.343.003 2.227 2.227 0 0 0 3.99 0 .75.75 0 0 1 1.343 0 2.227 2.227 0 0 0 3.99 0 .75.75 0 0 1 1.342-.003 2.242 2.242 0 0 0 4.238-.816L20.075 2.25H4.925z"></path>
                                            </svg>
                                        </span>
                                        <div class="d-flex flex-column flex-wrap pt-2">
                                            <p class="m-0 font-size-17 font-weight-700">{{branch.name}}</p>
                                            <p class="m-0 font-size-15 sub-color">{{branch.address}}</p>
                                        </div>
                                    </b-form-checkbox>
                                </b-col>
                            </b-row>
                        </b-form-checkbox-group>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h1>Staff</h1>
                            <p>Assign staff to the service and manage staff commission</p>
                        </template>
                        <b-form-checkbox-group v-model="form.staff_ids">
                            <b-row>
                                <b-col md="6" class="pt-3 pb-3" v-for="staff in staffMembers" v-bind:key="staff.id">
                                    <b-form-checkbox :value="staff.id" class="c-icon-wrap">
                                        <span class="d-flex align-items-center justify-content-center c-icon">
                                            <b-icon-person-fill></b-icon-person-fill>
                                        </span>
                                        <div class="d-flex flex-column flex-wrap pt-2">
                                            <p class="m-0 font-size-17 font-weight-700">{{staff.full_name}}</p>
                                            <p class="m-0 font-size-15 sub-color">{{staff.staff_title}}</p>
                                        </div>
                                    </b-form-checkbox>
                                </b-col>
                            </b-row>
                        </b-form-checkbox-group>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h1>Sales settings</h1>
                            <p>Set the tax rate</p>
                        </template>
                        <b-row>
                            <template v-for="(branchRow, idx) in branches">
                                <b-col md="6" v-if="form.branch_ids.includes(branchRow.id)" v-bind:key="branchRow.id">
                                    <b-form-group :label="branchRow.name" :label-for="branchRow.name">
                                        <b-form-select v-model="form.tax_ids[idx]['tax_id']" :options="taxes" value-field="id" text-field="title">
                                            <template #first>
                                                <b-form-select-option :value="null">Default: No Tax</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                            </template>
                        </b-row>
                    </b-card>
                    <b-row>
                        <b-col md="12" class="text-right mt-4">
                            <submit-button type="submit" ref="submit-button" :disabled="invalid"></submit-button>
                        </b-col>
                    </b-row>
                </b-form>
            </ValidationObserver>
            <b-modal ref="treatment-types-modal" no-close-on-esc no-close-on-backdrop body-class="p-0" title="Treatment Types" ok-only ok-title="Close">
                <div class="p-4 border-bottom">
                    <search-field>
                        <b-form-input autofocus autocomplete="off" v-model="searchQuery" placeholder="Search for treatment types here ..."></b-form-input>
                    </search-field>
                </div>
                <div v-if="treatmentTypesCategories.length" class="scrollable">
                    <ul class="m-0">
                        <li v-for="treatmentTypesCategory, idx1 in treatmentTypesCategories" v-bind:key="'treatment-category-' + idx1" :class="{ 'd-flex': true, 'flex-column': true, 'border-top': idx1 > 0 }">
                            <p class="m-0 p-4 font-size-20 font-weight-800">
                                <b-icon-card-list class="mr-2" />
                                {{treatmentTypesCategory}}
                            </p>
                            <ul class="m-0">
                                <li @click="$emit('treatment-type', treatmentTypesOption)" v-for="treatmentTypesOption, idx2 in treatmentTypesOptions(treatmentTypesCategory)" v-bind:key="'treatment-option-' + idx1 + '-' + idx2" class="p-4 d-flex align-items-center justify-content-between border-top pointer">
                                    <div>
                                        <p class="m-0 font-size-17 font-weight-700">
                                            {{treatmentTypesOption.text}}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <no-data class="mt-5 mb-5" v-else>
                    <img src="@/assets/images/services.svg" />
                    <h2>No Results Found</h2>
                    <p>We could not find any results based on your search.</p>
                </no-data>
            </b-modal>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import {ToggleButton} from "vue-js-toggle-button"
    import Overlay from "../helpers/overlay.vue"
    import HeadingWithBack from "../heading-with-back.vue"
    import NoData from "../no-data.vue"
    import SearchField from "../search-field.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)
    
    export default {
        components: {
            Overlay,
            HeadingWithBack,
            NoData,
            SearchField,
            ToggleButton,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                form: {
                    title: null,
                    category_id: null,
                    treatment_type: null,
                    available_for: null,
                    description: null,
                    pricing: [{
                        name: null,
                        duration: 60,
                        price: null,
                        special_price: null,
                    }],
                    enable_online_booking: true,
                    enable_commission: true,
                    branch_ids: [],
                    staff_ids: [],
                    tax_ids: []
                },
                treatmentTypes: [],
                categories: [],
                branches: [],
                staffMembers: [],
                taxes: [],
                treatment_type: null,
                searchQuery: null
            }
        },
        created: async function () {
            this.$on("treatment-type", (option) => {
                this.treatment_type = option.text
                this.form.treatment_type = option.value
                this.$refs['treatment-types-modal'].hide()
            })

            const categoriesPromise = new Promise((resolve) => { this.$http.get("services/categories").then(response => resolve(response)) })
            const treatmentTypesPromise = new Promise((resolve) => { this.$http.get("utilities/treatment-types").then(response => resolve(response)) })
            const branchesPromise = new Promise((resolve) => { this.$http.get("branches").then(response => resolve(response)) })
            const staffPromise = new Promise((resolve) => { this.$http.get("staff").then(response => resolve(response)) })
            const taxesPromise = new Promise((resolve) => { this.$http.get("taxes").then(response => resolve(response)) })

            let [categoriesResponse, treatmentTypesResponse, branchesResponse, staffResponse, taxesResponse] = await Promise.all([categoriesPromise, treatmentTypesPromise, branchesPromise, staffPromise, taxesPromise])
            
            this.categories = categoriesResponse.data
            treatmentTypesResponse.data.forEach(treatmentType => {
                treatmentType.options.forEach(option => {
                    this.treatmentTypes.push({text: option.text, value: option.value, label: treatmentType.label})
                })
            })
            this.branches = branchesResponse.data
            this.staffMembers = staffResponse.data
            this.taxes = taxesResponse.data
            this.branches.forEach(branchRow => this.form.tax_ids.push({ branch_id: branchRow.id, tax_id: branchRow.service_tax_id }))

            if (this.$route.params.id) {
                this.form.pricing = []
                this.form.branch_ids = []
                this.form.staff_ids = []

                const service = await this.$http.get("services/" + this.$route.params.id + "?with-pricings&with-branches&with-staffs")
                this.form.title = service.data.title
                this.form.treatment_type = service.data.treatment_type.value
                this.form.category_id = service.data.category_id
                this.form.available_for = service.data.available_for
                this.form.description = service.data.description
                this.form.enable_online_booking = service.data.enable_online_booking == 1
                this.form.enable_commission = service.data.enable_commission == 1

                service.data.pricings.forEach(pricingRow => {
                    this.form.pricing.push({
                        name: pricingRow.name,
                        duration: pricingRow.duration,
                        price: pricingRow.price,
                        special_price: pricingRow.special_price,
                    })
                })

                this.treatment_type = service.data.treatment_type.text
                
                service.data.branches.forEach(branchRow => {
                    this.form.branch_ids.push(branchRow.branch_id)
                    const taxRow = this.form.tax_ids.find(taxRow => taxRow.branch_id == branchRow.branch_id)
                    taxRow.tax_id = branchRow.tax_id
                })

                service.data.staffs.forEach(staffRow => this.form.staff_ids.push(staffRow.staff_id))
            } else {
                this.branches.forEach(branchRow => this.form.branch_ids.push(branchRow.id))
                this.staffMembers.forEach(staffRow => this.form.staff_ids.push(staffRow.id))
            }

            this.showLoader = false
        },
        computed: {
            treatmentTypesList: function () {
                return this.treatmentTypes.filter(treatmentType => {
                    if (this.searchQuery) {
                        return treatmentType.text.toLowerCase().includes(this.searchQuery.toLowerCase())
                    }
                    return treatmentType
                })
            },
            treatmentTypesCategories: function () {
                return [...new Set(this.treatmentTypesList.map(treatmentTypes => treatmentTypes.label))]
            }
        },
        methods: {
            treatmentTypesOptions: function (label) {
                return this.treatmentTypesList.filter(treatmentType => treatmentType.label === label)
            },
            onSubmit: function () {
                if (!this.form.branch_ids.length) {
                    this.$helpers.showToast("danger", "Please select atleast one branch for this service.")
                    return
                }

                if (!this.form.staff_ids.length) {
                    this.$helpers.showToast("danger", "Please select atleast one staff for this service.")
                    return
                }

                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("services/service/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("services/service", this.form)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "services"})
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
<style scoped lang="scss">
    .scrollable {
        max-height: calc(100vh - 300px);
        overflow-y: scroll;
    }
</style>