<template>
    <div class="centralized">
        <overlay :show="showLoader" full-height-with-heading>
            <template v-if="!showLoader">
                <template v-if="branches.length">
                    <heading-with-back :back-link-to="{name: 'setup.index'}" title="Invoice Sequencing" description="Set custom prefixes and number sequence for invoices"></heading-with-back>
                    <b-card no-body>
                        <b-card-body class="p-0">
                            <router-link :class="{'d-block': true, 'p-3': true, 'border-top': idx > 0}" v-for="(branch, idx) in branches" v-bind:key="branch.id" :to="{name: 'setup.invoice-sequencing.edit', params: {id: branch.id, data: branch}}">
                                <p class="m-0 theme-color font-size-17 font-weight-700">{{branch.name}}</p>
                                <p class="m-0 sub-color font-size-15 mt-2">Invoice Prefix: {{branch.invoice_prefix ? branch.invoice_prefix : '-'}}</p>
                                <p class="m-0 sub-color font-size-15 mt-2">Next Invoice Number: {{branch.next_invoice_number}}</p>
                            </router-link>
                        </b-card-body>
                    </b-card>
                </template>
                <no-data v-else>
                    <img src="@/assets/images/setup.svg" />
                    <h2>No locations</h2>
                    <p>You do not have any locations added. Add your location to setup your invoice sequencing</p>
                    <router-link :to="{name: 'setup.locations.add'}" class="btn btn-primary w-100 d-block">Add Location</router-link>
                </no-data>
            </template>
        </overlay>
        <router-view v-if="$route.name !== 'setup.invoice-sequencing'"></router-view>
    </div>
</template>
<script>
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import NoData from "../../no-data.vue"

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            NoData
        },
        data: function () {
            return {
                showLoader: true,
                branches: []
            }
        },
        created: function () {
            this.getBranches()
        },
        watch: {
            $route: {
                handler: function (route) {
                    if (route.params.reload) {
                        this.getBranches()
                    }
                }
            }
        },
        methods: {
            getBranches: function () {
                this.showLoader = true
                this.$http.get("branches")
                .then(branches => {
                    this.branches = branches.data
                    this.showLoader = false
                })
            }
        }
    }
</script>