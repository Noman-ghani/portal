<template>
    <overlay :show="showLoader" full-height class="centralized">
        <template v-if="!showLoader">
            <heading-with-back :back-link-to="{name: 'deals.index'}">
                <template #title>
                    {{$route.params.id ? "Edit Deal" : "Add Deal"}}
                </template>
                <template v-if="$route.params.id" #right>
                    <b-button v-if="form.shorturl.url" variant="primary" @click="$helpers.copyToClipboard(form.shorturl.url)" v-b-tooltip.hover title="Copy URL to clipboard">
                        <b-icon-link></b-icon-link> Short URL
                    </b-button>
                    <b-link class="btn btn-primary ml-3" target="_blank" :href="form.servu_url">View on ServU</b-link>
                </template>
            </heading-with-back>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                    <b-card>
                        <template #header>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h2>Basic Info</h2>
                                    <p>Add a deal name</p>
                                </div>
                            </div>
                        </template>
                        <b-row>
                            <b-col md="4" :class="{'pr-0' : $screen.width > 768}">
                                <div class="border rounded profile_image d-flex justify-content-center align-items-center" style="height: 197px;">
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
                                <ValidationProvider vid="name" name="Deal name" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Deal name *" label-for="name">
                                        <b-form-input v-model="form.name" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                                <ValidationProvider vid="description" name="Deal description" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Deal description *" label-for="description">
                                        <b-form-textarea v-model="form.description" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h1>Deal Validity</h1>
                            <p>Select a range in which the deal can be purchased</p>
                        </template>
                        <b-row>
                            <b-col md="6">
                                <ValidationProvider vid="available_from_date" name="Deal available from" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Deal available from *" label-for="available_from_date">
                                        <b-form-datepicker v-model="form.available_from" label-help="" hide-header></b-form-datepicker>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="6">
                                <ValidationProvider vid="available_until" name="Deal available until" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Deal available until *" label-for="available_until">
                                        <b-form-datepicker v-model="form.available_until" label-help="" hide-header></b-form-datepicker>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card v-if="!$route.params.id" class="mt-5">
                        <template #header>
                            <h1>Inclusions</h1>
                            <p>Add services/products for this deal.</p>
                        </template>
                        <template v-if="form.inclusions.length">
                            <b-row v-for="inclusion, idx in form.inclusions" v-bind:key="'inclusion-' + idx">
                                <b-col md="8">
                                    <p class="m-0 font-size-17 font-weight-700">
                                        {{inclusion.title}}
                                    </p>
                                </b-col>
                                <b-col md="1">
                                    <p class="m-0 font-weight-700 text-right">
                                        <b-form-input type="number" v-model="inclusion.quantity" />
                                    </p>
                                </b-col>
                                <b-col md="3">
                                    <p class="m-0 font-weight-700 text-right">
                                        {{$store.getters.user.business.country.currency}} {{inclusion.price | currency}}
                                    </p>
                                </b-col>
                            </b-row>
                            <b-row class="pt-3 mt-4 pb-3 mb-4 border-top border-bottom">
                                <b-col md="9"></b-col>
                                <b-col md="3">
                                    <p class="m-0 font-size-18 font-weight-800 text-right">
                                        {{$store.getters.user.business.country.currency}}  {{inclusionsTotalPrice | currency}}
                                    </p>
                                </b-col>
                            </b-row>
                        </template>
                        <b-link @click="$refs['items-modal'].$refs.modal.show()" class="btn btn-primary">
                            <b-icon-plus-circle-fill class="mr-2" />
                            Add Service/Product
                        </b-link>
                    </b-card>
                    <b-card no-body class="mt-5" header-class="border-0">
                        <template #header>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex flex-column">
                                    <h1>Active Deal</h1>
                                    <p>Activate this deal on marketplace</p>
                                </div>
                                <toggle-button v-model="form.is_active" color="#0C56C9" :height="30" :width="50" :sync="true" class="m-0" />
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
                            <h1>Deal Limits and Price</h1>
                        </template>
                        <b-row>
                            <b-col md="3">
                                <ValidationProvider vid="code" name="Deal code" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Deal code *" label-for="code">
                                        <b-form-input v-model="form.code" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="3">
                                <ValidationProvider vid="expires_in_days" name="Expires (in days)" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Expires (in days) *" label-for="expires_in_days">
                                        <b-form-select :options="expiresInDaysOptions" v-model="form.expires_in_days" :class="{'is-invalid': errors[0]}"></b-form-select>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="3">
                                <ValidationProvider vid="limit" name="Deal limit" v-slot="{errors}">
                                    <b-form-group label="Deal limit" label-for="limit">
                                        <b-form-input v-model="form.limit" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="3">
                                <ValidationProvider vid="price" name="Deal price" :rules="{required: true, max_value: !$route.params.id && inclusionsTotalPrice - 1}" v-slot="{errors}">
                                    <b-form-group label="Deal price *" label-for="price">
                                        <b-form-input v-model="form.price" :class="{'is-invalid': errors[0]}" :disabled="!form.inclusions.length || !!$route.params.id" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card class="mt-5">
                        <template #header>
                            <h1>Location</h1>
                            <p>Choose the location where the deal is applicable.</p>
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
                            <h1>Tax</h1>
                            <p>Select the tax applicable at checkout</p>
                        </template>
                        <b-row>
                            <b-col md="6">
                                <b-form-select v-model="form.tax_id" :options="taxes" value-field="id">
                                    <template #first>
                                        <b-form-select-option :value="null">Default: No Tax</b-form-select-option>
                                    </template>
                                </b-form-select>
                            </b-col>
                        </b-row>
                    </b-card>
                    <div class="mt-4 d-flex">
                        <submit-button type="submit" ref="submit-button" :disabled="invalid" class="ml-auto"></submit-button>
                    </div>
                </b-form>
            </ValidationObserver>
            <items-modal ref="items-modal" :items="['Services', 'Products']" v-on:selected="onItemSelected($event)"></items-modal>
            <b-modal ref="profile-photo-modal" no-close-on-esc no-close-on-backdrop title="Resize / Crop Image" ok-only ok-title="Apply" @ok="onCroppedOrResized($event)">
                <clipper-basic :src="profileImageURL" ref="clipper"></clipper-basic>
            </b-modal>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import VueRx from "vue-rx"
    import VuejsClipper from "vuejs-clipper"
    import {ToggleButton} from "vue-js-toggle-button"
    import moment from "moment"
    import Overlay from "../helpers/overlay.vue"
    import HeadingWithBack from "../heading-with-back.vue"
    import ItemsModal from "../items-modal"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)
    Vue.use(VueRx)
    Vue.use(VuejsClipper)

    export default {
        components: {
            ToggleButton,
            Overlay,
            HeadingWithBack,
            ItemsModal,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                form: {
                    profile_image: null,
                    available_from: moment().startOf("month").format("YYYY-MM-DD"),
                    available_until: moment().endOf("month").format("YYYY-MM-DD"),
                    expires_in_days: 365,
                    tax_id: null,
                    is_active: true,
                    enable_commission: true,
                    inclusions: [],
                    branch_ids: []
                },
                expiresInDaysOptions: [
                    {value: 15, text: "15 Days"},
                    {value: 30, text: "30 Days"},
                    {value: 60, text: "60 Days"},
                    {value: 90, text: "90 Days"},
                    {value: 120, text: "120 Days"},
                    {value: 240, text: "240 Days"},
                    {value: 365, text: "365 Days"}
                ],
                branches: [],
                taxes: [],
                profileImageURL: null
            }
        },
        created: async function () {
            const branchesPromise = new Promise((resolve) => { this.$http.get("branches").then(response => resolve(response)) })
            const taxesPromise = new Promise((resolve) => { this.$http.get("taxes").then(response => resolve(response)) })
            
            let [branchesResponse, taxesResponse] = await Promise.all([branchesPromise, taxesPromise])
            this.branches = branchesResponse.data
            this.taxes = taxesResponse.data.map(tax => {
                tax.text = tax.title + ' - ' + tax.rate + '%'
                return tax
            })

            if (this.$route.params.id) {                
                const deal = await this.$http.get("deals/" + this.$route.params.id + "?with-inclusions&with-branches")
                this.form.profile_image = deal.data.profile_image
                this.form.name = deal.data.name
                this.form.description = deal.data.description
                this.form.limit = deal.data.limit
                this.form.price = deal.data.price
                this.form.tax_id = deal.data.tax_id
                this.form.code = deal.data.code
                this.form.available_from = this.$helpers.formatDateTime(deal.data.available_from, "YYYY-MM-DD")
                this.form.available_until = this.$helpers.formatDateTime(deal.data.available_until, "YYYY-MM-DD")
                this.form.is_active = deal.data.is_active == 1
                this.form.enable_commission = deal.data.enable_commission == 1
                this.form.servu_url = deal.data.servu_url
                this.form.shorturl = deal.data.shorturl

                deal.data.inclusions.forEach(inclusionRow => {
                    let id = null
                    let title = null
                    let price = 0

                    if (inclusionRow.type === "service") {
                        id = inclusionRow.service.id,
                        title = inclusionRow.service.title
                    } else if (inclusionRow.type === "product") {
                        id = inclusionRow.product.id
                        title = inclusionRow.product.name
                    }
                    
                    this.form.inclusions.push({
                        id: id,
                        type: inclusionRow.type,
                        title: title,
                        price: price,
                        quantity: inclusionRow.quantity
                    })
                })

                deal.data.branches.forEach(branchRow => {this.form.branch_ids.push(branchRow.branch_id)})
            } else {
                this.branches.forEach(branchRow => this.form.branch_ids.push(branchRow.id))
            }

            this.showLoader = false
        },
        computed: {
            inclusionsTotalPrice: function () {
                let price = 0
                
                if (this.form.inclusions.length) {
                    this.form.inclusions.forEach(inclusionRow => {
                        price += parseFloat(inclusionRow.price) * inclusionRow.quantity
                    })
                }

                return price
            }
        },
        methods: {
            onItemSelected: function (item) {
                let id = null
                let title = null
                let price = 0

                if (item.type === "service") {
                    id = item.data.service.id,
                    title = item.data.service.title
                    price = item.data.pricing.price
                } else if (item.type === "product") {
                    id = item.data.id
                    title = item.data.name
                    price = item.data.retail_price
                }

                this.form.inclusions.push({
                    id: id,
                    type: item.type,
                    title: title,
                    price: price,
                    quantity: 1
                })

                this.$refs["items-modal"].$refs.modal.hide()
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
                if (!this.form.inclusions.length) {
                    this.$helpers.showToast("danger", "You must include atleast 1 inclusion")
                    return
                }

                if (this.form.inclusions.length === 1 && this.form.inclusions[0].quantity <= 1) {
                    this.$helpers.showToast("danger", "Quantity should be greater than or equal to 1")
                    return
                }

                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("deals/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("deals", this.form)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "deals.index", params: {reload: true}})
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