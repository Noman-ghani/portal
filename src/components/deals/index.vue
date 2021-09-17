<template>
    <overlay :show="showLoader" full-height class="centralized">
        <template v-if="!showLoader">
            <heading-with-back title="Deals" description="Create a combination of services and products.">
                <template #right>
                    <router-link :to="{name: 'deals.add'}" class="btn btn-primary">Add Deal</router-link>
                </template>
            </heading-with-back>
            <template v-if="deals.length">
                <div class="location-row">
                    <b-card v-for="deals, idx in deals" v-bind:key="deals.id" @click="$router.push({name: 'deals.edit', params: {id: deals.id}})" no-body :class="{'d-flex location-box': true, 'flex-row': true, 'align-items-center': true, 'pointer': true, 'p-2': true, 'mt-3': idx > 0}">
                        <div class="d-flex align-items-center flex-grow-1">
                            <div class="branch-image">
                                <b-img-lazy :src="deals.profile_image + '?' + new Date().getTime()" width="270" height="160"></b-img-lazy>
                            </div>
                            <div :class="{'d-flex flex-column' : true, 'ml-4' : $screen.width > 992 }">
                                <p class="m-0 mb-2 theme-color font-size-20 font-weight-700 deal-title">{{deals.name}}</p>
                                <p v-for="inclusion, idx in deals.inclusions" v-bind:key="'inclusion-' + idx" class="m-0 sub-color">
                                    <template v-if="inclusion.service_id">- {{inclusion.service.title}} ({{inclusion.quantity}})</template>
                                    <template v-if="inclusion.product_id">- {{inclusion.product.name}} ({{inclusion.quantity}})</template>
                                </p>
                            </div>
                        </div>
                        <b-icon-caret-right-fill class="theme-color mr-3" v-if="$screen.width > 992"></b-icon-caret-right-fill>
                    </b-card>
                </div>
            </template>
            <no-data v-else>
                <img src="@/assets/images/deals.svg" />
                <h2>Add New Deals</h2>
                <p>Make a combination of services and products.</p>
                <router-link :to="{name: 'deals.add'}" class="btn btn-primary w-100 d-block">New Deal</router-link>
            </no-data>
        </template>
    </overlay>
</template>
<script>
    import Overlay from "../helpers/overlay.vue"
    import HeadingWithBack from "../heading-with-back.vue"
    import NoData from "../no-data.vue"

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            NoData
        },
        data: function () {
            return {
                showLoader: true,
                deals: []
            }
        },
        created: function () {
            this.$http.get("deals?with-inclusions")
            .then(deals => {
                this.deals = deals.data
                this.showLoader = false
            })
        },
        methods: {
            totalInclusionsPrice: function (deal) {
                let totalInclusionPrice = 0
                deal.inclusions.forEach(dealRow => {
                    totalInclusionPrice += parseFloat(dealRow.price)
                })
                return totalInclusionPrice
            }
        }
    }
</script>
<style lang="scss" scoped>
@media (max-width: 992px) {
.centralized{
    background-color: #F7F7F8;
}
.location-row{
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    .location-box {
        max-width: 280px;
        flex-wrap: wrap;
        margin: 10px !important;
        & > .d-flex{
            flex-wrap: wrap;
            .branch-image{
                margin-bottom: 10px;
                width: 100%;
                img{
                    width: 100%;
                }
            }
            .deal-title{
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 250px;
                overflow: hidden;
            }
        }
    }
}
}
</style>