<template>
    <overlay :show="showLoader" full-height-with-heading class="centralized">
        <template v-if="!showLoader">
            <heading-with-back :back-link-to="{name: 'inventory.products'}">
                <template #title>
                    {{$route.params.id ? 'Edit Product' : 'Add Product'}}
                </template>
                <template v-if="$route.params.id" #right>
                    <router-link :to="{name: 'inventory.products.stock-history', params: {id: $route.params.id}}" class="btn btn-primary">Stock History</router-link>
                </template>
            </heading-with-back>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                <b-form @submit.stop.prevent="handleSubmit(onSubmit)" autocomplete="off">
                    <b-card>
                        <template #header>
                            <h2>Basic Details</h2>
                        </template>
                        <b-row>
                            <b-col md="8">
                                <ValidationProvider vid="name" name="Product name" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Product name *" label-for="name">
                                        <b-form-input v-model="form.name" :class="{'is-invalid': errors[0]}" placeholder="e.g. Large shampoo" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="sku" name="SKU" v-slot="{errors}">
                                    <b-form-group label-for="sku">
                                        <template #label>
                                            SKU <span v-b-tooltip.hover title="Stock Keeping Unit"><b-icon-question-square-fill /></span>
                                        </template>
                                        <b-form-input v-model="form.sku" :class="{'is-invalid': errors[0]}" placeholder="e.g. 123ABC" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="category" name="Category" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Category *" label-for="category">
                                        <b-form-select v-model="form.category_id" :options="categories" value-field="id" text-field="name" :class="{'is-invalid': errors[0]}">
                                            <template #first>
                                                <b-form-select-option :value="null">Please Select</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="brand" name="Brand" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Brand *" label-for="brand">
                                        <b-form-select v-model="form.brand_id" :options="brands" value-field="id" text-field="name" :class="{'is-invalid': errors[0]}">
                                            <template #first>
                                                <b-form-select-option :value="null">Please Select</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="4">
                                <ValidationProvider vid="barcode" name="Barcode" v-slot="{errors}">
                                    <b-form-group label="Barcode" label-for="barcode">
                                        <b-form-input v-model="form.barcode" :class="{'is-invalid': errors[0]}" placeholder="e.g. 123ABC" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="12">
                                <ValidationProvider vid="description" name="Description" v-slot="{errors}">
                                    <b-form-group label="Description" label-for="description">
                                        <b-form-textarea rows="6" v-model="form.description" :class="{'is-invalid': errors[0]}" placeholder="e.g. the world's most spectacular product" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card no-body class="mt-5">
                        <template #header>
                            <div class="d-flex justify-content-between">
                                <h1 class="mt-1">Enable Retail Sales</h1>
                            </div>
                        </template>
                        <b-card-body>
                            <b-row class="enable-price">
                                <b-col md="6">
                                    <ValidationProvider vid="retail_price" name="Retail price" :rules="{required: true}" v-slot="{errors}">
                                        <b-form-group label="Retail price *" label-for="retail_price">
                                            <b-input-group :prepend="$store.getters.user.business.country.currency">
                                                <b-form-input type="number" v-model="form.retail_price" :class="{'is-invalid': errors[0]}" placeholder="0.00" @blur.native="form.retail_price ? form.retail_price = parseFloat(form.retail_price).toFixed(2) : null" />
                                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                            </b-input-group>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6">
                                    <ValidationProvider vid="special_price" name="Special price" :rules="{max_value: (form.retail_price - 1)}" v-slot="{errors}">
                                        <b-form-group label="Special price" label-for="special_price">
                                            <b-input-group :prepend="$store.getters.user.business.country.currency">
                                                <b-form-input type="number" v-model="form.special_price" :class="{'is-invalid': errors[0]}" placeholder="0.00" @blur.native="form.special_price ? form.special_price = parseFloat(form.special_price).toFixed(2) : null" />
                                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                            </b-input-group>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                        </b-card-body>
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
                    <b-card no-body class="mt-5">
                        <template #header>
                            <h1>Stock Control</h1>
                            <p>Enable Stock Control levels for this product.</p>
                        </template>
                        <b-card-body>
                            <b-row>
                                <b-col md="6">
                                    <ValidationProvider vid="supplier" name="Supplier" v-slot="{errors}">
                                        <b-form-group label="Supplier" label-for="supplier">
                                            <b-form-select v-model="form.supplier_id" :options="suppliers" value-field="id" text-field="name" :class="{'is-invalid': errors[0]}">
                                                <template #first>
                                                    <b-form-select-option :value="null">Please Select</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6">
                                    <ValidationProvider vid="supply_price" name="Supply price" v-slot="{errors}">
                                        <b-form-group label="Supply price" label-for="supply_price">
                                            <b-input-group :prepend="$store.getters.user.business.country.currency">
                                                <b-form-input type="number" v-model="form.supply_price" @blur.native="form.supply_price = parseFloat(form.supply_price).toFixed(2)" :class="{'is-invalid': errors[0]}" placeholder="0.00" />
                                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                            </b-input-group>
                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                        </b-card-body>
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
                            <h1>Sales settings</h1>
                            <p>Set the tax rate</p>
                        </template>
                        <b-row>
                            <template v-for="(branchRow, idx) in branches">
                                <b-col md="6" v-if="form.branch_ids.includes(branchRow.id)" v-bind:key="branchRow.id">
                                    <b-form-group :label="branchRow.name" :label-for="branchRow.name">
                                        <b-form-select v-model="form.tax_ids[idx]['tax_id']" :options="taxes">
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
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import {ToggleButton} from "vue-js-toggle-button"
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            ToggleButton,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                form: {
                    category_id: null,
                    brand_id: null,
                    enable_commission: true,
                    supplier_id: null,
                    branch_ids: [],
                    tax_ids: []
                },
                categories: [],
                brands: [],
                suppliers: [],
                branches: [],
                taxes: []
            }
        },
        created: async function () {
            const categoriesPromise = new Promise((resolve) => { this.$http.get("inventory/categories").then(response => resolve(response)) })
            const brandsPromise = new Promise((resolve) => { this.$http.get("inventory/brands").then(response => resolve(response)) })
            const suppliersPromise = new Promise((resolve) => { this.$http.get("inventory/suppliers").then(response => resolve(response)) })
            const branchesPromise = new Promise((resolve) => { this.$http.get("branches").then(response => resolve(response)) })
            const taxesPromise = new Promise((resolve) => { this.$http.get("taxes").then(response => resolve(response)) })
            
            let [categoriesResponse, brandsResponse, suppliersResponse, branchesResponse, taxesResponse] = await Promise.all([categoriesPromise, brandsPromise, suppliersPromise, branchesPromise, taxesPromise])
            
            this.categories = categoriesResponse.data
            this.brands = brandsResponse.data
            this.suppliers = suppliersResponse.data
            this.branches = branchesResponse.data
            this.taxes = taxesResponse.data.map(row => {
                row.value = row.id
                row.text = row.title

                if (row.rate) {
                    row.text += ' - ' + row.rate + '%'
                }

                return row
            })

            this.branches.forEach(branchRow => this.form.tax_ids.push({ branch_id: branchRow.id, tax_id: branchRow.product_tax_id }))
            
            if (this.$route.params.id) {
                const productResponse = await this.$http.get("inventory/products/" + this.$route.params.id + "?with-branches")
                this.form.name = productResponse.data.name
                this.form.sku = productResponse.data.sku
                this.form.category_id = productResponse.data.category_id
                this.form.brand_id = productResponse.data.brand_id
                this.form.barcode = productResponse.data.barcode
                this.form.description = productResponse.data.description
                this.form.retail_price = productResponse.data.retail_price
                this.form.special_price = productResponse.data.special_price
                this.form.enable_commission = productResponse.data.enable_commission == 1
                this.form.supply_price = productResponse.data.supply_price
                this.form.supplier_id = productResponse.data.supplier_id

                if (productResponse.data.branches.length) {
                    productResponse.data.branches.forEach(branchRow => {
                        this.form.branch_ids.push(branchRow.branch_id)
                        const taxRow = this.form.tax_ids.find(taxRow => taxRow.branch_id == branchRow.branch_id)
                        taxRow.tax_id = branchRow.tax_id
                    })
                }
            } else {
                this.branches.forEach(branchRow => this.form.branch_ids.push(branchRow.id))

                if (this.$route.params.category) {
                    this.form.category_id = this.$route.params.category
                }
            }

            this.showLoader = false
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("inventory/products/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("inventory/products", this.form)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "inventory.products"})
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
::v-deep .input-group-text{
        padding-top: 0;
        padding-bottom: 0;
}
</style>