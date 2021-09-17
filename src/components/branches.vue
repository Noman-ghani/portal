<template>
    <overlay :show="showLoader">
        <template v-if="!showLoader">
            <div class="p-4 border-bottom">
                <search-field>
                    <b-form-input autocomplete="off" v-model="searchQuery" placeholder="Search for deals here ..." />
                </search-field>
            </div>
            <div v-if="dealsList.length" class="scrollable">
                <ul class="m-0">
                    <li @click="$emit('selected', dealRow)" v-for="dealRow in dealsList" v-bind:key="dealRow.id" class="p-4 border-top pointer d-flex">
                        <img :src="dealRow.profile_image" :alt="dealRow.name" class="branch-img">
                        <p class="m-0 font-size-17 font-weight-700">{{dealRow.name}}</p>
                    </li>
                </ul>
            </div>
            <no-data class="mt-5 mb-5" v-else>
                <img src="@/assets/images/deals.svg" />
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
        data: function () {
            return {
                showLoader: true,
                searchQuery: null,
                deals: []
            }
        },
        methods: {
            inclusionsPrice: function (deal) {
                let inclusionsPrice = 0
                deal.inclusions.forEach(inclusion => {
                    inclusionsPrice += parseFloat(inclusion.price)
                })
                return inclusionsPrice
            }
        },
        created: function () {
            this.$http.get("branches?with-short-url")
            .then(deals => {
                this.deals = deals.data
                this.showLoader = false
            })
        },
        computed: {
            dealsList: function () {
                if (this.deals.length) {
                    const searchQuery = this.searchQuery
                    if (searchQuery) {
                        return this.deals.filter(dealRow => {
                            return dealRow.name.toLowerCase().includes(searchQuery.toLowerCase())
                        })
                    }

                    return this.deals
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
    .branch-img{
        width: 50px;margin-right: 10px;
    }
</style>