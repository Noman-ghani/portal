<template>
    <div class="centralized">
        <heading-with-back :back-link-to="{name: 'setup.index'}" title="Taxes" description="Add your tax rates and use groups for multiple taxes, for example combining city and state taxes">
            <template #right>
                <dropdown right text="Add New" variant="primary" v-if="taxes.length">
                    <b-dropdown-item :to="{name: 'setup.taxes.tax.add'}">New Tax</b-dropdown-item>
                    <b-dropdown-item :to="{name: 'setup.taxes.group.add'}">New Tax Group</b-dropdown-item>
                </dropdown>
            </template>
        </heading-with-back>
        <b-card class="mb-4 tax-setting">
            <div class="d-flex flex-row">
                <b-icon icon="bell" font-scale="1.5" />
                <div class="ml-3">
                    <h6 class="font-weight-bold">
                        Tax Calculation
                    </h6>
                    <p class="m-0">Your retail prices are <span>{{$store.getters.user.business.is_tax_inclusive == '1' ? 'including' : 'excluding'}}</span> taxes. <router-link :to="{name: 'setup.taxes.tax-calculations'}">Change this setting</router-link></p>
                </div>
            </div>
        </b-card>
        <overlay :show="showLoader" full-height-with-heading>
            <template v-if="!showLoader">
                <b-card v-if="taxes.length" no-body>
                    <template #header>
                        <h2>Tax Rates</h2>
                    </template>
                    <b-card-body class="p-0">
                        <router-link v-for="tax, idx in taxes" v-bind:key="tax.id" :to="{name: tax.rate ? 'setup.taxes.tax.edit': 'setup.taxes.group.edit', params: {id: tax.id}}" :class="{'border-top': idx > 0, 'd-flex': true, 'flex-column': true, 'p-4': true, 'theme-color': true}">
                            <p class="m-0 mb-1 font-size-17 font-weight-700">{{tax.title}}</p>
                            <p class="m-0 sub-color" v-if="isFloat(tax.rate) || isInteger(tax.rate)">{{tax.rate}}%</p>
                            <p class="m-0 sub-color" v-if="tax.tax_1" v-html="getTaxRateById(tax.tax_1)"></p>
                            <p class="m-0 sub-color" v-if="tax.tax_2" v-html="getTaxRateById(tax.tax_2)"></p>
                            <p class="m-0 sub-color" v-if="tax.tax_3" v-html="getTaxRateById(tax.tax_3)"></p>
                        </router-link>
                    </b-card-body>
                </b-card>
                <no-data v-else>
                    <img src="@/assets/images/setup.svg" />
                    <h2>Add New Taxes</h2>
                    <p>Add your tax rates and use groups for multiple taxes, for example combining city and state taxes.</p>
                    <router-link :to="{name: 'setup.taxes.tax.add'}" class="btn btn-primary w-100 d-block">New Tax</router-link>
                </no-data>
            </template>
            <template v-if="taxes.length && branches.length">
                <b-card class="mt-5" no-body>
                    <template #header>
                        <h2>Tax Defaults</h2>
                        <p>Setup the default taxes for your business, you can still override defaults in the settings of individual products and services</p>
                    </template>
                    <b-card-body class="p-0">
                        <router-link :to="{name: 'setup.taxes.default.edit', params: {id: branch.id, branch: branch, taxes: taxes}}" v-for="branch, idx in branches" v-bind:key="branch.id" :class="{'border-top': idx > 0, 'd-flex': true, 'flex-column': true, 'p-4': true, 'theme-color': true}">
                            <p class="m-0 font-size-17 font-weight-700">{{branch.name}}</p>
                            <div class="m-0 sub-color d-flex">
                                <div class="pr-2">
                                    Products Default: {{branch.product_tax_id ? getTaxRateById(branch.product_tax_id) : 'No tax'}}
                                </div>
                                .
                                <div class="pl-2">
                                    Services Default: {{branch.service_tax_id ? getTaxRateById(branch.service_tax_id) : 'No tax'}}
                                </div>
                            </div>
                        </router-link>
                    </b-card-body>
                </b-card>
            </template>
        </overlay>
        <router-view></router-view>
    </div>
</template>
<script>
    import Overlay from "../../helpers/overlay.vue"
    import NoData from "../../no-data.vue"
    import Dropdown from "../../helpers/dropdown.vue"
    import HeadingWithBack from "../../heading-with-back.vue"

    export default {
        components: {
            Overlay,
            NoData,
            Dropdown,
            HeadingWithBack
        },
        data: function () {
            return {
                showLoader: true,
                taxes: [],
                branches: []
            }
        },
        created: function () {
            this.getTaxes()
        },
        watch: {
            $route: {
                handler: function (route) {
                    if (route.params.reload) {
                        this.getTaxes()
                    }
                }
            }
        },
        methods: {
            getTaxes: async function () {
                this.showLoader = true
                
                const taxesResponse = await this.$http.get("taxes")
                this.taxes = taxesResponse.data

                const branchesResponse = await this.$http.get("branches")
                this.branches = branchesResponse.data

                this.showLoader = false
            },
            isFloat: function (n) {
                return n === +n && n !== (n|0)
            },
            isInteger: function (n) {
                return n === +n && n === (n|0)
            },
            getTaxRateById: function (id) {
                return this.taxes.find((row) => row.id == id).title
            }
        }
    }
</script>
<style lang="scss" scoped>
    .tax-setting {
        background: #e5f1ff;
        box-shadow: 0 4px 12px 0 rgb(43 114 189 / 20%);
    }
</style>