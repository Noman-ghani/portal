<template>
    <overlay :show="showLoader" full-height-with-heading>
        <template v-if="!showLoader">
            <router-link :to="{name: 'analytics.index'}"><b-icon-arrow-left></b-icon-arrow-left> Reports</router-link>
            <p class="mt-2 mb-3 font-size-24 font-weight-800">Expenses Summary</p>
            <b-row>
                <b-col md="6" :class="{'mb-3': $screen.width < 768}">
                    <div class="form-control d-flex align-items-center" style="max-width: 350px;">
                        <b-icon-calendar-fill class="mr-2"></b-icon-calendar-fill>
                        <date-range-picker @update="fetchData()" control-container-class="" :locale-data="{firstDay: 1, format: 'mmmm dd, yyyy'}" show-dropdowns v-model="form.dateRange"></date-range-picker>
                    </div>
                </b-col>
                <b-col md="6" class="d-flex">
                    <div :class="{'ml-auto': $screen.width >= 768}">
                        <b-button v-b-modal.expenses-form-modal variant="transparent" class="btn-with-shadow">
                            Add Expense
                            <span class="svg-wrapper-20 ml-1">
                                <b-icon-plus></b-icon-plus>
                            </span>
                        </b-button>
                        <b-button v-b-toggle.filters-sidebar variant="transparent" class="btn-with-shadow ml-3">
                            Filters
                            <span class="svg-wrapper-20 ml-1">
                                <b-icon-filter></b-icon-filter>
                            </span>
                        </b-button>
                    </div>
                </b-col>
            </b-row>
            <overlay :show="dataLoader" full-height-with-heading-and-submenus>
                <template v-if="!dataLoader">
                    <b-table class="mt-4 report-table" responsive hover :fields="data.fields" :items="data.items">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th></b-th>
                            <b-th></b-th>
                            <b-th></b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{data.totals.price | currency}}</b-th>
                        </template>
                        <template #cell(expense)="data">
                            {{data.item.title}}
                        </template>
                        <template #cell(branch)="data">
                            {{data.item.branch.name}}
                        </template>
                        <template #cell(added_by)="data">
                            {{data.item.staff.full_name}}
                        </template>
                        <template #cell(price)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.price | currency}}
                        </template>
                    </b-table>
                </template>
                <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                    <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                        <b-modal id="expenses-form-modal" no-close-on-esc no-close-on-backdrop title="Add Expense">
                            <ValidationProvider vid="branch_id" name="Branch" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Branch *" label-for="branch_id">
                                    <b-form-select v-model="expenseForm.branch_id" :options="branches" value-field="id" text-field="name" :class="{'is-invalid': errors[0]}">
                                        <template #first>
                                            <b-form-select-option :value="null">-- Please Select --</b-form-select-option>
                                        </template>
                                    </b-form-select>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="category" name="Category" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Category *" label-for="category">
                                    <b-form-select v-model="expenseForm.category" :options="expensesCategories" :class="{'is-invalid': errors[0]}">
                                        <template #first>
                                            <b-form-select-option :value="null">-- Please Select --</b-form-select-option>
                                        </template>
                                    </b-form-select>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="expense" name="Expense" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Expense *" label-for="expense">
                                    <b-form-input v-model="expenseForm.title" :class="{'is-invalid': errors[0]}"></b-form-input>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider vid="price" name="Price" :rules="{required: true}" v-slot="{errors}">
                                <b-form-group label="Price *" label-for="price">
                                    <b-form-input v-model="expenseForm.price" :class="{'is-invalid': errors[0]}"></b-form-input>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                            <template #modal-footer>
                                <div class="d-flex flex-grow-1 justify-content-between">
                                    <submit-button @click.native="onSubmit()" type="submit" ref="submit-button" :disabled="invalid" class="ml-auto"></submit-button>
                                </div>
                            </template>
                        </b-modal>
                    </b-form>
                </ValidationObserver>
                <b-sidebar id="filters-sidebar" backdrop-variant="dark" no-close-on-backdrop right backdrop shadow>
                    <template #default="{hide}">
                        <div class="p-3">
                            <b-form-group label="Locations" label-for="locations">
                                <b-form-select :options="branches" value-field="id" text-field="name" v-model="form.branch_id">
                                    <template #first>
                                        <b-form-select-option :value="null">All Locations</b-form-select-option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                            <b-form-group label="Staff" label-for="staff">
                                <b-form-select :options="staffs" v-model="form.staff_id">
                                    <template #first>
                                        <b-form-select-option :value="null">All Staff</b-form-select-option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                            <b-form-group label="Categories" label-for="category">
                                <b-form-select :options="expensesCategories" v-model="form.category">
                                    <template #first>
                                        <b-form-select-option :value="null">All Categories</b-form-select-option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                            <div class="d-flex">
                                <b-button @click="reset(); fetchData(); hide()" class="flex-basis-50 mr-1 box-shadow with-border" variant="transparent">Clear</b-button>
                                <b-button @click="fetchData(); hide()" class="flex-basis-50 ml-1" variant="primary">Apply</b-button>
                            </div>
                        </div>
                    </template>
                </b-sidebar>
            </overlay>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import DateRangePicker from "vue2-daterange-picker"
    import moment from "moment"
    import Overlay from "@/components/helpers/overlay.vue"
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
                dataLoader: true,
                branches: [],
                expensesCategories: [],
                data: {
                    fields: [
                        { key: "expense" },
                        { key: "branch" },
                        { key: "added_by" },
                        { key: "category" },
                        { key: "price", thClass: "text-right", tdClass: "text-right" },
                    ],
                    items: [],
                    totals: {}
                },
                form: {
                    branch_id: this.$route.query.branch_id ?? null,
                    staff_id: this.$route.query.staff_id ?? null,
                    category: this.$route.query.category ?? null,
                    dateRange: {
                        startDate: this.$route.query.start_date ?? moment().startOf("month"),
                        endDate: this.$route.query.end_date ?? moment().endOf("month")
                    }
                },
                expenseForm: {
                    title: null,
                    branch_id: null,
                    category: null,
                    price: null
                }
            }
        },
        created: async function () {
            const branchesPromise = new Promise((resolve) => { this.$http.get("branches", {params: {"with-staff": 1}}).then(response => resolve(response)) })
            const expensesCategoriesPromise = await this.$http.get("utilities/expenses-categories")

            let [branchesResponse, expensesCategoriesResponse] = await Promise.all([branchesPromise, expensesCategoriesPromise])
            
            this.branches = branchesResponse.data
            this.expensesCategories = expensesCategoriesResponse.data

            this.showLoader = false
            this.fetchData()
        },
        methods: {
            reset: function () {
                this.form = {
                    branch_id: null,
                    staff_id: null,
                    category: null,
                    dateRange: {
                        startDate: moment().startOf("month"),
                        endDate: moment().endOf("month")
                    }
                }
            },
            fetchData: function () {
                history.pushState({}, null, this.$route.path + '?' + new URLSearchParams(this.query).toString())

                this.dataLoader = true
                this.$http.get("reports/expenses-summary", {params: this.query})
                .then(response => {
                    this.data.items = response.data
                    this.data.totals = {
                        price: 0
                    }

                    this.data.items.forEach(row => {
                        this.data.totals.price = parseFloat(this.data.totals.price) + parseFloat(row.price)
                    })

                    this.dataLoader = false
                })
            },
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.post("reports/expenses-summary", this.expenseForm)
                .then(response => {
                    this.$refs["submit-button"].displayLoader = false
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$bvModal.hide("expenses-form-modal")
                        this.fetchData()
                    }
                })
                .catch(errors => {
                    this.$refs["submit-button"].displayLoader = false
                    this.$refs.form.setErrors(errors.response.data)
                })
            }
        },
        computed: {
            query: function () {
                let query = {...this.form}
                query.start_date = moment(query.dateRange.startDate).format("YYYY-MM-DD")
                query.end_date = moment(query.dateRange.endDate).format("YYYY-MM-DD")
                delete query.dateRange
                Object.keys(query).forEach((k) => query[k] == null && delete query[k])

                return query
            },
            staffs: function () {
                let staffs = []
                
                if (this.form.branch_id) {
                    this.branches.find(branch => branch.id == this.form.branch_id).staff.forEach(branchStaff => {
                        staffs.push({value: branchStaff.staff.id, text: branchStaff.staff.full_name})
                    })
                } else {
                    this.branches.forEach(branch => {
                        branch.staff.forEach(branchStaff => {
                            const doesStaffExist = staffs.find(staff => staff.value == branchStaff.staff.id)

                            if (!doesStaffExist) {
                                staffs.push({value: branchStaff.staff.id, text: branchStaff.staff.full_name})
                            }
                        })
                    })
                }

                return staffs
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .vue-daterange-picker{
    font-size: 12px;
    line-height: 1.9;
}

::v-deep .report-table{
    table{
        @media (max-width: 540px) {
               width: 540px;
            }
        }
    }
</style>