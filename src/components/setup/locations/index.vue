<template>
    <div class="centralized">
        <heading-with-back :back-link-to="{name: 'setup.index'}" title="Locations" description="Manage multiple locations for your business.">
            <template #right>
                <router-link class="btn btn-primary" :to="{name: 'setup.locations.add'}">Add Location</router-link>
            </template>
        </heading-with-back>
        <overlay :show="showLoader" full-height-with-heading class="location-row">
            <template v-if="!showLoader">
                <template v-if="branches.length">
                    <b-card v-for="branch, idx in branches" v-bind:key="branch.id" @click="$router.push({name: 'setup.locations.view', params: {id: branch.id}})" no-body :class="{'d-flex location-box': true, 'flex-row': true, 'align-items-center': true, 'pointer': true, 'p-2': true, 'mt-3': idx > 0}">
                        <div class="d-flex align-items-center flex-grow-1">
                            <div class="branch-image">
                                <b-img-lazy v-if="branch.profile_image" :src="branch.profile_image" width="270" height="160"></b-img-lazy>
                                <span v-else>
                                    <svg viewBox="0 0 25 23" xmlns="http://www.w3.org/2000/svg"><path d="M9.75 20.75V15.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v5.25h4.5V12.5a.75.75 0 1 1 1.5 0v9a.75.75 0 0 1-.75.75h-16a.75.75 0 0 1-.75-.75v-9a.75.75 0 1 1 1.5 0v8.25h4.5zm1.5 0h2.5v-4.5h-2.5v4.5zm-1.416-10.5a3.727 3.727 0 0 1-2.669-1.124A3.743 3.743 0 0 1 .75 6.498a.75.75 0 0 1 .107-.384l3-5A.75.75 0 0 1 4.5.75h16a.75.75 0 0 1 .643.364l3 5a.75.75 0 0 1 .107.384 3.742 3.742 0 0 1-6.415 2.628 3.727 3.727 0 0 1-5.335.001 3.727 3.727 0 0 1-2.666 1.123zm-4.91-8L2.259 6.695a2.242 2.242 0 0 0 4.238.816.75.75 0 0 1 1.343.003 2.227 2.227 0 0 0 3.99 0 .75.75 0 0 1 1.343 0 2.227 2.227 0 0 0 3.99 0 .75.75 0 0 1 1.342-.003 2.242 2.242 0 0 0 4.238-.816L20.075 2.25H4.925z"></path></svg>
                                </span>
                            </div>
                            <div :class="{'d-flex flex-column' : true, 'ml-4' : $screen.width > 992 }">
                                <p class="m-0 theme-color font-size-20 font-weight-700">{{branch.name}}</p>
                                <p class="m-0 sub-color font-size-15">{{branch.address}}, {{branch.state.name}}, {{branch.city.name}}</p>
                            </div>
                        </div>
                        <b-icon-caret-right-fill class="theme-color mr-3" v-if="$screen.width > 992"></b-icon-caret-right-fill>
                    </b-card>
                </template>
                <no-data v-else>
                    <img src="@/assets/images/setup.svg" />
                    <h2>Add New Locations</h2>
                    <p>You do not have any locations yet, create a new location.</p>
                    <router-link :to="{name: 'setup.locations.add'}" class="btn btn-primary w-100 d-block">New Location</router-link>
                </no-data>
            </template>
        </overlay>
    </div>
</template>
<script>
    import Overlay from "../../helpers/overlay.vue"
    import NoData from "../../no-data.vue"
    import HeadingWithBack from "../../heading-with-back.vue"

    export default {
        components: {
            Overlay,
            NoData,
            HeadingWithBack
        },
        data: function () {
            return {
                showLoader: true,
                branches: []
            }
        },
        created: async function () {
            const branchesResponse = await this.$http.get("branches?with-state&with-city")
            this.branches = branchesResponse.data
            this.showLoader = false
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
                img{
                    width: 100%;
                }
            }
        }
    }
}
}
</style>