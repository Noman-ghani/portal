<template>
    <overlay :show="showLoader">
        <template v-if="!showLoader">
            <overlay :show="showDataLoader">
                <template #overlay>
                    <div class="text-center loading-content">
                        <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                        <p class="mt-3 font-weight-bold">Fetching details. Please do not close this browser.</p>
                    </div>
                </template>
                <div class="bg-white border rounded payment-methods mt-4">
                    <div @click="loadPaymentMethodDetails(paymentMethod)" v-for="paymentMethod, idx in paymentMethods" v-bind:key="'payment-method-' + idx" class="payment-method-row pointer">
                        <b-img-lazy :src="paymentMethod.image"></b-img-lazy>
                    </div>
                </div>
                <template v-if="Object.keys(selectedPaymentMethod).length">
                    <template v-if="selectedPaymentMethod.title.toLowerCase() === 'keenu'">
                        <ValidationObserver ref="form" v-slot="{handleSubmit}">
                            <b-form @submit.prevent="handleSubmit(onKeenuSubmit)" autocomplete="off">
                                <b-modal ref="keenu-select-banks-modal" no-close-on-esc no-close-on-backdrop title="Select Bank">
                                    <ValidationProvider vid="select-bank" name="Select Bank" :rules="{required: true}" v-slot="{errors}">
                                        <b-form-select @change="onKeenuSelectBank()" :options="keenu.banksOptions" v-model="keenu.formParams.bank_id" value-field="BankId" text-field="BankName" :class="{'is-invalid': errors[0]}">
                                            <template #first>
                                                <b-form-select-option :value="null">Please Select</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </ValidationProvider>
                                    <template #modal-footer>
                                        <submit-button :disabled="!keenu.formParams.checksum" @click.native="onKeenuSubmit()" ref="keenu-submit-button" type="submit" class="ml-auto">Proceed to Payment</submit-button>
                                    </template>
                                </b-modal>
                            </b-form>
                        </ValidationObserver>
                        <b-form ref="keenu-submit-form" :action="keenu.formParams.action" method="post">
                            <input type="hidden" name="Merchant_ID" :value="keenu.formParams.merchant_id" />
                            <input type="hidden" name="Client_ID" :value="keenu.formParams.client_id" />
                            <input type="hidden" name="Order_No" :value="keenu.formParams.order_id" />
                            <input type="hidden" name="Order_Amount" :value="keenu.formParams.amount" />
                            <input type="hidden" name="Date" :value="keenu.formParams.date" />
                            <input type="hidden" name="Time" :value="keenu.formParams.time" />
                            <input type="hidden" name="Checksum" :value="keenu.formParams.checksum" />
                            <input type="hidden" name="Transaction_Desc" value="order test" />
                            <input type="hidden" name="Bank_ID" :value="keenu.formParams.bank_id" />
                        </b-form>
                    </template>
                </template>
            </overlay>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "@/plugins/vee-validate"
    import Overlay from "@/components/helpers/overlay.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        props: {
            amount: {
                default: 0
            },
            orderReference: {
                default: 0
            },
            orderType: {
                default: ''
            }
        },
        components: {
            Overlay,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                showDataLoader: false,
                paymentMethods: [],
                selectedPaymentMethod: {},
                selectedIndex: -1,
                keenu: {
                    banksOptions: [],
                    formParams: {
                        action: null,
                        merchant_id: null,
                        client_id: null,
                        order_id: null,
                        amount: null,
                        date: null,
                        time: null,
                        checksum: null,
                        bank_id: null
                    }
                }
            }
        },
        created: function () {
            this.$http.get("utilities/payment-methods/" + this.$store.getters.user.business.country_id)
            .then(response => {
                this.paymentMethods = response.data
                this.showLoader = false
            })
        },
        methods: {
            loadPaymentMethodDetails: function (paymentMethod) {
                this.selectedPaymentMethod = paymentMethod
                if (paymentMethod.title.toLowerCase() === "easypaisa") {
                    this.$http.get("pay/easypaisa/url", {
                        params: {
                            amount: this.amount,
                            order_id: this.orderReference + this.$store.getters.user.business.id,
                            order_type: this.orderType
                        }
                    })
                    .then(response => {
                        window.location.href = response.data
                    })
                } else if (paymentMethod.title.toLowerCase() === "keenu") {
                    this.showDataLoader = true
                    this.$http.get("pay/keenu/banks")
                    .then(response => {
                        this.keenu.banksOptions = response.data
                        this.$refs["keenu-select-banks-modal"].show()
                        this.showDataLoader = false
                    })
                }
            },
            onKeenuSelectBank: function () {
                this.$http.get("pay/keenu/generate-secured-hash", {params: {
                    amount: this.amount,
                    order_id: this.orderReference + this.$store.getters.user.business.id,
                    bank_id: this.keenu.formParams.bank_id
                }})
                .then(response => {
                    this.keenu.formParams.action = response.data.action
                    this.keenu.formParams.merchant_id = response.data.merchant_id
                    this.keenu.formParams.client_id = response.data.client_id
                    this.keenu.formParams.order_id = this.orderReference + this.$store.getters.user.business.id
                    this.keenu.formParams.amount = this.amount
                    this.keenu.formParams.date = response.data.date
                    this.keenu.formParams.time = response.data.time
                    this.keenu.formParams.checksum = response.data.checksum
                })
            },
            onKeenuSubmit: function () {
                this.$refs["keenu-submit-button"].displayLoader = true
                this.$refs['keenu-submit-form'].submit()
            }
        }
    }
</script>