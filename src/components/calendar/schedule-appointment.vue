<template>
    <b-container fluid>
        <overlay :show="showLoader || isSubmitted" full-height>
            <template #overlay v-if="isSubmitted">
                <div class="text-center loading-content">
                    <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                    <p class="mt-3 font-weight-bold">Saving your appointment. Please do not close this browser.</p>
                </div>
            </template>
            <template v-if="!showLoader">
                <b-row>
                    <b-col md="9" :class="{'left-side' : true, 'p-0' : $screen.width > 992}">
                        <div :class="{'scrollable pt-5' : true, 'pb-5 mb-3' : $screen.width <= 1024}">
                            <div class="appointments-wrapper">
                                <p class="m-0 mb-3 font-size-24 font-weight-700 date-txt">{{$helpers.formatDate(appointment.bookingDate)}}</p>
                                <ValidationObserver ref="form">
                                    <b-form autocomplete="off">
                                        <b-card v-for="appointment, idx in appointment.items" v-bind:key="idx" :class="{ 'mt-5': idx > 0, 'p-1': true, 'position-relative': true }">
                                            <div @click="removeService(idx)" class="bg-white rounded-circle position-absolute pointer" style="top: -10px; right: -10px;" v-if="idx > 0">
                                                <b-icon-x variant="danger" font-scale="1.5"></b-icon-x>
                                            </div>
                                            <b-row>
                                                <b-col md="3">
                                                    <ValidationProvider vid="start_time" name="Start time" :rules="{required: true}" v-slot="{errors}">
                                                        <b-form-group label="Start time" label-for="start_time">
                                                            <b-form-select v-model="appointment.start_time" :options="$helpers.getTimeSlots()" :class="{'is-invalid': errors[0]}">
                                                                <template #first>
                                                                    <b-form-select-option :value="null">Please Select</b-form-select-option>
                                                                </template>
                                                            </b-form-select>
                                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                                        </b-form-group>
                                                    </ValidationProvider>
                                                </b-col>
                                                <b-col md="9">
                                                    <ValidationProvider vid="service" name="Service" :rules="{required: true}" v-slot="{errors}">
                                                        <b-form-group label="Service" label-for="service">
                                                            <b-form-input :value="appointment.service_id ? appointment.title + ' (' + $helpers.convertToHoursAndMinutes(appointment.duration) + ', ' + $store.getters.user.business.country.currency + ' ' + appointment.price + ')' : ''" placeholder="Click to Select Service" readonly @click="currentIndex = idx; openItemsModal(idx)" :class="{'is-invalid': errors[0], 'pointer': true}" />
                                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                                        </b-form-group>
                                                    </ValidationProvider>
                                                </b-col>
                                                <b-col md="3">
                                                    <ValidationProvider vid="duration" name="Duration" :rules="{required: true}" v-slot="{errors}">
                                                        <b-form-group label="Duration" label-for="duration">
                                                            <b-form-select v-model="appointment.duration" :options="$store.getters.user.settings.durations" :disabled="!appointment.service_id" :class="{'is-invalid': errors[0]}"></b-form-select>
                                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                                        </b-form-group>
                                                    </ValidationProvider>
                                                </b-col>
                                                <b-col md="9">
                                                    <ValidationProvider vid="staff" name="Staff" :rules="{required: true}" v-slot="{errors}">
                                                        <b-form-group label="Staff" label-for="staff">
                                                            <b-form-select v-model="appointment.staff_id" @change="appointment.service_id = null" :options="staff" value-field="id" text-field="full_name" :class="{'is-invalid': errors[0]}"></b-form-select>
                                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                                        </b-form-group>
                                                    </ValidationProvider>
                                                </b-col>
                                            </b-row>
                                        </b-card>
                                        <b-row>
                                            <b-col md="12" class="text-right pt-3">
                                                <b-link @click="addService()">Add More Services</b-link>
                                            </b-col>
                                        </b-row>
                                        <b-form-group label="Appointment notes" label-for="notes" class="mt-5">
                                            <b-form-textarea v-model="appointment.notes" rows="3" placeholder="Add an appointment note (visible to staff only)" />
                                        </b-form-group>
                                    </b-form>
                                </ValidationObserver>
                            </div>
                        </div>
                    </b-col>
                    <b-col md="3" :class="{'right-side bg-white border-left p-0 d-flex flex-column' : true, 'pb-5 mb-3' : $screen.width <= 1024}">
                        <div class="d-flex flex-column flex-grow-1 align-items-center justify-content-center">
                            <div v-if="Object.keys(client).length" class="d-flex flex-column p-4 border-bottom">
                                <div class="d-flex">
                                    <b-avatar variant="primary" :text="client.first_name[0] + client.last_name[0]" size="3.5rem" />
                                    <div class="d-flex flex-grow-1 ml-3">
                                        <div class="d-flex flex-column flex-grow-1">
                                            <p class="m-0 font-size-17 font-weight-700">
                                                {{client.full_name}}
                                            </p>
                                            <p class="mt-1 mb-1 font-size-15 sub-color">+{{client.phone_country.phone_code}} {{client.phone_number | VMask(client.phone_country.phone_mask)}}</p>
                                            <p class="m-0 font-size-15 sub-color">{{client.email}}</p>
                                        </div>
                                        <b-icon-x variant="danger" font-scale="1.5rem" class="pointer" @click="client = {}" />
                                    </div>
                                </div>
                                <p v-if="client.notes" class="m-0 mt-3 font-italic">{{client.notes}}</p>
                            </div>
                            <div v-else class="d-flex flex-column align-items-center justify-content-center text-center p-2">
                                <svg-wrapper class="mb-4">
                                    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <g fill="none" fill-rule="evenodd">
                                            <circle fill="#FBD74C" cx="22.5" cy="17.5" r="9.5"></circle>
                                            <g transform="translate(2 2)" stroke="#101928" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                                                <path d="M34.642 34.642L44.5 44.5"></path>
                                                <circle cx="20.5" cy="20.5" r="20"></circle>
                                                <path d="M29.5 30.5h-18v-2.242a3.999 3.999 0 012.866-3.838c1.594-.472 3.738-.92 6.134-.92 2.356 0 4.514.456 6.125.932a4.003 4.003 0 012.875 3.841V30.5z"></path>
                                                <circle cx="20.5" cy="15.5" r="4.5"></circle>
                                            </g>
                                        </g>
                                    </svg>
                                </svg-wrapper>
                                <p class="mb-4">Click the button below to add a new client, or keep empty to save as walk-in.</p>
                                <b-link class="btn btn-primary" @click="$refs['clients-modal'].$refs['modal'].show()">Add Client</b-link>
                                <clients ref="clients-modal" v-on:selected="setClient($event)"></clients>
                            </div>
                            <b-tabs v-if="Object.keys(client).length">
                                <b-tab @click="currentTab = 'appointments'" title="Appointments">
                                    <div :class="{'scrollable': true, 'with-client-notes': client.notes}">
                                        <client-appointments v-if="currentTab == 'appointments'" :client_id="client.id"></client-appointments>
                                    </div>
                                </b-tab>
                                <b-tab @click="currentTab = 'products'" title="Products">
                                    <div :class="{'scrollable': true, 'with-client-notes': client.notes}">
                                        <client-products v-if="currentTab == 'products'" :client_id="client.id"></client-products>
                                    </div>
                                </b-tab>
                                <b-tab @click="currentTab = 'invoices'" title="Invoices">
                                    <div :class="{'scrollable': true, 'with-client-notes': client.notes}">
                                        <client-invoices v-if="currentTab == 'invoices'" :client_id="client.id"></client-invoices>
                                    </div>
                                </b-tab>
                            </b-tabs>
                        </div>
                        <div class="p-3 border-top">
                            <p class="m-0 mb-3 font-size-17 font-weight-700 text-center">
                                Total: {{$store.getters.user.business.country.currency}} {{totalPrice | currency}}
                                ({{$helpers.convertToHoursAndMinutes(totalDuration)}})
                            </p>
                            <div class="d-flex justify-content-center flex-wrap">
                                <div class="pr-1 pl-1 mb-2" style="width:165px">
                                    <b-button @click="saveAppointment(true)" variant="primary" block>Express Checkout</b-button>
                                </div>
                                <div class="pr-1 pl-1 mb-2" style="width:165px">
                                    <b-button @click="saveAppointment(false)" variant="primary" block>Save Appointment</b-button>
                                </div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
                <items-modal ref="items-modal" component-to-show="services" :service-url-params="{branch_id: $route.query.branch_id, staff_id: appointment.items[currentIndex].staff_id, group_by: 'category_hierarchy'}" v-on:selected="onServiceSelected($event)"></items-modal>
            </template>
        </overlay>
    </b-container>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import VMask from "v-mask"
    import moment from "moment"
    import Overlay from "../helpers/overlay"
    import ItemsModal from "../items-modal"
    import SvgWrapper from "../svg-wrapper"
    import Clients from "../clients-modal"
    import ClientAppointments from "../clients/appointments"
    import ClientProducts from "../clients/products"
    import ClientInvoices from "../clients/invoices"

    Vue.use(VeeValidate)
    Vue.use(VMask)

    export default {
        components: {
            Overlay,
            ItemsModal,
            SvgWrapper,
            Clients,
            ClientAppointments,
            ClientProducts,
            ClientInvoices
        },
        data: function () {
            return {
                appointment: {
                    bookingDate: this.$route.query.date ?? new Date(),
                    branch_id: this.$route.query.branch_id ?? null,
                    items: [],
                    notes: null
                },
                staff: [],
                client: {},
                currentIndex: 0,
                currentTab: "appointments",
                showLoader: true,
                isSubmitted: false
            }
        },
        created: async function () {
            if (this.$route.query.client_id) {
                const clientResponse = await this.$http.get("clients/" + this.$route.query.client_id, {params: {"with-phone-country": 1, "with-deals": 1}})
                this.client = clientResponse.data
            }
            
            if (this.$route.params.id) {
                this.showLoader = true
                const appointmentResponse = await this.$http.get("appointments/" + this.$route.params.id + "?with-items&with-client")
                
                if (appointmentResponse.data.invoice_id) {
                    this.$helpers.showToast("info", "You cannot edit this appointment because an invoice for this invoice has already been generated.")
                    this.$router.push({name: "calendar.appointments.view", params: {id: this.$route.params.id}})
                }

                this.$http.get("staff?branch_ids=" + appointmentResponse.data.branch_id)
                .then(staff => {
                    this.staff = staff.data
                })

                appointmentResponse.data.items.forEach(item => {
                    this.appointment.items.push({
                        start_time: item.start_time,
                        service_id: item.service_id,
                        price: item.price,
                        title: item.service.title,
                        duration: item.duration,
                        staff_id: item.staff_id
                    })
                })

                this.appointment.bookingDate = appointmentResponse.data.booking_date
                this.appointment.branch_id = appointmentResponse.data.branch_id
                this.appointment.notes = appointmentResponse.data.notes

                if (appointmentResponse.data.client) {
                    this.client = appointmentResponse.data.client
                }

                this.showLoader = false
            } else if (this.$route.query.appointment_id) {
                this.showLoader = true
                const appointmentResponse = await this.$http.get("appointments/" + this.$route.query.appointment_id + "?with-items&with-client")

                this.$http.get("staff?branch_ids=" + appointmentResponse.data.branch_id)
                .then(staff => {
                    this.staff = staff.data
                })

                appointmentResponse.data.items.forEach(item => {
                    this.appointment.items.push({
                        start_time: this.$route.query.start_time ?? item.start_time,
                        service_id: item.service_id,
                        price: item.price,
                        title: item.service.title,
                        duration: item.duration,
                        staff_id: this.$route.query.staff_id ?? item.staff_id
                    })
                })

                this.appointment.bookingDate = this.$route.query.date ?? appointmentResponse.data.booking_date
                this.appointment.branch_id = appointmentResponse.data.branch_id
                this.appointment.notes = appointmentResponse.data.notes

                if (appointmentResponse.data.client) {
                    this.client = appointmentResponse.data.client
                }

                this.showLoader = false
            } else {
                const staffResponse = await this.$http.get("staff?branch_ids=" + this.appointment.branch_id)
                this.staff = staffResponse.data
                let staff_id = this.$route.query.staff_id ?? this.$store.getters.user.staff.id
                const isStaffInBranch = this.staff.find(staffRow => staffRow.id == staff_id)
                
                this.appointment.items.push({
                    start_time: this.$route.query.start_time ?? this.$helpers.getNextInterval().format("HH:mm:00"),
                    service_id: null,
                    price: 0,
                    title: null,
                    duration: 0,
                    staff_id: isStaffInBranch ? staff_id : this.staff[0].id
                })

                this.showLoader = false
            }
        },
        methods: {
            openItemsModal: function () {
                this.$refs["items-modal"].$refs["modal"].show()
            },
            onServiceSelected: function (item) {
                this.appointment.items[this.currentIndex].service_id = item.data.service.id
                this.appointment.items[this.currentIndex].price = item.data.pricing.special_price > 0 ? item.data.pricing.special_price : item.data.pricing.price
                this.appointment.items[this.currentIndex].title = item.data.service.title
                this.appointment.items[this.currentIndex].duration = item.data.pricing.duration

                this.$refs['items-modal'].$refs['modal'].hide()
            },
            addService: function () {
                this.$refs.form.validate().then(isValid => {
                    if (isValid) {
                        const lastIndex = this.appointment.items.length - 1
                        const lastStartTime = this.appointment.items[lastIndex].start_time
                        const lastDuration = this.appointment.items[lastIndex].duration
                        const newStartTime = moment(lastStartTime, this.$helpers.timeFormat()).add(lastDuration, "minutes").format("HH:mm:ss")

                        this.appointment.items.push({
                            start_time: newStartTime,
                            service_id: null,
                            price: 0,
                            title: null,
                            duration: 0,
                            staff_id: this.appointment.items[lastIndex].staff_id
                        })
                    }
                })
            },
            removeService: function (idx) {
                this.appointment.items.splice(this.appointment.items.indexOf(idx), 1)
            },
            setClient: function (client) {
                this.client = client
                this.$refs['clients-modal'].$refs['modal'].hide()
            },
            saveAppointment: function (isExpressCheckout) {
                this.$refs.form.validate().then(isValid => {
                    if (isValid) {
                        this.isSubmitted = true
                        let axios = null
                        let action = undefined

                        if (this.$route.query.appointment_id && this.$route.query.action) {
                            action = this.$route.query.action
                        }
                        
                        const formData = {
                            booking_date: this.appointment.bookingDate,
                            items: this.appointment.items,
                            notes: this.appointment.notes,
                            client_id: this.client.id,
                            action: action
                        }

                        const appointment_id = this.$route.params.id ?? this.$route.query.appointment_id

                        if (appointment_id) {
                            axios = this.$http.put("appointments/" + this.appointment.branch_id + '/' + appointment_id, formData)
                        } else {
                            axios = this.$http.post("appointments/" + this.appointment.branch_id, formData)
                        }
                        
                        axios
                        .then(res => {
                            this.isSubmitted = false
                            if (res.data.success) {
                                if (isExpressCheckout) {
                                    this.$router.push({name: "checkout", query: {branch_id: this.$route.query.branch_id, appointment_id: res.data.appointment_id}})
                                } else {
                                    this.$helpers.showToast("success", res.data.message)
                                    this.$router.push({name: "calendar"})
                                }
                            } else {
                                this.$helpers.showToast("danger", res.data.message)
                            }
                        })
                        .catch(() => {
                            this.isSubmitted = false
                        })
                    }
                })
            }
        },
        computed: {
            totalPrice: function () {
                let totalPrice = 0
                this.appointment.items.forEach(itemRow => {
                    totalPrice += parseFloat(itemRow.price)
                })
                return totalPrice
            },
            totalDuration: function () {
                let totalDuration = 0
                this.appointment.items.forEach(itemRow => {
                    totalDuration += parseInt(itemRow.duration)
                })
                return totalDuration
            }
        }
    }
</script>
<style scoped lang="scss">
    @media (min-width: 992px) {
        .left-side {
            .scrollable {
                height: calc(100vh - 71px);
                overflow-y: scroll;
                .appointments-wrapper {
                    width: 94%;
                    margin: auto;
                }
            }
            @media (min-width: 768px) {
                flex: 0 0 70%;
                // max-width: 70%;
            }
        }
        .right-side {
            height: calc(100vh - 71px);
            .scrollable {
                overflow-y: scroll;
                height: calc(100vh - 369px);
                &.with-client-notes {
                    height: calc(100vh - 409px);
                }
            }
            @media (min-width: 768px) {
                flex: 0 0 30%;
                max-width: 30%;
            }
        }
    }
@media (max-width: 992px) {
    .left-side, .right-side{
        max-width: 100%;
        width: 100%;
        flex:auto
    }
}
</style>