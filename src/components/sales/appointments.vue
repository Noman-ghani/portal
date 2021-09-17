<template>
    <div class="full-centralized">
        <div class="d-flex">
            <div class="d-flex align-items-center form-control w-auto">
                <b-icon-calendar-fill class="mr-3"></b-icon-calendar-fill>
                <date-range-picker @update="fetchData()" control-container-class="" :locale-data="{firstDay: 1, format: 'mmmm dd, yyyy'}" show-dropdowns v-model="form.dateRange"></date-range-picker>
            </div>
        </div>
        <overlay :show="showLoader" full-height-with-heading-and-submenus class="mt-4">
            <template v-if="!showLoader">
                <b-table :fields="appointments.fields" :items="appointments.items" responsive class="app-table">
                    <template #top-row>
                        <b-th colspan="9">Total</b-th>
                        <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{appointments.totals.price | currency}}</b-th>
                    </template>
                    <template #cell(appointment_id)="data">
                        <router-link :to="{name: 'calendar.appointments.view', params: {id: data.item.appointment_id}}">#{{data.item.appointment_id}}</router-link>
                    </template>
                    <template #cell(client_id)="data">
                        <router-link v-if="data.item.appointment.client_id" :to="{name: 'clients.view', params: {id: data.item.appointment.client_id}}">
                            {{data.item.appointment.client.full_name}}
                        </router-link>
                        <span v-else>Walk-In</span>
                    </template>
                    <template #cell(service)="data">
                        {{data.item.service.title}}
                    </template>
                    <template #cell(date)="data">
                        {{$helpers.formatDate(data.item.booking_datetime, "DD MMM YYYY")}}
                    </template>
                    <template #cell(start_time)="data">
                        {{$helpers.formatTime(data.item.start_time)}}
                    </template>
                    <template #cell(end_time)="data">
                        {{$helpers.formatTime(data.item.end_time)}}
                    </template>
                    <template #cell(duration)="data">
                        {{getDuration(data.item.duration)}}
                    </template>
                    <template #cell(branch)="data">
                        {{data.item.appointment.branch.name}}
                    </template>
                    <template #cell(staff)="data">
                        {{data.item.staff ? data.item.staff.full_name : '-'}}
                    </template>
                    <template #cell(status)="data">
                        <b-badge pill class="text-white" :variant="$helpers.appointmentStatusVariants(data.item.appointment.status)">{{data.item.appointment.status | uppercase}}</b-badge>
                    </template>
                    <template #cell(price)="data">
                        {{$store.getters.user.business.country.currency}} {{data.item.price}}
                    </template>
                </b-table>
            </template>
        </overlay>
    </div>
</template>
<script>
    import "@/assets/css/_table.scss"
    import moment from "moment"
    import DateRangePicker from "vue2-daterange-picker"
    import Overlay from "../helpers/overlay.vue"

    export default {
        components: {
            DateRangePicker,
            Overlay
        },
        data: function () {
            return {
                form: {
                    dateRange: {
                        startDate: moment().startOf("month"),
                        endDate: moment().endOf("month")
                    }
                },
                showLoader: true,
                appointments: {
                    fields: [
                        { key: "appointment_id", label: "#" },
                        { key: "client_id", label: "Client" },
                        { key: "service" },
                        { key: "start_time" },
                        { key: "end_time" },
                        { key: "duration" },
                        { key: "branch" },
                        { key: "staff" },
                        { key: "status" },
                        { key: "price", thClass: "text-right", tdClass: "text-right" }
                    ],
                    items: [],
                    totals: {
                        price: 0
                    }
                }
            }
        },
        created: function () {
            this.fetchData()
        },
        methods: {
            fetchData: function () {
                history.pushState({}, null, this.$route.path + '?' + new URLSearchParams(this.query).toString())

                this.showLoader = true
                this.$http.get("appointments", {params: this.form})
                .then(appointments => {
                    this.appointments.items = appointments.data
                    this.appointments.totals = {
                        price: 0
                    }
                    this.appointments.items.forEach(item => {
                        this.appointments.totals.price = parseFloat(this.appointments.totals.price) + parseFloat(item.price)
                    })
                    this.showLoader = false
                })
            },
            getDuration: function (duration) {
                return this.$store.getters.user.settings.durations.filter(row => row.value == duration)[0].text
            }
        },
        computed: {
            query: function () {
                let query = {...this.form}
                query.start_date = moment(query.dateRange.startDate).format("YYYY-MM-DD")
                query.end_date = moment(query.dateRange.endDate).format("YYYY-MM-DD")
                delete query.dateRange
                Object.keys(query).forEach((k) => query[k] == null && delete query[k])

                return query
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .app-table{
    table{
        min-width: 1135px;
    }
}
</style>