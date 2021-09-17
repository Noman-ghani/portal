<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
            <b-modal size="lg" visible no-close-on-esc no-close-on-backdrop @hidden="$router.push({name: 'staff.closed-dates'})">
                <template #modal-title>
                    {{$route.params.id ? "Edit Closed Date" : "New Closed Date"}}
                </template>
                <overlay :show="showLoader">
                    <template v-if="!showLoader">
                        <b-alert show variant="info">Online bookings can not be placed during closed dates.</b-alert>
                        <b-row>
                            <b-col md="6">
                                <ValidationProvider vid="daterange" name="Date Range" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Date Range *" label-for="daterange">
                                        <div class="form-control d-flex align-items-center justify-content-between">
                                            <date-range-picker control-container-class="" auto-apply :ranges="false" :locale-data="{firstDay: 1, format: 'mmmm dd, yyyy'}" show-dropdowns v-model="form.dateRange"></date-range-picker>
                                            <b-icon-calendar-fill></b-icon-calendar-fill>
                                        </div>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <ValidationProvider vid="description" name="Description" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Description *" label-for="description">
                                        <b-form-input v-model="form.description" placeholder="e.g. public holiday" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                        <b-form-checkbox-group v-model="form.branch_ids">
                            <b-row>
                                <b-col md="6" class="pt-3 pb-3" v-for="branch in branches" v-bind:key="branch.id">
                                    <b-form-checkbox :value="branch.id" class="c-icon-wrap">
                                        <span class="d-flex align-items-center justify-content-center c-icon">
                                            <svg viewBox="0 0 25 23" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.75 20.75V15.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v5.25h4.5V12.5a.75.75 0 1 1 1.5 0v9a.75.75 0 0 1-.75.75h-16a.75.75 0 0 1-.75-.75v-9a.75.75 0 1 1 1.5 0v8.25h4.5zm1.5 0h2.5v-4.5h-2.5v4.5zm-1.416-10.5a3.727 3.727 0 0 1-2.669-1.124A3.743 3.743 0 0 1 .75 6.498a.75.75 0 0 1 .107-.384l3-5A.75.75 0 0 1 4.5.75h16a.75.75 0 0 1 .643.364l3 5a.75.75 0 0 1 .107.384 3.742 3.742 0 0 1-6.415 2.628 3.727 3.727 0 0 1-5.335.001 3.727 3.727 0 0 1-2.666 1.123zm-4.91-8L2.259 6.695a2.242 2.242 0 0 0 4.238.816.75.75 0 0 1 1.343.003 2.227 2.227 0 0 0 3.99 0 .75.75 0 0 1 1.343 0 2.227 2.227 0 0 0 3.99 0 .75.75 0 0 1 1.342-.003 2.242 2.242 0 0 0 4.238-.816L20.075 2.25H4.925z"></path>
                                            </svg>
                                        </span>
                                        <div class="d-flex flex-column flex-wrap pt-3">
                                            <p class="m-0 font-size-17 font-weight-700">{{branch.name}}</p>
                                        </div>
                                    </b-form-checkbox>
                                </b-col>
                            </b-row>
                        </b-form-checkbox-group>
                    </template>
                </overlay>
                <template #modal-footer>
                    <div class="d-flex flex-grow-1 justify-content-between">
                        <router-link v-if="$route.params.id" :to="{name: 'staff.closed-dates.delete', params: {id: $route.params.id, title: $route.params.data.description}}" class="mr-auto btn btn-danger">DELETE</router-link>
                        <submit-button @click.native="onSubmit()" ref="submit-button" type="submit" class="ml-auto" :disabled="invalid"></submit-button>
                    </div>
                </template>
            </b-modal>
        </b-form>
    </ValidationObserver>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import DateRangePicker from "vue2-daterange-picker"
    import Overlay from "../../helpers/overlay.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            DateRangePicker,
            Overlay,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                form: {
                    dateRange: {
                        startDate: new Date(),
                        endDate: new Date()
                    },
                    description: null,
                    branch_ids: []
                },
                branches: []
            }
        },
        created: function () {
            this.$http.get("branches")
            .then((branches) => {
                this.branches = branches.data
                let branchData = branches.data

                if (this.$route.params.id) {
                    this.form.description = this.$route.params.data.description

                    if (this.$route.params.data.branches.length) {
                        branchData = this.$route.params.data.branches.map(element => {
                            return {id: element.branch.id}
                        })
                    }
                }

                branchData.forEach(branch => {
                    this.form.branch_ids.push(branch.id)
                })

                this.showLoader = false
            })
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let formData = this.form
                let axios = null

                if (this.branches.length === this.form.branch_ids.length) {
                    delete formData["branch_ids"]
                }

                if (this.$route.params.id) {
                    axios = this.$http.put("staff/closed-dates/" + this.$route.params.id, formData)
                } else {
                    axios = this.$http.post("staff/closed-dates", formData)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "staff.closed-dates", params: {reload: true}})
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