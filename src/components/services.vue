<template>
    <overlay :show="showLoader">
        <template v-if="!showLoader">
            <div class="p-4 border-bottom">
                <search-field>
                    <b-form-input autofocus autocomplete="off" v-model="searchQuery" placeholder="Search for services here ..." />
                </search-field>
            </div>
            <div v-if="categoriesList.length" class="scrollable">
                <ul class="m-0">
                    <li @click="selectedCategory = categoryRow" v-for="categoryRow, idx in categoriesList" v-bind:key="'category-' + categoryRow.id" :class="{ 'd-flex': true, 'flex-column': true, 'border-top': idx > 0 }">
                        <template v-if="categoryRow.services.length">
                            <p class="m-0 p-4 font-size-20 font-weight-800">
                                <b-icon-card-list class="mr-2" />
                                {{categoryRow.title}}
                            </p>
                            <ul class="m-0">
                                <template v-for="serviceRow in categoryRow.services">
                                    <template v-if="!groupServicesByPricing">
                                        <li @click="$emit('selected', { 'service': serviceRow, 'pricing': pricingRow })" v-for="pricingRow in serviceRow.pricings" v-bind:key="pricingRow.id" class="p-4 d-flex align-items-center justify-content-between border-top pointer" :style="'border-left: 6px solid ' + categoryRow.color">
                                            <div class="d-flex">
                                                <div class="d-flex flex-column">
                                                    <p class="m-0 font-size-17 font-weight-700">
                                                        {{serviceRow.title}}
                                                    </p>
                                                    <p class="m-0 sub-color">
                                                        <template v-if="pricingRow.name">{{pricingRow.name}} - </template>
                                                        {{$helpers.convertToHoursAndMinutes(pricingRow.duration)}}
                                                    </p>
                                                </div>
                                            </div>
                                            <div v-if="pricingRow.special_price > 0" class="d-flex flex-column text-right">
                                                <p class="m-0 font-size-17 font-weight-700">
                                                    {{$store.getters.user.business.country.currency}} {{pricingRow.special_price | currency}}
                                                </p>
                                                <del class="font-size-17 sub-color">
                                                    {{$store.getters.user.business.country.currency}} {{pricingRow.price | currency}}
                                                </del>
                                            </div>
                                            <p v-else class="m-0 font-size-17 font-weight-700">
                                                {{$store.getters.user.business.country.currency}} {{pricingRow.price | currency}}
                                            </p>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li v-bind:key="serviceRow.id" class="p-4 d-flex align-items-center justify-content-between border-top pointer" :style="'border-left: 6px solid ' + categoryRow.color">
                                            <div class="d-flex">
                                                <b-form-checkbox v-if="showCheckbox" v-model="service_ids" @change="$emit('checkedGroup', $event)" :value="serviceRow.id"></b-form-checkbox>
                                                <div class="d-flex flex-column">
                                                    <p class="m-0 font-size-17 font-weight-700">
                                                        {{serviceRow.title}}
                                                    </p>
                                                    <p class="m-0 sub-color">
                                                        <template v-if="serviceRow.pricings[0].name">{{serviceRow.pricings[0].name}} - </template>
                                                        {{$helpers.convertToHoursAndMinutes(serviceRow.pricings[0].duration)}}
                                                    </p>
                                                </div>
                                            </div>
                                            <template v-if="serviceRow.pricings.length == 1">
                                                <div v-if="serviceRow.pricings[0].special_price > 0" class="d-flex flex-column text-right">
                                                    <p class="m-0 font-size-17 font-weight-700">
                                                        {{$store.getters.user.business.country.currency}} {{serviceRow.pricings[0].special_price | currency}}
                                                    </p>
                                                    <del class="font-size-17 sub-color">
                                                        {{$store.getters.user.business.country.currency}} {{serviceRow.pricings[0].price | currency}}
                                                    </del>
                                                </div>
                                                <p v-else class="m-0 font-size-17 font-weight-700">
                                                    {{$store.getters.user.business.country.currency}} {{serviceRow.pricings[0].price | currency}}
                                                </p>
                                            </template>
                                            <template v-else>
                                                <div class="d-flex flex-column text-right">
                                                    <p class="m-0 sub-color">From</p>
                                                    <p class="m-0 font-size-17 font-weight-700">{{$store.getters.user.business.country.currency}} {{serviceRow.pricings[0].price | currency}}</p>
                                                </div>
                                            </template>
                                        </li>
                                    </template>
                                </template>
                            </ul>
                        </template>
                    </li>
                </ul>
            </div>
            <no-data class="mt-5 mb-5" v-else>
                <img src="@/assets/images/services.svg" />
                <h2>No Results Found</h2>
                <p>We could not find any results based on your search.</p>
            </no-data>
        </template>
    </overlay>
</template>
<script>
    import Overlay from "./helpers/overlay.vue"
    import NoData from "./no-data.vue"
    import SearchField from "./search-field"

    export default {
        components: {
            Overlay,
            NoData,
            SearchField
        },
        props: {
            groupServicesByPricing: {
                type: Boolean,
                default: false
            },
            showCheckbox: {
                type: Boolean,
                default: false
            },
            serviceIds: {
                type: Array,
                default: function () {
                    return []
                }
            },
            urlParams: {}
        },
        data: function () {
            return {
                showLoader: true,
                categories: [],
                selectedCategory: null,
                searchQuery: null,
                service_ids: this.serviceIds
            }
        },
        created: function () {
            this.$http.get("services", {params: this.urlParams})
            .then(categories => {
                this.showLoader = false
                this.categories = categories.data
            })
        },
        computed: {
            categoriesList: function () {
                if (this.categories.length) {
                    const searchQuery = this.searchQuery
                    if (searchQuery) {
                        return this.categories.filter(categoryRow => {
                            if (
                                categoryRow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                categoryRow.services.filter(serviceRow => serviceRow.title.toLowerCase().includes(searchQuery.toLowerCase())).length
                            ) {
                                return true
                            }

                            return false
                        })
                    }

                    return this.categories
                }

                return []
            }
        }
    }
</script>
<style scoped lang="scss">
    .scrollable {
        max-height: calc(100vh - 237px);
        overflow-y: scroll;
    }
</style>