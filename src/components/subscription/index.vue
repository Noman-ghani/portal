<template>
    <overlay :show="showLoader" full-height>
        <template v-if="!showLoader">
            <div class="centralized">
                <b-card-group v-if="$route.name === 'subscription.index'">
                    <b-card v-for="subscriptionPackage, idx in subscriptionPackages" v-bind:key="'subscription-package-' + idx">
                        <p class="m-0 text-center font-size-48 font-weight-700">{{subscriptionPackage.title}}</p>
                        <div class="font-size-20 font-weight-400 text-center pb-2">
                            <small>{{$store.getters.user.business.country.currency}}</small>
                            <span class="font-size-20 font-weight-700 mx-1">{{subscriptionPackage.price}}</span>
                            <span>/mo</span>
                        </div>
                        <p class="m-0 text-center font-size-14">Prices are exclusive of taxes</p>
                        <ul class="font-size-14 font-weight-300 border-top mt-3 pt-3">
                            <li :class="{'mt-3': idx > 0}" v-for="option, idx in subscriptionPackage.options" v-bind:key="'subscription-option-' + idx">
                                <b-icon-check2 v-if="option.is_available" variant="success" class="mr-1"></b-icon-check2>
                                <b-icon-x v-else variant="danger" class="mr-1"></b-icon-x>
                                {{option.title}}
                            </li>
                        </ul>
                        <div class="text-center mt-4 mb-2">
                            <b-button @click="selectedSubscriptionPackage = subscriptionPackage" variant="primary" style="min-width: 75%">Select Plan</b-button>
                        </div>
                    </b-card>
                </b-card-group>
                <payment-methods
                    v-if="Object.keys(selectedSubscriptionPackage).length"
                    :amount="selectedSubscriptionPackage.price"
                    :order-reference="selectedSubscriptionPackage.order_reference"
                    order-type="subscription-portal"
                ></payment-methods>
            </div>
        </template>
    </overlay>
</template>
<script>
    import Overlay from "@/components/helpers/overlay.vue"
    import PaymentMethods from "@/components/helpers/payment-methods.vue"

    export default {
        components: {
            Overlay,
            PaymentMethods
        },
        data: function () {
            return {
                showLoader: true,
                subscriptionPackages: [],
                selectedSubscriptionPackage: {}
            }
        },
        created: function () {
            this.$http.get("utilities/subscription-packages")
            .then(response => {
                this.subscriptionPackages = response.data
                this.showLoader = false
            })
        }
    }
</script>