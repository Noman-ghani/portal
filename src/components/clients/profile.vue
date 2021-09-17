<template>
    <overlay class="full-centralized" :show="!Object.keys(client).length" full-height>
        <template v-if="Object.keys(client).length">
            <div class="client-wrapper d-flex flex-row">
                <div class="left-side bg-white box-shadow border">
                    <div class="border-bottom p-4">
                        <div class="d-flex flex-column align-items-center">
                            <b-avatar variant="light" :text="client.first_name[0]" size="8rem" class="theme-color"></b-avatar>
                            <p class="m-0 font-size-28 font-weight-800 mt-3">{{client.first_name}} {{client.last_name}}</p>
                        </div>
                        <div class="d-flex mt-4">
                            <dropdown no-caret variant="link" class="client-dropdown">
                                <b-dropdown-item :to="{name: 'clients.edit', params: {id: $route.params.id}}">Edit</b-dropdown-item>
                                <b-dropdown-item v-if="!client.is_blocked" :to="{name: 'clients.block', params: {id: $route.params.id}}">Block</b-dropdown-item>
                                <b-dropdown-item v-else :to="{name: 'clients.unblock', params: {id: $route.params.id}}">Unblock</b-dropdown-item>
                            </dropdown>
                            <dropdown no-caret text="Add New" menu-class="w-100" variant="primary" class="flex-grow-1 ml-4">
                                <b-dropdown-item :to="{name: 'calendar', query: {branch_id: $store.getters.user.business.default_branch_id, client_id: $route.params.id, action: 'booking'}}">New Appointment</b-dropdown-item>
                                <b-dropdown-item :to="{name: 'checkout', query: {branch_id: $store.getters.user.business.default_branch_id, client_id: $route.params.id}}">New Sale</b-dropdown-item>
                            </dropdown>
                        </div>
                    </div>
                    <div class="p-4">
                        <p class="m-0 sub-color">Mobile</p>
                        <p class="m-0 font-size-17">+{{client.phone_country.phone_code}} {{client.phone_number | VMask(client.phone_country.phone_mask)}}</p>
                        <template v-if="client.email">
                            <p class="m-0 sub-color mt-4">Email</p>
                            <p class="m-0 font-size-17">{{client.email}}</p>
                        </template>
                        <template v-if="client.birthday">
                            <p class="m-0 sub-color mt-4">Birthday</p>
                            <p class="m-0 font-size-17">{{$helpers.formatDate(client.birthday, "DD MMMM YYYY")}}</p>
                        </template>
                        <template v-if="client.gender">
                            <p class="m-0 sub-color mt-4">Gender</p>
                            <p class="m-0 font-size-17">{{client.gender | uppercase_first_each}}</p>
                        </template>
                        <template v-if="client.address">
                            <p class="m-0 sub-color mt-4">Address</p>
                            <p class="m-0 font-size-17">{{client.address}}<template v-if="client.suburb">, {{client.suburb}}</template><template v-if="client.zip_code">, {{client.zip_code}}</template></p>
                            <p class="m-0 font-size-17"><template v-if="client.state_id">{{client.state.name}}</template><template v-if="client.city_id">, {{client.city.name}}</template></p>
                        </template>
                    </div>
                </div>
                <div class="right-side flex-grow-1 ml-4">
                    <div class="bg-white border box-shadow">
                        <div class="d-flex border-bottom">
                            <div class="d-flex flex-column flex-basis-50 justify-content-center align-items-center p-4">
                                <p class="m-0 font-size-20 font-weight-800">
                                    {{$store.getters.user.business.country.currency}} {{totalSales}}
                                </p>
                                <p class="m-0 sub-color font-size-15">
                                    Total Sales
                                </p>
                            </div>
                            <div class="d-flex flex-column flex-basis-50 justify-content-center align-items-center p-4 border-left">
                                <p class="m-0 font-size-20 font-weight-800">
                                    {{$store.getters.user.business.country.currency}} {{outstanding}}
                                </p>
                                <p class="m-0 sub-color font-size-15">
                                    Outstanding
                                </p>
                            </div>
                        </div>
                        <div class="d-flex flex-wrap">
                            <div class="d-flex flex-basis-25 align-items-center justify-content-center flex-column p-4">
                                <p class="m-0 font-size-20 font-weight-800">{{allBookings}}</p>
                                <p class="m-0 sub-color font-size-15">All bookings</p>
                            </div>
                            <div class="d-flex flex-basis-25 align-items-center justify-content-center flex-column p-4">
                                <p class="m-0 font-size-20 font-weight-800">{{completed}}</p>
                                <p class="m-0 sub-color font-size-15">Completed</p>
                            </div>
                            <div class="d-flex flex-basis-25 align-items-center justify-content-center flex-column p-4">
                                <p :class="{'m-0': true, 'font-size-20': true, 'font-weight-800': true, 'text-danger': cancelled > 0}">{{cancelled}}</p>
                                <p class="m-0 sub-color font-size-15">Cancelled</p>
                            </div>
                            <div class="d-flex flex-basis-25 align-items-center justify-content-center flex-column p-4">
                                <p :class="{'m-0': true, 'font-size-20': true, 'font-weight-800': true, 'text-danger': noShows > 0}">{{noShows}}</p>
                                <p class="m-0 sub-color font-size-15">No Shows</p>
                            </div>
                        </div>
                    </div>
                    <div class="appointments-box bg-white border box-shadow mt-4">
                        <b-tabs class="pt-2">
                            <b-tab title="Appointments" :active="$route.query.tab === 'appointments'" @click="activeTab = 'appointments'">
                                <client-appointments v-if="activeTab === 'appointments'" :client_id="$route.params.id"></client-appointments>
                            </b-tab>
                            <b-tab title="Products" :active="$route.query.tab === 'products'" @click="activeTab = 'products'">
                                <client-products v-if="activeTab === 'products'" :client_id="$route.params.id"></client-products>
                            </b-tab>
                            <b-tab title="Invoices" :active="$route.query.tab === 'invoices'" @click="activeTab = 'invoices'">
                                <client-invoices  v-if="activeTab === 'invoices'" :client_id="$route.params.id"></client-invoices>
                            </b-tab>
                            <b-tab title="Deals" :active="$route.query.tab === 'deals'" @click="getDeals(); activeTab = 'deals'">
                                <overlay :show="deals.loader">
                                    <template v-if="!deals.loader">
                                        <div v-if="deals.items.length" class="scrollable">
                                            <div v-for="deal in deals.items" v-bind:key="deal.id" class="d-flex flex-grow-1 p-3 border-bottom">
                                                <div class="d-flex flex-column flex-shrink-0">
                                                    <p class="m-0 font-size-17 font-weight-700">{{$helpers.formatDate(deal.created_at, "D")}}</p>
                                                    <p class="m-0 font-size-15">{{$helpers.formatDate(deal.created_at, "MMM")}}</p>
                                                </div>
                                                <div :class="{'d-flex align-items-center flex-grow-1 ml-4' : true, 'flex-wrap': $screen.width < 768}">
                                                    <div :class="{'d-flex flex-column flex-grow-1' : true, 'w-100 font-size-14' : $screen.width < 768 }">
                                                        <p class="m-0 mb-1 font-size-17 font-weight-700">
                                                            {{deal.deal.name}}
                                                            -
                                                            <router-link :to="{name: 'view.invoice', params: {id: deal.invoice.id}}">(Invoice #{{deal.invoice.invoice_number}})</router-link>
                                                        </p>
                                                        <div v-for="items in deal.items" v-bind:key="items.id" class="d-flex flex-column">
                                                            <p class="m-0 mt-1 sub-color font-size-15">
                                                                <template v-if="items.quantity_available > items.quantity_utilized">
                                                                    <template v-if="items.service_id">{{items.service.title}}</template>
                                                                    <template v-if="items.product_id">{{items.product.name}}</template>
                                                                    ({{items.quantity_available - items.quantity_utilized}})
                                                                </template>
                                                                <del v-else>
                                                                    <template v-if="items.service_id">{{items.service.title}}</template>
                                                                    <template v-if="items.product_id">{{items.product.name}}</template>
                                                                    ({{items.quantity_utilized}})
                                                                </del>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p :class="{'m-0 font-size-17 font-weight-700': true, 'w-100 font-size-14' : $screen.width < 768 }">
                                                        {{$store.getters.user.business.country.currency}} {{deal.deal.price | currency}}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <no-data v-else class="p-5">
                                            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="#FBD74C" d="M6 39h36V7H6z" />
                                                <path d="M53.5 32.25a.75.75 0 01.743.648l.007.102v25a.75.75 0 01-.648.743l-.102.007h-36a.75.75 0 01-.743-.648L16.75 58V33a.75.75 0 011.493-.102l.007.102v24.25h34.5V33a.75.75 0 01.648-.743l.102-.007zm-12 3a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75zm-.75 1.5h-10.5v4.5h10.5v-4.5zm14.75-19a2.75 2.75 0 012.75 2.75v6a2.75 2.75 0 01-2.75 2.75h-40a2.75 2.75 0 01-2.75-2.75v-6a2.75 2.75 0 012.75-2.75zm0 1.5h-40c-.69 0-1.25.56-1.25 1.25v6c0 .69.56 1.25 1.25 1.25h40c.69 0 1.25-.56 1.25-1.25v-6c0-.69-.56-1.25-1.25-1.25z" fill="#101928" />
                                            </svg>
                                            <h2>No Deals</h2>
                                            <p>This client has purchased no deals</p>
                                        </no-data>
                                    </template>
                                </overlay>
                            </b-tab>
                        </b-tabs>
                    </div>
                </div>
            </div>
        </template>
    </overlay>
</template>
<script>
    import Overlay from "../helpers/overlay.vue"
    import Dropdown from "../helpers/dropdown.vue"
    import ClientAppointments from "@/components/clients/appointments.vue"
    import ClientProducts from "@/components/clients/products.vue"
    import ClientInvoices from "@/components/clients/invoices.vue"
    import NoData from "../no-data.vue"
    import "@/assets/css/_nav.scss"

    export default {
        components: {
            Overlay,
            Dropdown,
            ClientAppointments,
            ClientProducts,
            ClientInvoices,
            NoData
        },
        data: function () {
            return {
                client: {},
                activeTab: "appointments",
                totalSales: 0,
                outstanding: 0,
                allBookings: 0,
                completed: 0,
                cancelled: 0,
                noShows: 0,
                deals: {
                    loader: false,
                    items: []
                }
            }
        },
        created: function () {
            this.getClient()
        },
        watch: {
            $route: {
                handler: function (route) {
                    if (route.params.reload) {
                        this.getClient()
                    }
                }
            }
        },
        methods: {
            getClient: function () {
                this.$http.get("clients/" + this.$route.params.id + "?with-phone-country&with-state&with-city")
                .then(client => {
                    this.client = client.data
                    this.$http.get("clients/summary/" + this.$route.params.id)
                    .then(summary => {
                        this.totalSales = summary.data.totalSales
                        this.outstanding = summary.data.outstanding
                        this.allBookings = summary.data.allBookings
                        this.completed = summary.data.completed
                        this.cancelled = summary.data.cancelled
                        this.noShows = summary.data.noShows
                    })
                })
                .catch(() => {
                    this.$router.push({name: "clients"})
                })
            },
            getDeals: function () {
                this.deals.loader = true

                this.$http.get("clients/deals/" + this.$route.params.id + "?with-items&with-invoice")
                .then(deals => {
                    this.deals.items = deals.data
                    this.deals.loader = false
                })
            },
            badgeVariant: function (status) {
                if (status === "voided" || status === "refunded") {
                    return "danger"
                } else if (status === "completed") {
                    return "primary"
                }

                return "warning"
            }
        }
    }
</script>
<style scoped lang="scss">
::v-deep .client-table{
    table{
        min-width: 700px;
    }
}
    ::v-deep .client-wrapper {
            @media(max-width:1024px){
                padding-bottom: 80px;
            }
            @media(max-width:980px){
               flex-wrap: wrap;
            }
        .left-side {
            .client-dropdown {
                .btn {
                    color: #000000;
                    padding: 0;
                    box-shadow: none;
                }
            }
            min-width: 400px;
            @media(max-width:980px){
                min-width: 0;
                width: 100%;
            }
        }
        .right-side{
            .flex-basis-25 {
                @media(max-width:1110px){
                    flex-basis: 50%;
                }    
                @media(max-width:1024px){
                    flex-basis: 25%;
                }    
                @media(max-width:620px){
                    flex-basis: 50%;
                }    
            }
            @media(max-width:980px){
                min-width: 0;
                width: 100%;
                margin:25px 0 0 !important;
            }
        }
    }
    ::v-deep .nav-tabs {
        padding-left: 10px;
        @media(max-width:520px){
            flex-wrap: wrap;
            padding: 0;
            li{
                width: 100%;
                a{
                    text-align: left;
                    border-bottom: 2px solid #dfdfdf;
                    margin: 0;
                    padding: 15px;
                }
            }
        }
    }
    .appointments-box {
        height: calc(100vh - 345px);
        @media(max-width:980px){
            height: auto;
        }
    }
    .scrollable {
        overflow-y: scroll;
        height: calc(100vh - 404px);
    }
</style>