<template>
    <overlay :show="showLoader" full-height class="centralized">
        <template v-if="!showLoader">
            <heading-with-back :back-link-to="{name: 'staff.employees'}">
                <template #title>
                    {{$route.params.id ? 'Edit Employee' : 'Add Employee'}}
                </template>
            </heading-with-back>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                <b-form @submit.stop.prevent="handleSubmit(onSubmit)" autocomplete="off">
                    <b-card>
                        <template #header>
                            <h2>Basic Info</h2>
                        </template>
                        <b-row>
                            <b-col :md="$screen.width > 992 ? 3: 12" :class="{'d-flex staff-profile-photo position-relative align-items-center': true}">
                                <div v-if="!form.profile_image" :class="{'border rounded-circle d-flex justify-content-center align-items-center no-image': true,  'flex-grow-1' : $screen.width > 1024}">
                                    <b-form-file accept="image/*" @click="this.value = null" @change="onUpload($event)" plain></b-form-file>
                                    <b-icon-camera-fill font-scale="1.5"></b-icon-camera-fill>
                                </div>
                                <div v-else class="with-image">
                                    <b-img-lazy class="border rounded-circle position-absolute" :src="form.profile_image" width="209" height="215"></b-img-lazy>
                                    <div class="border bi-camera-fill-wrapper d-flex align-items-center rounded-circle">
                                        <b-form-file accept="image/*" @click="this.value = null" @change="onUpload($event)" plain></b-form-file>
                                        <b-icon-camera-fill font-scale="2"></b-icon-camera-fill>
                                    </div>
                                    <div @click="form.profile_image = null" class="border bi-trash-wrapper d-flex align-items-center rounded-circle pointer">
                                        <b-icon-trash font-scale="2"></b-icon-trash>
                                    </div>
                                </div>
                            </b-col>
                            <b-col :md="$screen.width > 992 ? 9: 12" :class="{'mt-4' : $screen.width <= 992}">
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
                                        <ValidationProvider vid="staff_title" name="Staff title" :rules="{required: true}" v-slot="{errors}">
                                            <b-form-group label="Staff title *" label-for="staff_title">
                                                <b-form-input v-model="form.staff_title" :class="{'is-invalid': errors[0]}" placeholder="e.g. Hair Dresser" />
                                                <b-form-text>This title will be visible to clients</b-form-text>
                                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                            </b-form-group>
                                        </ValidationProvider>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col md="12">
                                <b-form-group label="Notes" label-for="notes">
                                    <b-form-textarea v-model="form.notes" rows="4" placeholder="Add private notes viewable in staff settings only" />
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h2>Contact</h2>
                        </template>
                        <b-row>
                            <b-col md="6">
                                <ValidationProvider vid="email" name="E-mail address" :rules="{required: true, email: true}" v-slot="{errors}">
                                    <b-form-group label="E-mail address *" label-for="email">
                                        <b-form-input type="email" v-model="form.email" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="Phone number *" label-for="phone_number">
                                    <b-input-group class="phone">
                                        <b-input-group-prepend>
                                            <b-input-group-text class="p-0">
                                                <div class="select-wrap flag-wrap">
                                                    <div class="flag-code">
                                                        <span v-html="country.flag"></span>
                                                        <span class="pl-1">{{country.phone_code}}</span>
                                                    </div>
                                                    <b-form-select tabindex="-1" v-model="form.phone_country_id" class="b-0">
                                                        <b-form-select-option v-for="country in countries" v-bind:key="country.id" :value="country.id" v-html="country.name + ' ' + country.flag + ' +' + country.phone_code" />
                                                    </b-form-select>
                                                    <span class="select-icon">
                                                        <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                                    </span>
                                                </div>
                                            </b-input-group-text>
                                        </b-input-group-prepend>
                                        <ValidationProvider vid="phone_number" name="Phone number" :rules="{required: true}" v-slot="{errors}" tag="div">
                                            <b-form-input @keyup="($event.target.value[0] === '0') ? form.phone_number = $event.target.value.substring(1) : ''" v-model="form.phone_number" v-mask="country.phone_mask" :placeholder="country.phone_mask" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </ValidationProvider>
                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h2>Employment</h2>
                        </template>
                        <b-row>
                            <b-col md="6">
                                <b-form-group label="Employment start date" label-for="employment-start-date">
                                    <div class="form-control d-flex align-items-center">
                                        <b-icon-calendar-fill class="mr-3"></b-icon-calendar-fill>
                                        <date-range-picker v-model="form.emp_start_date" single-date-picker show-dropdowns :ranges="false" auto-apply control-container-class="" :locale-data="{format: 'dddd dd mmmm yyyy'}"></date-range-picker>
                                    </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="Employment end date" label-for="employment-end-date">
                                    <div class="form-control d-flex align-items-center">
                                        <b-icon-calendar-fill class="mr-3"></b-icon-calendar-fill>
                                        <date-range-picker v-model="form.emp_end_date" single-date-picker show-dropdowns :ranges="false" auto-apply control-container-class="" :locale-data="{format: 'dddd dd mmmm yyyy'}"></date-range-picker>
                                        <b-icon-x v-if="form.emp_end_date.startDate" font-scale="1" class="ml-3 pointer" @click="form.emp_end_date.startDate = null; form.emp_end_date.endDate = null"></b-icon-x>
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h2>Works at</h2>
                            <p>Choose the locations where this staff member works.</p>
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
                    <b-card class="mt-5 border-0" no-body>
                        <template #header>
                            <b-row>
                                <b-col md="10">
                                    <h2>Online Booking</h2>
                                    <p>Allow this staff member to make client bookings on the calendar.</p>
                                </b-col>
                                <b-col md="2" class="text-right mt-2">
                                    <toggle-button v-model="form.enable_appointments" color="#0C56C9" :height="30" :width="60" :sync="true" />
                                </b-col>
                            </b-row>
                        </template>
                    </b-card>
                    <b-card class="mt-5 color-card">
                        <template #header>
                            <h2>Calendar colour</h2>
                            <p>Choose a colour to see this staff members appointments in the calendar.</p>
                        </template>
                        <ul class="colors_list">
                            <li v-for="color in $store.getters.user.settings.colors" v-bind:key="color">
                                <a v-on:click="form.appointment_color = color" href="javascript:;" v-bind:class="{active: form.appointment_color == color}" :style="'background-color: ' + color"></a>
                            </li>
                        </ul>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h2>Provide services</h2>
                            <p>Add the services this staff member can offer.</p>
                        </template>
                        <div class="d-flex justify-content-between bg-light-gray p-3 font-size-17">
                            <p class="m-0">All services ({{form.service_ids.length}})</p>
                            <b-link @click="$refs['services-modal'].show()">Edit</b-link>
                        </div>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h2>Commission</h2>
                            <p>Choose how much commission this staff member makes.</p>
                        </template>
                        <b-row>
                            <b-col md="4">
                                <ValidationProvider vid="service" name="Service commission" :rules="{min_value: 1, max_value: 100}" v-slot="{errors}">
                                    <b-form-group label="Service commission" label-for="service">
                                        <b-input-group>
                                            <b-input-group-prepend>
                                                <b-input-group-text class="pt-0 pb-0">%</b-input-group-text>
                                            </b-input-group-prepend>
                                            <b-form-input type="number" v-model="form.service_commission" @blur.native="if (form.service_commission) form.service_commission = parseFloat(form.service_commission).toFixed(2)" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-input-group>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="product" name="Product commission" :rules="{min_value: 1, max_value: 100}" v-slot="{errors}">
                                    <b-form-group label="Product commission" label-for="product">
                                        <b-input-group>
                                            <b-input-group-prepend>
                                                <b-input-group-text class="pt-0 pb-0">%</b-input-group-text>
                                            </b-input-group-prepend>
                                            <b-form-input type="number" v-model="form.product_commission" @blur.native="if (form.product_commission) form.product_commission = parseFloat(form.product_commission).toFixed(2)" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-input-group>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="voucher" name="Deal commission" :rules="{min_value: 1, max_value: 100}" v-slot="{errors}">
                                    <b-form-group label="Deal commission" label-for="voucher">
                                        <b-input-group>
                                            <b-input-group-prepend>
                                                <b-input-group-text class="pt-0 pb-0">%</b-input-group-text>
                                            </b-input-group-prepend>
                                            <b-form-input type="number" v-model="form.deal_commission" @blur.native="if (form.deal_commission) form.deal_commission = parseFloat(form.deal_commission).toFixed(2)" :class="{'is-invalid': errors[0]}" />
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-input-group>
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
            <b-modal ref="profile-photo-modal" no-close-on-esc no-close-on-backdrop title="Resize / Crop Image" ok-only ok-title="Apply" @ok="onCroppedOrResized($event)">
                <clipper-basic :src="profileImageURL" ref="clipper"></clipper-basic>
            </b-modal>
            <b-modal ref="services-modal" no-close-on-esc no-close-on-backdrop body-class="p-0" hide-header ok-only ok-title="Close" title="Services">
                <services @checkedGroup="form.service_ids = $event" :group-services-by-pricing="true" :show-checkbox="true" :service-ids="form.service_ids"></services>
            </b-modal>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import VueMask from "v-mask"
    import DateRangePicker from "vue2-daterange-picker"
    import {ToggleButton} from "vue-js-toggle-button"
    import VueRx from "vue-rx"
    import VuejsClipper from "vuejs-clipper"
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import Services from "../../services"
    import SubmitButton from "@/components/helpers/submit-button.vue"
    
    Vue.use(VeeValidate)
    Vue.use(VueMask)
    Vue.use(VueRx)
    Vue.use(VuejsClipper)

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            DateRangePicker,
            ToggleButton,
            Services,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                form: {
                    profile_image: null,
                    first_name: null,
                    last_name: null,
                    staff_title: null,
                    email: null,
                    emp_start_date: {
                        startDate: new Date(),
                        endDate: new Date()
                    },
                    emp_end_date: {
                        startDate: null,
                        endDate: null
                    },
                    permission: null,
                    phone_country_id: this.$store.getters.user.business.country.id,
                    enable_appointments: true,
                    appointment_color: this.$store.getters.user.settings.colors[2],
                    branch_ids: [],
                    service_ids: [],
                    service_commission: null,
                    product_commission: null,
                    deal_commission: null
                },
                profileImageURL: null,
                countries: [],
                branches: [],
                services: []
            }
        },
        created: async function () {
            this.form.branch_ids = []
            this.form.service_ids = []

            const countriesResponse = await this.$http.get("utilities/countries")
            this.countries = countriesResponse.data

            const branchesResponse = await this.$http.get("branches")
            this.branches = branchesResponse.data

            const servicesResponse = await this.$http.get("services", {params: {group_by: "category_hierarchy"}})
            this.services = servicesResponse.data

            if (this.$route.params.id) {
                const staffResponse = await this.$http.get("staff/" + this.$route.params.id)
                this.form.profile_image = staffResponse.data.profile_image
                this.form.first_name = staffResponse.data.first_name
                this.form.last_name = staffResponse.data.last_name
                this.form.email = staffResponse.data.user.email
                this.form.phone_country_id = staffResponse.data.phone_country_id
                this.form.phone_number = staffResponse.data.phone_number
                this.form.staff_title = staffResponse.data.staff_title
                this.form.permission = staffResponse.data.permission
                this.form.notes = staffResponse.data.notes

                if (staffResponse.data.emp_start_date) {
                    this.form.emp_start_date = {
                        startDate: new Date(staffResponse.data.emp_start_date),
                        endDate: new Date(staffResponse.data.emp_start_date)
                    }
                }
                
                if (staffResponse.data.emp_end_date) {
                    this.form.emp_end_date = {
                        startDate: new Date(staffResponse.data.emp_end_date),
                        endDate: new Date(staffResponse.data.emp_end_date)
                    }
                }
                
                this.form.enable_appointments = staffResponse.data.enable_appointments == 1
                this.form.appointment_color = staffResponse.data.appointment_color
                this.form.service_commission = staffResponse.data.service_commission
                this.form.product_commission = staffResponse.data.product_commission
                this.form.deal_commission = staffResponse.data.deal_commission

                staffResponse.data.branches.forEach(branch => this.form.branch_ids.push(branch.branch_id))
                staffResponse.data.services.forEach(service => this.form.service_ids.push(service.service_id))
            } else {
                this.branches.forEach(branchRow => this.form.branch_ids.push(branchRow.id))
                
                this.services.forEach(category => {
                    category.services.forEach(service => {
                        this.form.service_ids.push(service.id)
                    })
                })
            }

            this.showLoader = false
        },
        computed: {
            country: function () {
                return this.countries.find(countryRow => countryRow.id == this.form.phone_country_id) ?? {}
            }
        },
        methods: {
            onUpload: function ($event) {
                if ($event.target.files.length !== 0) {
                    if (this.profileImageURL) URL.revokeObjectURL(this.profileImageURL)
                    this.profileImageURL = window.URL.createObjectURL($event.target.files[0])
                    this.$refs["profile-photo-modal"].show()
                }

                $event.target.value = null
            },
            onCroppedOrResized: function () {
                this.form.profile_image = this.$refs.clipper.clip().toDataURL("image/jpeg", 1)
                this.profileImageURL = null
                this.$refs["profile-photo-modal"].hide()
            },
            onSubmit: function () {
                if (!this.form.branch_ids.length) {
                    this.$helpers.showToast("danger", "Please select atleast one branch where this staff member works.")
                    return
                }

                if (!this.form.service_ids.length) {
                    this.$helpers.showToast("danger", "Please select atleast one service that this staff member provides.")
                    return
                }

                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("staff/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("staff", this.form)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$store.getters.user.staff = res.data.staff
                        this.$router.push({name: "staff.employees"})
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
    .service-categories {
        background-color: #f2f2f7;
        padding: 12px 16px;
        border-radius: 4px;
        border: 1px solid #f2f2f7;
        color: #101928;
        font-size: 16px;
        &.not-collapsed {
            border-radius: 4px 4px 0 0;
        }
    }
    .category-service {
        padding: 18px;
        border: 1px solid #f2f2f7;
    }
    ::v-deep .color-card{
        .card-body{
            padding-bottom: 0;
        }
    }
    .colors_list {
        margin: .5rem 0 0;
        li {
            display: inline-block;
            margin: 0 10px 10px;
            a {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: block;
                &:hover,
                &.active {
                    border: 1px solid #000000;
                }
                &.active {
                    background-image: url('data:image/svg+xml; utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>');
                    background-repeat: no-repeat;
                    background-position: 50%;
                }
            }
        }
    }
    .staff-profile-photo {
        .b-icon {
            z-index: 2;
            position: absolute;
        }
        .no-image {
            background-color: #cde4ff;
            color: #0C56C9;
            height: 200px;
            width: 200px;
            @media (max-width: 992px) {
                height: 90px;
                width: 90px;
            }
            margin: auto;
        }
        .with-image {
            .bi-camera-fill-wrapper {
                position: absolute;
                bottom: -20px;
                padding: 30px;
                justify-content: center;
                left: 10px;
                background-color: #ffffff;
                border-color: #e7e8e9;
                color: #101928;
                box-shadow: 0 4px 6px 0 rgb(16 25 40 / 10%);
            }
            .bi-trash-wrapper {
                position: absolute;
                bottom: -20px;
                padding: 30px;
                justify-content: center;
                right: 10px;
                background-color: #ffffff;
                border-color: #e7e8e9;
                color: #101928;
                box-shadow: 0 4px 6px 0 rgb(16 25 40 / 10%);
            }
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