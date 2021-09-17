<template>
    <b-container fluid>
        <overlay :show="showDataLoadingLoader" full-height>
            <template v-if="!showDataLoadingLoader">
                <overlay :show="showSaveInvoiceLoader">
                    <template v-if="showSaveInvoiceLoader" #overlay>
                        <div class="text-center loading-content">
                            <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                            <p class="mt-3 font-weight-bold">Saving your invoice. Please do not close this browser.</p>
                        </div>
                    </template>
                    <b-row>
                        <b-col md="9" class="d-flex left-side p-0">
                            <overlay class="d-flex flex-grow-1" :show="client.showDetails" variant="secondary">
                                <template #overlay>
                                    <div @click="client.showDetails = false" class="bg-white border rounded-circle pointer text-center p-2 click-to-close">
                                        <b-icon-x font-scale="1.5"></b-icon-x>
                                        <p class="m-0 font-size-12 font-weight-600">CLICK TO<br />CLOSE</p>
                                    </div>
                                </template>
                                <div v-if="!invoice.items.length" class="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                                    <b-icon-cart-x font-scale="3"></b-icon-cart-x>
                                    <p class="mt-3 mb-3 font-size-17">Your order is empty. You haven't added any items yet</p>
                                    <b-button variant="primary" @click="$refs['items-modal'].$refs.modal.show()">Add item to sale</b-button>
                                </div>
                                <div v-else class="d-flex align-items-start flex-grow-1 scrollable pt-5">
                                    <div class="wrapper">
                                        <ValidationObserver ref="form">
                                            <b-form autocomplete="off">
                                                <b-card v-for="item, idx in invoice.items" v-bind:key="'item-' + idx" :class="{'mt-5': idx > 0}">
                                                    <b-row>
                                                        <b-col md="7">
                                                            <p class="m-0 font-size-17 font-weight-700">{{item.title}}</p>
                                                            <p class="m-0 mt-1 font-size-15 sub-color" v-html="item.description"></p>
                                                        </b-col>
                                                        <b-col md="4" class="text-right">
                                                            <template v-if="item.client_deal_id">
                                                                <p class="m-0 font-size-17 font-weight-700">
                                                                    {{$store.getters.user.business.country.currency}} {{item.original_price * ( (item.quantity - item.deal_qty) > 0 ? item.quantity - item.deal_qty : 0 ) | currency}}
                                                                </p>
                                                                <del class="sub-color">
                                                                    {{$store.getters.user.business.country.currency}} {{item.original_price * item.quantity | currency}}
                                                                </del>
                                                            </template>
                                                            <template v-else>
                                                                <template v-if="item.special_price > 0">
                                                                    <p class="m-0 font-size-17 font-weight-700">
                                                                        {{$store.getters.user.business.country.currency}} {{item.special_price * item.quantity | currency}}
                                                                    </p>
                                                                    <del class="sub-color">
                                                                        {{$store.getters.user.business.country.currency}} {{item.original_price * item.quantity | currency}}
                                                                    </del>
                                                                </template>
                                                                <template v-else>
                                                                    <p class="m-0 font-size-17 font-weight-700">
                                                                        {{$store.getters.user.business.country.currency}} {{item.original_price * item.quantity | currency}}
                                                                    </p>
                                                                </template>
                                                            </template>
                                                        </b-col>
                                                        <b-col md="1" class="text-right">
                                                            <b-icon-x variant="danger" font-scale="1.5" class="pointer" @click="invoice.items.splice(idx, 1)"></b-icon-x>
                                                        </b-col>
                                                    </b-row>
                                                    <b-row class="mt-3">
                                                        <b-col md="1">
                                                            <b-form-group label="Qty" label-for="qty">
                                                                <b-form-input type="number" @change="calculatePrice(item)" :disabled="['service', 'deal'].includes(item.type)" v-model="item.quantity"></b-form-input>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col md="3">
                                                            <b-form-group label="Price" label-for="price">
                                                                <b-input-group>
                                                                    <template #prepend>
                                                                        <b-input-group-text>{{$store.getters.user.business.country.currency}}</b-input-group-text>
                                                                    </template>
                                                                    <b-form-input type="number" @change="calculatePrice(item)" :disabled="!!item.discount_id || item.type === 'deal' || !!item.client_deal_id" v-model="item.price" :max="item.original_price"></b-form-input>
                                                                </b-input-group>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col md="4">
                                                            <b-form-group label="Staff" label-for="staff">
                                                                <ValidationProvider vid="staff" name="Staff" :rules="{required: true}" v-slot="{errors}">
                                                                    <b-form-select :options="staff" value-field="id" text-field="full_name" v-model="item.staff_id" :class="{'is-invalid': errors[0]}">
                                                                        <template #first>
                                                                            <b-form-select-option :value="null">-- Please Select --</b-form-select-option>
                                                                        </template>
                                                                    </b-form-select>
                                                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                                                </ValidationProvider>
                                                            </b-form-group>
                                                        </b-col>
                                                        <b-col md="4">
                                                            <b-form-group label="Discount" label-for="discount">
                                                                <template v-if="item.type === 'deal'">
                                                                    <b-form-input disabled></b-form-input>
                                                                </template>
                                                                <template v-else>
                                                                    <div v-if="item.original_price > item.price" class="form-control">
                                                                        Manual {{$store.getters.user.business.country.currency}} {{(item.original_price - item.price) | currency}}
                                                                    </div>
                                                                    <b-form-select v-else @change="calculatePrice(item)" :disabled="!!item.client_deal_id" :options="item.discountOptions" value-field="id" v-model="item.discount_id">
                                                                        <template #first>
                                                                            <b-form-select-option :value="null">No discount</b-form-select-option>
                                                                        </template>
                                                                    </b-form-select>
                                                                </template>
                                                            </b-form-group>
                                                        </b-col>
                                                    </b-row>
                                                    <b-form-group v-if="item.dealsOptions.length" label="Select Deal" label-for="deal">
                                                        <b-form-select @change="calculatePrice(item)" :options="item.dealsOptions" v-model="item.client_deal_id">
                                                            <template #first>
                                                                <b-form-select-option :value="null">-- Please Select --</b-form-select-option>
                                                            </template>
                                                        </b-form-select>
                                                    </b-form-group>
                                                </b-card>
                                            </b-form>
                                        </ValidationObserver>
                                        <b-row class="mt-4">
                                            <b-col md="7">
                                                <b-link @click="$refs['items-modal'].$refs.modal.show()" class="font-size-17">
                                                    <b-icon-plus></b-icon-plus>
                                                    Add item to sale
                                                </b-link>
                                            </b-col>
                                            <b-col md="5">
                                                <div class="d-flex justify-content-between font-size-17">
                                                    <p class="m-0">Sub Total</p>
                                                    <p class="m-0">{{$store.getters.user.business.country.currency}} {{subTotal | currency}}</p>
                                                </div>
                                                <div v-for="tax, idx in taxes" v-bind:key="'tax-' + idx" class="d-flex justify-content-between font-size-17">
                                                    <p class="m-0">{{tax.title}} ({{tax.rate}}%)</p>
                                                    <p class="m-0">{{$store.getters.user.business.country.currency}} {{tax.amount | currency}}</p>
                                                </div>
                                                <div v-if="invoice.payment_method_id" class="d-flex justify-content-between border-top mt-3 pt-3">
                                                    <p class="m-0 font-size-17">
                                                        {{paymentMethods.find(paymentMethod => paymentMethod.id == invoice.payment_method_id).title}}
                                                    </p>
                                                    <p class="m-0 font-size-17">{{$store.getters.user.business.country.currency}} {{grandTotal | currency}}</p>
                                                </div>
                                                <div class="d-flex justify-content-between font-size-20 font-weight-700 border-top mt-3 pt-3 pb-3">
                                                    <p class="m-0">Amount Payable</p>
                                                    <p class="m-0">
                                                        {{$store.getters.user.business.country.currency}}
                                                        <template v-if="invoice.payment_method_id">0</template>
                                                        <template v-else>{{grandTotal | currency}}</template>
                                                    </p>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </div>
                            </overlay>
                        </b-col>
                        <b-col md="3" class="right-side bg-white border-left p-0 d-flex flex-column">
                            <div class="d-flex flex-column flex-grow-1">
                                <div v-if="Object.keys(client.data).length" class="d-flex align-items-center p-4 border-bottom">
                                    <b-avatar variant="primary" :text="client.data.first_name[0] + client.data.last_name[0]" size="3.5rem" />
                                    <div class="d-flex align-items-center flex-grow-1 ml-3">
                                        <div class="d-flex flex-column flex-grow-1">
                                            <p class="m-0 font-size-17 font-weight-700">
                                                {{client.data.first_name}} {{client.data.last_name}}
                                            </p>
                                            <p class="mt-1 mb-1 font-size-15 sub-color">+{{client.data.phone_country.phone_code}} {{client.data.phone_number | VMask(client.data.phone_country.phone_mask)}}</p>
                                            <p class="m-0 font-size-15 sub-color">{{client.data.email}}</p>
                                        </div>
                                        <dropdown right no-caret toggle-class="p-0" variant="transparent">
                                            <template #button-content>
                                                <b-icon-list></b-icon-list>
                                            </template>
                                            <b-dropdown-item v-if="!client.showDetails" @click="client.showDetails = true">Show Client Details</b-dropdown-item>
                                            <b-dropdown-item v-else @click="client.showDetails = false">Hide Client Details</b-dropdown-item>
                                            <b-dropdown-item variant="danger" @click="onClientRemoved()">Remove Client</b-dropdown-item>
                                        </dropdown>
                                    </div>
                                </div>
                                <div v-else class="d-flex flex-column align-items-center justify-content-center text-center p-5">
                                    <span class="svg-wrapper wh-50 mb-4">
                                        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                            <g fill="none" fill-rule="evenodd">
                                                <circle fill="#FBD74C" cx="22.5" cy="17.5" r="9.5"></circle>
                                                <g transform="translate(2 2)" stroke="#101928" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                                                    <path d="M34.642 34.642L44.5 44.5"></path>
                                                    <circle cx="20.5" cy="20.5" r="20"></circle>
                                                    <path d="M29.5 30.5h-18v-2.242a3.999 3.999 0 012.866-3.838c1.594-.472 3.738-.92 6.134-.92 2.356 0 4.514.456 6.125.932a4.003 4.003 0 012.875 3.841V30.5z"></path>
                                                    <circle cx="20.5" cy="15.5" r="4.5"></circle>
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                    <p class="mb-4">Click the button below to add a new client, or keep empty to save as walk-in.</p>
                                    <b-link class="btn btn-primary" @click="$refs['clients-modal'].$refs.modal.show()">Add Client</b-link>
                                </div>
                                <div v-if="invoice.items.length && !client.showDetails" class="p-4 border-top">
                                    <b-row v-if="!invoice.payment_method_id">
                                        <b-col md="6" v-for="paymentMethod in paymentMethods" v-bind:key="'payment-method-' + paymentMethod.id" class="pl-2 pr-2 pb-3">
                                            <b-button @click="invoice.payment_method_id = paymentMethod.id" variant="outline-primary" block>{{paymentMethod.title}}</b-button>
                                        </b-col>
                                    </b-row>
                                    <div v-else class="d-flex flex-column text-center mt-4">
                                        <div class="d-flex justify-content-center">
                                            <span class="svg-wrapper wh-50 d-block">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 60"><path d="M27 47c-2.2 0-4-1.8-4-4 0-.6.4-1 1-1s1 .4 1 1c0 1.1.9 2 2 2s2-.9 2-2c0-1.5-2.3-2.2-2.3-2.2-.1 0-3.7-1.1-3.7-4.1 0-2.2 1.8-4 4-4s4 1.8 4 4c0 .6-.4 1-1 1s-1-.4-1-1c0-1.1-.9-2-2-2s-2 .9-2 2c0 1.5 2.3 2.2 2.3 2.2.1 0 3.7 1.1 3.7 4.1 0 2.2-1.8 4-4 4z" class="st0"></path><path d="M27 34.7c-.6 0-1-.4-1-1V32c0-.6.4-1 1-1s1 .4 1 1v1.7c0 .6-.4 1-1 1zM27 49c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1s1 .4 1 1v2c0 .6-.4 1-1 1zM32 20H15c-.6 0-1-.4-1-1s.4-1 1-1h17c.6 0 1 .4 1 1s-.4 1-1 1zM39 20h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zM32 24H15c-.6 0-1-.4-1-1s.4-1 1-1h17c.6 0 1 .4 1 1s-.4 1-1 1zM39 24h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zM32 28H15c-.6 0-1-.4-1-1s.4-1 1-1h17c.6 0 1 .4 1 1s-.4 1-1 1zM39 28h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zM18 12h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zM39 16H15c-.6 0-1-.4-1-1s.4-1 1-1h24c.6 0 1 .4 1 1s-.4 1-1 1zM40 7c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.4-1 1-1 .5 0 1 .4 1 1 0 .5-.5 1-1 1-.6 0-1-.5-1-1zm-4 0c0-.6.4-1 1-1 .5 0 1 .4 1 1 0 .5-.5 1-1 1-.6 0-1-.5-1-1zm-4 0c0-.6.4-1 1-1 .5 0 1 .4 1 1 0 .5-.5 1-1 1-.6 0-1-.5-1-1zM40 53c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.4-1 1-1 .5 0 1 .5 1 1s-.5 1-1 1c-.6 0-1-.5-1-1zm-4 0c0-.5.4-1 1-1 .5 0 1 .5 1 1s-.5 1-1 1c-.6 0-1-.5-1-1zm-4 0c0-.5.4-1 1-1 .5 0 1 .5 1 1s-.5 1-1 1c-.6 0-1-.5-1-1zM1 39c-.2 0-.3 0-.4-.1-.4-.2-.6-.5-.6-.9V5c0-2.8 2.2-5 5-5s5 2.2 5 5v31.5c0 .3-.1.6-.4.8l-2 1.5c-.4.3-.8.3-1.2 0L4 37l-2.4 1.8c-.2.1-.4.2-.6.2zm3-4.2c.2 0 .4.1.6.2L7 36.8l1-.8V5c0-1.7-1.3-3-3-3S2 3.3 2 5v31l1.4-1c.2-.2.4-.2.6-.2zm5 1.7z" class="st0"></path><path d="M45 60c-.2 0-.4-.1-.6-.2L42 58l-2.4 1.8c-.4.3-.8.3-1.2 0L36 58l-2.4 1.8c-.4.3-.8.3-1.2 0L30 58l-2.4 1.8c-.4.3-.8.3-1.2 0L24 58l-2.4 1.8c-.4.3-.8.3-1.2 0L18 58l-2.4 1.8c-.4.3-.8.3-1.2 0L12 58l-2.4 1.8c-.3.2-.7.3-1 .1-.4-.2-.6-.5-.6-.9V5c0-1.7-1.3-3-3-3-.6 0-1-.4-1-1s.4-1 1-1h36c2.8 0 5 2.2 5 5v54c0 .4-.2.7-.6.9-.1.1-.2.1-.4.1zm-9-4.2c.2 0 .4.1.6.2l2.4 1.8 2.4-1.8c.4-.3.8-.3 1.2 0l1.4 1V5c0-1.7-1.3-3-3-3H9c.6.8 1 1.9 1 3v52l1.4-1c.4-.3.8-.3 1.2 0l2.4 1.8 2.4-1.8c.4-.3.8-.3 1.2 0l2.4 1.8 2.4-1.8c.4-.3.8-.3 1.2 0l2.4 1.8 2.4-1.8c.4-.3.8-.3 1.2 0l2.4 1.8 2.4-1.8c.2-.2.4-.2.6-.2z" class="st0"></path></svg>
                                            </span>
                                        </div>
                                        <p class="m-0 mt-3 font-size-17">Full payment has been added</p>
                                        <b-button variant="primary" class="mt-5 mb-3" @click="saveInvoice()">Complete Sale</b-button>
                                        <b-link @click="invoice.payment_method_id = null">
                                            <b-icon-arrow-left></b-icon-arrow-left>
                                            Back to payments
                                        </b-link>
                                    </div>
                                </div>
                                <b-tabs v-if="client.showDetails">
                                    <b-tab @click="currentTab = 'appointments'" title="Appointments">
                                        <div class="scrollable">
                                            <client-appointments v-if="currentTab == 'appointments'" :client_id="client.data.id"></client-appointments>
                                        </div>
                                    </b-tab>
                                    <b-tab @click="currentTab = 'products'" title="Products">
                                        <div class="scrollable">
                                            <client-products v-if="currentTab == 'products'" :client_id="client.data.id"></client-products>
                                        </div>
                                    </b-tab>
                                    <b-tab @click="currentTab = 'invoices'" title="Invoices">
                                        <div class="scrollable">
                                            <client-invoices v-if="currentTab == 'invoices'" :client_id="client.data.id"></client-invoices>
                                        </div>
                                    </b-tab>
                                </b-tabs>
                            </div>
                            <div v-if="!client.showDetails && !invoice.payment_method_id" class="p-3 border-top">
                                <dropdown dropup block text="More Options" class="box-shadow with-border" menu-class="w-100" variant="outline-transparent" :disabled="!invoice.items.length">
                                    <b-dropdown-item v-if="isUnpaidInvoiceAllowed" @click="saveInvoice()">Save Unpaid</b-dropdown-item>
                                    <b-dropdown-item @click="$refs['invoice-details-modal'].show()">Invoice Details</b-dropdown-item>
                                </dropdown>
                            </div>
                        </b-col>
                    </b-row>
                    <items-modal ref="items-modal" :branch-id="$route.query.branch_id" @selected="onItemSelected($event)"></items-modal>
                    <clients-modal ref="clients-modal" @selected="onClientSelected($event)"></clients-modal>
                    <b-modal ref="invoice-details-modal" title="Invoice Details" no-close-on-esc no-close-on-backdrop ok-only ok-title="Save">
                        <b-form-group label="Payment received by" label-for="payment-received-by">
                            <b-form-select :options="staff" value-field="id" text-field="full_name" v-model="invoice.payment_received_by"></b-form-select>
                        </b-form-group>
                        <b-form-group label="Invoice notes" label-for="invoice-notes">
                            <b-form-textarea  v-model="invoice.notes"></b-form-textarea>
                        </b-form-group>
                    </b-modal>
                </overlay>
            </template>
        </overlay>
    </b-container>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import Overlay from "../helpers/overlay.vue"
    import Dropdown from "../helpers/dropdown.vue"
    import ItemsModal from "../items-modal.vue"
    import ClientsModal from "../clients-modal.vue"
    import ClientAppointments from "../clients/appointments.vue"
    import ClientProducts from "../clients/products.vue"
    import ClientInvoices from "../clients/invoices.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            Overlay,
            Dropdown,
            ItemsModal,
            ClientsModal,
            ClientAppointments,
            ClientProducts,
            ClientInvoices
        },
        data: function () {
            return {
                staff: [],
                discounts: [],
                paymentMethods: [],
                invoice: {
                    items: [],
                    payment_method_id: null,
                    payment_received_by: this.$store.getters.user.staff.id,
                    notes: null
                },
                client: {
                    data: {},
                    showDetails: false
                },
                showDataLoadingLoader: true,
                showSaveInvoiceLoader: false,
                currentTab: "appointments"
            }
        },
        created: async function () {
            const staffPromise = new Promise((resolve) => { this.$http.get("staff?branch_ids=" + this.$route.query.branch_id).then(response => resolve(response)) })
            const discountsPromise = new Promise((resolve) => { this.$http.get("discounts").then(response => resolve(response)) })
            const paymentMethodsPromise = new Promise((resolve) => { this.$http.get("utilities/payment-methods/" + this.$store.getters.user.business.country_id + "?for_portal").then(response => resolve(response)) })

            let [staffResponse, discountsResponse, paymentMethodsResponse] = await Promise.all([staffPromise, discountsPromise, paymentMethodsPromise])
            
            this.staff = staffResponse.data
            this.discounts = discountsResponse.data.map(discountTypeRow => {
                discountTypeRow.text = discountTypeRow.title + ' ('
                if (discountTypeRow.type === "percentage") {
                    discountTypeRow.text += discountTypeRow.value + '%'
                } else if (discountTypeRow.type === "amount") {
                    discountTypeRow.text += this.$store.getters.user.business.country.currency + ' ' + discountTypeRow.value
                }
                discountTypeRow.text += ')'

                return discountTypeRow
            })

            this.paymentMethods = paymentMethodsResponse.data

            if (this.$route.query.appointment_id) {
                const appointmentResponse = await this.$http.get("appointments/" + this.$route.query.appointment_id + "?with-items&with-client")
                
                if (appointmentResponse.data.invoice_id) {
                    this.$helpers.showToast("info", "An invoice for this appointment has already been generated")
                    this.$router.push({name: "calendar.appointments.view", params: {id: this.$route.query.appointment_id}})
                }
                
                await appointmentResponse.data.items.forEach(item => {
                    if (item.service_id) {
                        this.onItemSelected({
                            type: "service",
                            data: {
                                service: {
                                    id: item.service_id,
                                    title: item.service.title
                                },
                                pricing: {
                                    duration: item.duration,
                                    price: item.price,
                                    special_price: 0
                                }
                            }
                        })
                    }
                })
                
                this.client.data = appointmentResponse.data.client ?? {}
            }
            
            this.showDataLoadingLoader = false
        },
        computed: {
            isUnpaidInvoiceAllowed: function () {
                return !this.invoice.items.filter(item => item.type === "deal").length
            },
            taxes: function () {
                let taxes = []
                this.invoice.items.forEach(cartRow => {
                    cartRow.taxes.forEach(taxRow => {
                        const taxLine = taxes.find(row => row.id == taxRow.id)
                        const price = cartRow.special_price > 0 ? cartRow.special_price : cartRow.original_price
                        let quantity = cartRow.quantity
                        if (cartRow.client_deal_id) {
                            const dealRow = cartRow.dealsOptions.find(dealRow => dealRow.id == cartRow.client_deal_id)
                            quantity -= dealRow.quantity
                        }
                        if (quantity > 0) {
                            const taxAmount = this.$helpers.calculateTax(taxRow.rate, price * quantity)
                            
                            if (quantity > 0) {
                                if (!taxLine) {
                                    taxes.push({id: taxRow.id, title: taxRow.title, rate: taxRow.rate, amount: taxAmount})
                                } else {
                                    taxLine.amount += taxAmount
                                }
                            }
                        }
                    })
                })
                return taxes
            },
            grossTotal: function () {
                let grossTotal = 0
                this.invoice.items.forEach(cartRow => {
                    const price = cartRow.original_price
                    let quantity = cartRow.quantity
                    if (cartRow.client_deal_id) {
                        const dealRow = cartRow.dealsOptions.find(deal => deal.id = cartRow.client_deal_id)
                        quantity -= dealRow.quantity
                    }
                    grossTotal += parseFloat(price * quantity)
                })
                return grossTotal
            },
            subTotal: function () {
                let subTotal = 0
                this.invoice.items.forEach(cartRow => {
                    const price = cartRow.special_price > 0 ? cartRow.special_price : cartRow.original_price
                    let quantity = cartRow.quantity
                    if (cartRow.client_deal_id) {
                        const dealRow = cartRow.dealsOptions.find(deal => deal.id = cartRow.client_deal_id)
                        quantity -= dealRow.quantity
                    }
                    subTotal += parseFloat(price * quantity)
                })

                if (this.$store.getters.user.business.is_tax_inclusive) {
                    subTotal -= this.taxTotal
                }

                return subTotal
            },
            taxTotal: function () {
                let taxTotal = 0
                this.taxes.forEach(taxRow => {
                    taxTotal += taxRow.amount
                })
                return taxTotal
            },
            grandTotal: function () {
                return this.subTotal + this.taxTotal
            }
        },
        methods: {
            calculatePrice: function (item) {
                item.special_price = 0
                item.deal_qty = 0
                if (item.client_deal_id) {
                    item.discount_id = null
                    const dealRow = item.dealsOptions.find(dealRow => dealRow.id == item.client_deal_id)
                    item.deal_qty = dealRow.quantity
                } else if (item.discount_id) {
                    const discountOption = item.discountOptions.find(discountRow => discountRow.id == item.discount_id)
                    if (discountOption.type === "amount") {
                        item.special_price = parseFloat(item.price - discountOption.value)
                    } else if (discountOption.type === "percentage") {
                        item.special_price = item.price * ((100 - discountOption.value) / 100)
                    }
                } else if (item.original_price > item.price) {
                    item.special_price = item.price
                }
                item.price = parseFloat(item.price).toFixed(2)
                item.original_price = parseFloat(item.original_price).toFixed(2)
                item.special_price = parseFloat(item.special_price).toFixed(2)
            },
            onProductSelected: async function (item) {
                let title = item.title
                let description = item.description
                let price = item.price
                let special_price = item.special_price
                let taxResponse = await this.$http.get("taxes/get_by_product?branch_id=" + this.$route.query.branch_id + "&product_id=" + item.id)
                let taxData = taxResponse.data.tax
                let taxes = []

                if (taxData) {
                    if (taxData.rate) {
                        taxes.push({ id: taxData.id, title: taxData.title, rate: taxData.rate })
                    } else {
                        if (taxData.tax_1) {
                            taxes.push({ id: taxData.tax_1.id, title: taxData.tax_1.title, rate: taxData.tax_1.rate })
                        }
                        if (taxData.tax_2) {
                            taxes.push({ id: taxData.tax_2.id, title: taxData.tax_2.title, rate: taxData.tax_2.rate })
                        }
                        if (taxData.tax_3) {
                            taxes.push({ id: taxData.tax_3.id, title: taxData.tax_3.title, rate: taxData.tax_3.rate })
                        }
                    }
                }
                
                if (taxResponse.data) {
                    description = taxResponse.data.stock_on_hand + " in stock"
                }

                let discount_id = null
                let discountOptions = []

                if (special_price > 0) {
                    const discountPrice = price - special_price
                    discount_id = "special"
                    
                    discountOptions.push({
                        id: discount_id,
                        type: "amount",
                        value: discountPrice,
                        text: "Special discount " + this.$store.getters.user.business.country.currency + ' (' + this.$helpers.formatAsCurrency(discountPrice) + ')'
                    })
                }
                
                discountOptions = discountOptions.concat(this.discounts.filter(discountTypeRow => discountTypeRow.enable_for_product))

                const invoiceItem = {
                    type: "product",
                    id: item.id,
                    title: title,
                    description: description,
                    quantity: 1,
                    original_price: price,
                    price: price,
                    special_price: 0,
                    staff_id: this.$route.query.staff_id ?? this.$store.getters.user.staff.id,
                    taxes: taxes,
                    discount_id: discount_id,
                    discountOptions: discountOptions,
                    client_deal_id: null,
                    dealsOptions: []
                }
                
                this.calculatePrice(invoiceItem)
                this.invoice.items.push(invoiceItem)
            },
            onServiceSelected: async function (item) {
                let title = item.title
                let description = this.$helpers.convertToHoursAndMinutes(item.duration)
                let price = item.price
                let special_price = item.special_price
                let taxResponse = await this.$http.get("taxes/get_by_service?branch_id=" + this.$route.query.branch_id + "&service_id=" + item.id)
                let taxData = taxResponse.data.tax
                let taxes = []

                if (taxData) {
                    if (taxData.rate) {
                        taxes.push({ id: taxData.id, title: taxData.title, rate: taxData.rate })
                    } else {
                        if (taxData.tax_1) {
                            taxes.push({ id: taxData.tax_1.id, title: taxData.tax_1.title, rate: taxData.tax_1.rate })
                        }
                        if (taxData.tax_2) {
                            taxes.push({ id: taxData.tax_2.id, title: taxData.tax_2.title, rate: taxData.tax_2.rate })
                        }
                        if (taxData.tax_3) {
                            taxes.push({ id: taxData.tax_3.id, title: taxData.tax_3.title, rate: taxData.tax_3.rate })
                        }
                    }
                }

                let discount_id = null
                let discountOptions = []

                if (special_price > 0) {
                    const discountPrice = price - special_price
                    discount_id = "special"
                    
                    discountOptions.push({
                        id: discount_id,
                        type: "amount",
                        value: discountPrice,
                        text: "Special discount " + this.$store.getters.user.business.country.currency + ' (' + this.$helpers.formatAsCurrency(discountPrice) + ')'
                    })
                }
                
                discountOptions = discountOptions.concat(this.discounts.filter(discountTypeRow => discountTypeRow.enable_for_service))

                const invoiceItem = {
                    type: "service",
                    id: item.id,
                    title: title,
                    description: description,
                    quantity: 1,
                    original_price: price,
                    price: price,
                    special_price: 0,
                    staff_id: this.$route.query.staff_id ?? this.$store.getters.user.staff.id,
                    taxes: taxes,
                    discount_id: discount_id,
                    discountOptions: discountOptions,
                    client_deal_id: null,
                    dealsOptions: []
                }

                this.calculatePrice(invoiceItem)
                this.invoice.items.push(invoiceItem)
            },
            onDealSelected: async function (item) {
                let title = item.name
                let description = ""
                let price = item.price
                let taxes = []
                
                item.inclusions.forEach(async inclusion => {
                    let taxResponse = null
                    if (inclusion.service_id) {
                        description += inclusion.service.title + " - (" + inclusion.quantity + ")<br />"
                        taxResponse = await this.$http.get("taxes/get_by_service?branch_id=" + this.$route.query.branch_id + "&service_id=" + inclusion.service_id)
                    } else if (inclusion.product_id) {
                        description += inclusion.product.name + " - (" + inclusion.quantity + ")<br />"
                        taxResponse = await this.$http.get("taxes/get_by_product?branch_id=" + this.$route.query.branch_id + "&product_id=" + inclusion.product_id)
                    }
                    let taxData = taxResponse.data.tax
                    if (taxData) {
                        if (taxData.rate) {
                            taxes.push({ id: taxData.id, title: taxData.title, rate: taxData.rate })
                        } else {
                            if (taxData.tax_1) {
                                taxes.push({ id: taxData.tax_1.id, title: taxData.tax_1.title, rate: taxData.tax_1.rate })
                            }
                            if (taxData.tax_2) {
                                taxes.push({ id: taxData.tax_2.id, title: taxData.tax_2.title, rate: taxData.tax_2.rate })
                            }
                            if (taxData.tax_3) {
                                taxes.push({ id: taxData.tax_3.id, title: taxData.tax_3.title, rate: taxData.tax_3.rate })
                            }
                        }
                    }
                })
                
                const invoiceItem = {
                    type: "deal",
                    id: item.id,
                    title: title,
                    description: description,
                    quantity: 1,
                    original_price: price,
                    price: price,
                    special_price: 0,
                    staff_id: this.$route.query.staff_id ?? this.$store.getters.user.staff.id,
                    taxes: taxes,
                    discount_id: null,
                    discountOptions: [],
                    client_deal_id: null,
                    dealsOptions: []
                }

                this.calculatePrice(invoiceItem)
                this.invoice.items.push(invoiceItem)
            },
            onItemSelected: async function (item) {
                if (item.type === "product") {
                    await this.onProductSelected({
                        id: item.data.id,
                        title: item.data.name,
                        description: null,
                        price: item.data.retail_price,
                        special_price: item.data.special_price
                    })
                } else if (item.type === "service") {
                    await this.onServiceSelected({
                        id: item.data.service.id,
                        title: item.data.service.title,
                        description: this.$helpers.convertToHoursAndMinutes(item.data.pricing.duration),
                        price: item.data.pricing.price,
                        special_price: item.data.pricing.special_price
                    })
                } else if (item.type === "deal") {
                    await this.onDealSelected(item.data)
                }

                if (Object.keys(this.client.data).length) {
                    this.invoice.items.map(invoiceItem => {
                        invoiceItem.dealsOptions = []
                        if (invoiceItem.type === "service") {
                            this.client.data.deals.filter(dealRow => {
                                const item = dealRow.items.find(dealItem => dealItem.service_id == invoiceItem.id)
                                if (item) {
                                    invoiceItem.dealsOptions.push({
                                        value: dealRow.id,
                                        text: dealRow.deal.name,
                                        quantity: item.quantity_available
                                    })
                                }
                            })
                        } else if (invoiceItem.type === "product") {
                            this.client.data.deals.filter(dealRow => {
                                const item = dealRow.items.find(dealItem => dealItem.product_id == invoiceItem.id)
                                if (item) {
                                    invoiceItem.dealsOptions.push({
                                        value: dealRow.id,
                                        text: dealRow.deal.name,
                                        quantity: item.quantity_available
                                    })
                                }
                            })
                        }
                        return invoiceItem
                    })
                }

                this.$refs["items-modal"].$refs.modal.hide()
            },
            onClientSelected: function ($event) {
                this.client.data = $event;
                this.$refs['clients-modal'].$refs.modal.hide()

                if (this.invoice.items.length && this.client.data.deals.length) {
                    this.invoice.items.map(invoiceItem => {
                        invoiceItem.dealsOptions = []
                        if (invoiceItem.type === "service") {
                            this.client.data.deals.filter(dealRow => {
                                const item = dealRow.items.find(dealItem => dealItem.service_id == invoiceItem.id)
                                if (item) {
                                    invoiceItem.dealsOptions.push({
                                        value: dealRow.id,
                                        text: dealRow.deal.name,
                                        quantity: item.quantity_available
                                    })
                                }
                            })
                        } else if (invoiceItem.type === "product") {
                            this.client.data.deals.filter(dealRow => {
                                const item = dealRow.items.find(dealItem => dealItem.product_id == invoiceItem.id)
                                if (item) {
                                    invoiceItem.dealsOptions.push({
                                        value: dealRow.id,
                                        text: dealRow.deal.name,
                                        quantity: item.quantity_available
                                    })
                                }
                            })
                        }
                        return invoiceItem
                    })
                }
            },
            onClientRemoved: function () {
                this.client.data = {}
                this.client.showDetails = false
                this.invoice.items.map(item => {
                    item.dealsOptions = []
                    item.client_deal_id = null
                    this.calculatePrice(item)
                    return item
                })
            },
            saveInvoice: function () {
                // client and payment method is mandatory if there is any deal in our cart
                if (this.invoice.items.filter(item => item.type === "deal").length) {
                    if (!Object.keys(this.client.data).length) {
                        this.$helpers.showToast("danger", "Please select a client")
                        return
                    }
                }

                const invoiceData = Object.assign(this.invoice, {
                    branch_id: this.$route.query.branch_id,
                    grosstotal: this.grossTotal,
                    subtotal: this.subTotal,
                    tax: this.taxTotal,
                    grandtotal: this.grandTotal,
                    client_id: this.client.data.id,
                    status: this.invoice.payment_method_id ? "completed" : "unpaid",
                    appointment_id: this.$route.query.appointment_id
                })

                for (let i = 0; i < invoiceData.items.length; i++) {
                    if (invoiceData.items[i].client_deal_id) {
                        const dealRow = invoiceData.items[i].dealsOptions.find(dealRow => dealRow.id == invoiceData.items[i].client_deal_id)
                        if (invoiceData.items[i].quantity > dealRow.quantity) {
                            this.$helpers.showToast("danger", "Deal quantity exceeded")
                            return
                        }
                    }
                }

                invoiceData.items.map(invoiceRow => {
                    invoiceRow.discounts = []
                    if (invoiceRow.discount_id) {
                        invoiceRow.discounts.push(invoiceRow["discountOptions"].find(discountRow => discountRow.id == invoiceRow.discount_id))

                        if (invoiceRow.discount_id === "special") {
                            invoiceRow.discounts.find(discountRow => discountRow.id === "special").text = "Special Discount"
                        }
                    } else if (invoiceRow.price < invoiceRow.original_price) {
                        invoiceRow.discounts.push({
                            id: "manual",
                            type: "amount",
                            value: invoiceRow.original_price - invoiceRow.price,
                            text: "Manual Discount"
                        })
                    }

                    if (invoiceRow.client_deal_id) {
                        invoiceRow.taxes = []
                    }

                    invoiceRow.taxes.forEach(taxRow => {
                        const price = invoiceRow.special_price > 0 ? invoiceRow.special_price : invoiceRow.original_price
                        taxRow.amount = (price * taxRow.rate) / 100
                    })

                    return invoiceRow
                })

                this.showSaveInvoiceLoader = true
                this.$http.post("invoices", invoiceData)
                .then(response => {
                    this.showSaveInvoiceLoader = false
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$router.push({name: "view.invoice", params: {id: response.data.invoice_id}})
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    @media (min-width: 992px) {
        .left-side {
            .scrollable {
                height: calc(100vh - 71px);
                overflow-y: scroll;
                .wrapper {
                    width: 80%;
                    margin: 0 auto;
                }
            }
            @media (min-width: 768px) {
                flex: 0 0 70%;
                max-width: 70%;
            }
        }
        .right-side {
            height: calc(100vh - 71px);
            .scrollable {
                overflow-y: scroll;
                height: calc(100vh - 246px);
            }
            @media (min-width: 768px) {
                flex: 0 0 30%;
                max-width: 30%;
            }
        }
    }
    .click-to-close {
        &:hover {
            .bi-x {
                transition: transform 150ms ease;
                transform: rotate(-180deg);
            }
        }
    }
    .bi-x,
    .bi-list {
        transition: transform 150ms ease;
        &:hover {
            transform: rotate(-180deg);
        }
    }
</style>