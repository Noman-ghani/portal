<template>
    <overlay :show="showLoader" full-height>
        <div v-if="!showLoader" class="centralized services">
            <template v-if="services.length">
                <heading-with-back>
                    <template #right>
                        <dropdown variant="primary" right text="Add New">
                            <b-dropdown-item :to="{name: 'services.service.add'}">New Service</b-dropdown-item>
                            <b-dropdown-item :to="{name: 'services.category.add'}">New Category</b-dropdown-item>
                        </dropdown>
                    </template>
                </heading-with-back>
                <div class="service-row mt-5" v-for="category in services" v-bind:key="category.id">
                    <div class="d-flex align-items-center justify-content-between ml-4 mr-4">
                        <h3 class="font-size-24 font-weight-800 mb-4">{{category.title}}</h3>
                        <dropdown variant="transparent" right no-caret class="service-dropdown">
                            <b-dropdown-item :to="{name: 'services.service.add', params: {category : category.id}}">Add New Service</b-dropdown-item>
                            <b-dropdown-item :to="{name: 'services.category.edit', params: {id: category.id, data: category}}">Edit Category</b-dropdown-item>
                        </dropdown>
                    </div>
                    <div v-if="category.services.length" class="bg-white border">
                        <div v-for="service in category.services" v-bind:key="service.id" v-on:click="$router.push({name: service.is_package === 0 ? 'services.service.edit' : 'services.package.edit', params: {id: service.id}})" class="p-4 border-bottom pointer" :style="'border-left:4px solid' + category.color + '!important'">
                            <div class="d-flex" v-if="service.pricings.length == 1">
                                <div class="flex-grow-1">
                                    <p class="m-0 font-size-17 font-weight-700">{{service.title}}</p>
                                    <span class="sub-color" v-if="service.available_for">{{service.available_for}}</span>
                                    <span class="" v-if="service.type === 'package'">{{service.packages.length}} services</span>
                                </div>
                                <div class="flex-grow-0 sub-color font-size-17 min-width text-right">{{getDuration(service.pricings[0].duration)}}</div>
                                <div class="flex-grow-0 sub-color ml-5 font-size-17 min-width text-right">
                                    <del v-if="service.pricings[0].special_price > 0">
                                        {{$store.getters.user.business.country.currency}}
                                        {{service.pricings[0].price | currency}}
                                    </del>
                                </div>
                                <div class="flex-grow-0 ml-5 font-size-17 font-weight-700 min-width text-right">
                                    <template v-if="service.pricings[0].special_price > 0">
                                        {{$store.getters.user.business.country.currency}}
                                        {{service.pricings[0].special_price | currency}}
                                    </template>
                                    <template v-else>
                                        {{$store.getters.user.business.country.currency}}
                                        {{service.pricings[0].price | currency}}
                                    </template>
                                </div>
                            </div>
                            <template v-else>
                                <div class="d-flex flex-column mb-3">
                                    <p class="m-0 font-size-17 font-weight-700">{{service.title}}</p>
                                    <span class="sub-color" v-if="service.available_for">{{service.available_for}}</span>
                                    <span class="sub-color" v-if="service.type === 'package'">{{service.packages.length}} services</span>
                                </div>
                                <div v-for="pricing in service.pricings" v-bind:key="pricing.id" class="d-flex mt-3">
                                    <div class="flex-grow-1 sub-color font-size-17">{{pricing.name}}</div>
                                    <div class="flex-grow-0 sub-color font-size-17 min-width text-right">{{getDuration(pricing.duration)}}</div>
                                    <div class="flex-grow-0 sub-color ml-5 font-size-17 min-width text-right">
                                        <del v-if="pricing.special_price > 0">
                                            {{$store.getters.user.business.country.currency}}
                                            {{pricing.price | currency}}
                                        </del>
                                    </div>
                                    <div class="flex-grow-0 ml-5 font-size-17 font-weight-700 min-width text-right">
                                        <template v-if="pricing.special_price > 0">
                                            {{$store.getters.user.business.country.currency}}
                                            {{pricing.special_price | currency}}
                                        </template>
                                        <template v-else>
                                            {{$store.getters.user.business.country.currency}}
                                            {{pricing.price | currency}}
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
            <no-data v-else>
                <img src="@/assets/images/services.svg" />
                <h2>No Services Set Up</h2>
                <p>You do not have any services yet, create your first group to start filling up your services menu</p>
                <router-link :to="{name: 'services.category.add'}" class="btn btn-primary w-100">Add Category</router-link>
            </no-data>
        </div>
        <router-view></router-view>
    </overlay>
</template>
<script>
    import Overlay from "../helpers/overlay.vue"
    import HeadingWithBack from "../heading-with-back.vue"
    import Dropdown from "../helpers/dropdown.vue"
    import NoData from "../no-data.vue"

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            Dropdown,
            NoData
        },
        data: function () {
            return {
                showLoader: true,
                services : []
            }
        },
        created: function () {
            this.getServices()
        },
        watch: {
            $route: {
                handler: function(route) {
                    if (route.params.reload) {
                        this.getServices()
                    }
                    if (route.params.category) {
                        let categoryRow = this.services.find(category => category.id == route.params.category.id)
                        categoryRow.title = route.params.category.title
                        categoryRow.description = route.params.category.description
                        categoryRow.color = route.params.category.color
                    }
                }
            }
        },
        methods: {
            getServices: function () {
                this.showLoader = true
                this.$http.get("services", {params: {group_by: "category_hierarchy"}})
                .then(services => {
                    this.services = services.data
                    this.showLoader = false
                })
            },
            getDuration: function (duration) {
                return this.$store.getters.user.settings.durations.find(durationRow => durationRow.value == duration).text
            }
        }
    }
</script>
<style lang="scss" scoped>
    .service-row {
        .min-width {
            min-width: 130px;
        }
    }
    ::v-deep .service-dropdown {
        .btn {
            padding: 0;
            box-shadow: none;
        }
    }
</style>