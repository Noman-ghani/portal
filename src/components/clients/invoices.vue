<template>
    <overlay :show="showLoader">
        <template v-if="!showLoader">
            <template v-if="invoices.length">
                <div v-for="invoice in invoices" v-bind:key="invoice.id" class="d-flex flex-grow-1 justify-content-between align-items-center p-4 border-bottom">
                    <div>
                        <p class="m-0 font-size-15 sub-color">{{$helpers.formatDate(invoice.created_at, "ddd DD MMM, YYYY")}}</p>
                        <router-link :to="{name: 'view.invoice', params: {id: invoice.id}}" class="mt-1 mb-1 d-inline-block">
                            {{invoice.invoice_number}}
                        </router-link>
                        <p class="m-0 font-size-17 sub-color">{{invoice.branch.name}}</p>
                    </div>
                    <p class="m-0 font-size-17 font-weight-700">{{$store.getters.user.business.country.currency}} {{invoice.grandtotal | currency}}</p>
                </div>
            </template>
            <no-data v-else class="p-5">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FBD74C" d="M6 39h36V7H6z" />
                    <path d="M53.5 32.25a.75.75 0 01.743.648l.007.102v25a.75.75 0 01-.648.743l-.102.007h-36a.75.75 0 01-.743-.648L16.75 58V33a.75.75 0 011.493-.102l.007.102v24.25h34.5V33a.75.75 0 01.648-.743l.102-.007zm-12 3a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75zm-.75 1.5h-10.5v4.5h10.5v-4.5zm14.75-19a2.75 2.75 0 012.75 2.75v6a2.75 2.75 0 01-2.75 2.75h-40a2.75 2.75 0 01-2.75-2.75v-6a2.75 2.75 0 012.75-2.75zm0 1.5h-40c-.69 0-1.25.56-1.25 1.25v6c0 .69.56 1.25 1.25 1.25h40c.69 0 1.25-.56 1.25-1.25v-6c0-.69-.56-1.25-1.25-1.25z" fill="#101928" />
                </svg>
                <h2>No Sales History</h2>
                <p>Use the checkout feature to create a new sale for this client</p>
            </no-data>
        </template>
    </overlay>
</template>
<script>
    import Overlay from "../overlay"
    import NoData from "../no-data.vue"

    export default {
        components: {
            Overlay,
            NoData
        },
        props: {
            client_id: {
                required: true
            }
        },
        data: function () {
            return {
                showLoader: true,
                invoices: []
            }
        },
        created: function () {
            this.$http.get("invoices?client_id=" + this.client_id)
            .then(invoices => {
                this.invoices = invoices.data
                this.showLoader = false
            })
        }
    }
</script>