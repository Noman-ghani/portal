<template>
    <div class="centralized">
        <heading-with-back>
            <template #right>
                <router-link :to="{name: 'staff.closed-dates.add'}" class="btn btn-primary">New Closed Date</router-link>
            </template>
        </heading-with-back>
        <overlay :show="showLoader" full-height-with-heading-and-submenus>
            <template v-if="!showLoader">
                <b-card v-if="closedDatesList.length" no-body>
                    <b-card-body class="p-0">
                        <router-link v-for="closedDates, idx in closedDatesList" v-bind:key="closedDates.id" :to="{name: 'staff.closed-dates.edit', params: {id: closedDates.id, data: closedDates}}" :class="{'border-top': idx > 0, 'd-flex': true, 'flex-column': true, 'p-4': true, 'theme-color': true}">
                            <div :class="{'d-flex justify-content-between' : true, 'flex-wrap' : $screen.width <= 560 }">
                                <p :class="{'m-0 mb-1 font-size-17 font-weight-700': true, 'w-100 font-size-12' : $screen.width <= 560 }">{{closedDates.description}}</p>
                                <p :class="{'m-0 sub-color' : true, 'w-100 font-size-12' : $screen.width <= 560}">{{$helpers.formatDate(closedDates.starts_at)}} - {{$helpers.formatDate(closedDates.ends_at)}}</p>
                            </div>
                        </router-link>
                    </b-card-body>
                </b-card>
                <no-data v-else>
                    <img src="@/assets/images/staff.svg" />
                    <h2>Closed Dates</h2>
                    <p>List the dates your business is closed for public holidays, maintenance or any other reason. Clients will not be able to place online bookings during these days.</p>
                    <router-link :to="{name: 'staff.closed-dates.add'}" class="btn btn-primary w-100 d-block">New Closed Date</router-link>
                </no-data>
            </template>
            <router-view></router-view>
        </overlay>
    </div>
</template>
<script>
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import NoData from "../../no-data.vue"

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            NoData
        },
        data: function () {
            return {
                showLoader: true,
                closedDatesList: []
            }
        },
        created: function () {
            this.getClosedDatesData()
        },
        watch: {
            $route: {
                handler: function (route) {
                    if (route.params.reload) {
                        this.getClosedDatesData()
                    }
                }
            }
        },
        methods: {
            getClosedDatesData: function () {
                this.showLoader = true
                this.$http.get("staff/closed-dates")
                .then(response => {
                    this.closedDatesList = response.data
                    this.showLoader = false
                })
            }
        }
    }
</script>