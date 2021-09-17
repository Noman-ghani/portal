<template>
    <div class="centralized">
        <heading-with-back :back-link-to="{name: 'setup.index'}" title="Discounts" description="Set up manual discounts for use during checkout.">
            <template #right>
                <router-link :to="{name: 'setup.discounts.add'}" class="btn btn-primary">New Discount</router-link>
            </template>
        </heading-with-back>
        <overlay :show="discounts.loader" full-height-with-heading>
            <template v-if="!discounts.loader">
                <b-card v-if="discounts.items.length" no-body>
                    <b-card-body class="p-0">
                        <router-link v-for="discount, idx in discounts.items" v-bind:key="discount.id" :to="{name: 'setup.discounts.edit', params: {id: discount.id, data: discount}}" :class="{'border-top': idx > 0, 'd-flex': true, 'flex-column': true, 'p-4': true}">
                            <p class="m-0 font-size-17 font-weight-700 theme-color" v-html="discount.title"></p>
                            <p class="m-0 sub-color" v-if="discount.type === 'percentage'">{{discount.value}}% off</p>
                            <p class="m-0 sub-color" v-else>{{$store.getters.user.business.country.currency}} {{discount.value}} off</p>
                        </router-link>
                    </b-card-body>
                </b-card>
                <no-data v-else>
                    <img src="@/assets/images/setup.svg" />
                    <h2>Add Discounts</h2>
                    <p>Add discounts to apply at checkout. Too easy!</p>
                    <router-link :to="{name: 'setup.discounts.add'}" class="btn btn-primary w-100 d-block">New Discount</router-link>
                </no-data>
            </template>
        </overlay>
        <router-view></router-view>
    </div>
</template>
<script>
    import HeadingWithBack from "../../heading-with-back.vue"
    import Overlay from "../../helpers/overlay"
    import NoData from "../../no-data.vue"

    export default {
        components: {
            Overlay,
            NoData,
            HeadingWithBack
        },
        data: function () {
            return {
                discounts: {
                    items: [],
                    loader: true
                }
            }
        },
        created: function () {
            this.getDiscounts()
        },
        watch: {
            $route: {
                handler: function(route) {
                    if (route.params.reload) {
                        this.getDiscounts()
                    }
                }
            }
        },
        methods: {
            getDiscounts: function () {
                this.discounts.loader = true
                this.$http.get("discounts")
                .then(discounts => {
                    this.discounts.items = discounts.data
                    this.discounts.loader = false
                })
            }
        }
    }
</script>