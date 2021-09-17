<template>
    <overlay :show="showLoader">
        <template v-if="!showLoader">
            <template v-if="appointments.length">
                <div v-b-tooltip.hover title="Click to view appointment" @click="$router.push({name: 'calendar.appointments.view', params: {id: appointment.id}})" v-for="appointment in appointments" v-bind:key="appointment.id" class="d-flex flex-grow-1 p-3 border-bottom pointer hover-effect">
                    <div class="d-flex flex-column align-items-center flex-shrink-0">
                        <p class="m-0 font-size-17 font-weight-700">{{$helpers.formatDate(appointment.booking_date, "D")}}</p>
                        <p class="m-0 font-size-15">{{$helpers.formatDate(appointment.booking_date, "MMM")}}</p>
                    </div>
                    <div class="d-flex align-items-center flex-grow-1 ml-3">
                        <div class="d-flex flex-grow-1 flex-column flex-grow-1">
                            <div v-for="items, idx in appointment.items" v-bind:key="items.id" class="d-flex flex-column">
                                <div class="d-flex" v-if="idx < 1">
                                    <p class="m-0 sub-color font-size-15">{{$helpers.formatTime(items.start_time)}}</p>
                                    <p :class="'m-0 font-size-10 ml-3 mt-1 text-' + $helpers.appointmentStatusVariants(appointment.status)">{{appointment.status | uppercase}}</p>
                                </div>
                                <div class="d-flex mt-2 mb-2">
                                    <p class="m-0 font-size-16 font-weight-700" style="width: 60%">
                                        {{items.service.title}}
                                    </p>
                                    <p class="m-0 font-size-16 font-weight-700 text-right" style="width: 40%">
                                        {{$store.getters.user.business.country.currency}} {{getAppointmentPricing(appointment.items) | currency}}
                                    </p>
                                </div>
                                <p class="m-0 sub-color font-size-15">
                                    {{getDuration(items.duration)}} with {{items.staff.first_name}} {{items.staff.last_name}}
                                </p>
                            </div>
                            <p v-if="appointment.notes" class="m-0 mt-4 font-size-15 font-italic">{{appointment.notes}}</p>
                        </div>
                    </div>
                </div>
            </template>
            <no-data v-else class="p-5">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FBD74C" d="M6 57h36V25H6z" />
                    <path d="M47.5 6.25a.75.75 0 01.743.648L48.25 7v3.25h7.25a2.75 2.75 0 012.745 2.582l.005.168v34a2.75 2.75 0 01-2.75 2.75h-40A2.75 2.75 0 0112.75 47V13a2.75 2.75 0 012.75-2.75h7.25V7a.75.75 0 011.493-.102L24.25 7v3.25h22.5V7a.75.75 0 01.75-.75zm9.25 15.5h-42.5V47c0 .647.492 1.18 1.122 1.244l.128.006h40c.69 0 1.25-.56 1.25-1.25V21.75zM25.5 38.25a.75.75 0 01.743.648l.007.102v2a.75.75 0 01-.648.743l-.102.007h-4a.75.75 0 01-.743-.648L20.75 41v-2a.75.75 0 01.648-.743l.102-.007h4zm12 0a.75.75 0 01.743.648l.007.102v2a.75.75 0 01-.648.743l-.102.007h-4a.75.75 0 01-.743-.648L32.75 41v-2a.75.75 0 01.648-.743l.102-.007h4zm-12.75 1.5h-2.5v.5h2.5v-.5zm.75-11.5a.75.75 0 01.743.648l.007.102v2a.75.75 0 01-.648.743l-.102.007h-4a.75.75 0 01-.743-.648L20.75 31v-2a.75.75 0 01.648-.743l.102-.007h4zm12 0a.75.75 0 01.743.648l.007.102v2a.75.75 0 01-.648.743l-.102.007h-4a.75.75 0 01-.743-.648L32.75 31v-2a.75.75 0 01.648-.743l.102-.007h4zm12 0a.75.75 0 01.743.648l.007.102v2a.75.75 0 01-.648.743l-.102.007h-4a.75.75 0 01-.743-.648L44.75 31v-2a.75.75 0 01.648-.743l.102-.007h4zm-24.75 1.5h-2.5v.5h2.5v-.5zm12 0h-2.5v.5h2.5v-.5zm12 0h-2.5v.5h2.5v-.5zm6.75-18h-7.25V13a.75.75 0 01-1.493.102L46.75 13v-1.25h-22.5V13a.75.75 0 01-1.493.102L22.75 13v-1.25H15.5a1.25 1.25 0 00-1.244 1.122L14.25 13v7.25h42.5V13a1.25 1.25 0 00-1.122-1.244l-.128-.006z" fill="#101928" />
                </svg>
                <h2>No Appointments</h2>
                <p>This client has no upcoming or past appointments</p>
            </no-data>
        </template>
    </overlay>
</template>
<script>
    import Overlay from "../overlay"
    import NoData from "../no-data.vue"

    export default {
        components: {
            Overlay,
            NoData
        },
        props: {
            client_id: {
                required: true
            }
        },
        data: function () {
            return {
                showLoader: true,
                appointments: []
            }
        },
        created: function () {
            this.$http.get("clients/appointments/"+ this.client_id)
            .then(appointments => {
                this.appointments = appointments.data
                this.showLoader = false
            })
        },
        methods: {
            getAppointmentPricing: function (items) {
                let price = 0

                items.forEach(item => {
                    price += parseFloat(item.price)
                })

                return price
            },
            getDuration: function (duration) {
                return this.$store.getters.user.settings.durations.find(row => row.value == duration).text
            }
        }
    }
</script>