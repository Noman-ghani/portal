<template>
    <b-container fluid>
        <overlay :show="showLoader" full-height>
            <template v-if="!Object.keys(appointment).length" #overlay>
                <div class="text-center">
                    <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                    <p class="mt-3 font-weight-bold font-size-17">Updating your changes to this appointment.<br />Please do not close this browser.</p>
                </div>
            </template>
            <b-row v-if="Object.keys(appointment).length">
                <b-col md="9" class="left-side p-0">
                    <div class="scrollable pt-5">
                        <div class="appointments-wrapper">
                            <div class="d-flex mb-5">
                                <p class="m-0 font-size-24 font-weight-700">{{$helpers.formatDate(appointment.booking_date)}}</p>
                                <dropdown variant="outline-primary" v-if="appointment.status !== 'cancelled'" menu-class="w-100" class="status-dropdown ml-auto">
                                    <template #button-content>
                                        <b-icon :icon="currentStatus.icon" class="mr-1"></b-icon>
                                        {{currentStatus.text}}
                                    </template>
                                    <b-dropdown-item @click="submitChangeStatus(appointmentStatus.value)" v-for="appointmentStatus, idx in appointmentStatuses" v-bind:key="'appointment-status-' + idx" class="text-left d-flex">
                                        <b-icon :icon="appointmentStatus.icon" :variant="appointmentStatus.variant"></b-icon>
                                        <p class="m-0 ml-2 text-center">{{appointmentStatus.text}}</p>
                                    </b-dropdown-item>
                                </dropdown>
                            </div>
                            <b-row v-for="item, idx in appointment.items" v-bind:key="idx" class="mt-4">
                                <b-col md="2">
                                    <p class="m-0 font-size-17 font-weight-700">
                                        {{$helpers.formatTime(appointment.booking_date + ' ' + item.start_time)}}
                                        -
                                        {{$helpers.formatTime(appointment.booking_date + ' ' + item.end_time)}}
                                    </p>
                                </b-col>
                                <b-col md="8">
                                    <p class="m-0 font-size-17 font-weight-700">{{item.service.title}}</p>
                                    <p class="m-0 mt-2 font-size-15 sub-color">
                                        {{$helpers.convertToHoursAndMinutes(item.duration)}} with {{item.staff.full_name}}
                                    </p>
                                </b-col>
                                <b-col md="2">
                                    <p class="m-0 font-size-17 font-weight-700 text-right">
                                        {{$store.getters.user.business.country.currency}} {{item.price | currency}}
                                    </p>
                                </b-col>
                            </b-row>
                            <div class="border-top mt-4 pt-4 font-size-24 font-weight-800 text-right">
                                {{$store.getters.user.business.country.currency}} {{totalPrice | currency}}
                            </div>
                            <b-card class="mt-5" v-if="appointment.notes">
                                <template #header>
                                    <h2>
                                        <b-icon-card-checklist class="mr-2"></b-icon-card-checklist>
                                        Appointment Notes
                                    </h2>
                                </template>
                                {{appointment.notes}}
                            </b-card>
                            <b-card class="mt-5" v-if="appointment.history.length">
                                <template #header>
                                    <h2>
                                        <b-icon-folder-symlink class="mr-2"></b-icon-folder-symlink>
                                        Appointment History
                                    </h2>
                                </template>
                                <p v-for="history, idx in appointment.history" v-bind:key="'history-' + history.id" :class="{'m-0': true, 'mt-2': idx > 0}">
                                    <span v-html="history.description"></span>
                                </p>
                            </b-card>
                        </div>
                    </div>
                </b-col>
                <b-col md="3" class="right-side bg-white border-left p-0 d-flex flex-column">
                    <div class="d-flex flex-grow-1 flex-column">
                        <div class="p-4 border-bottom">
                            <div v-if="!appointment.client_id" class="d-flex align-items-center">
                                <b-avatar size="3rem">
                                    <b-icon-person-fill font-scale="2"></b-icon-person-fill>
                                </b-avatar>
                                <p class="m-0 ml-3 font-size-17 font-weight-700">Walk-In</p>
                            </div>
                            <div v-else class="d-flex flex-column">
                                <div class="d-flex align-items-center">
                                    <b-avatar variant="primary" :text="appointment.client.first_name[0] + appointment.client.last_name[0]" size="4rem" />
                                    <div class="ml-3">
                                        <p class="m-0 font-size-17 font-weight-700">
                                            {{appointment.client.full_name}}
                                        </p>
                                        <p class="mt-1 mb-1 font-size-15 sub-color">
                                            +{{appointment.client.phone_country.phone_code}} {{appointment.client.phone_number | VMask(appointment.client.phone_country.phone_mask)}}
                                        </p>
                                        <p v-if="appointment.client.email" class="m-0 font-size-15 sub-color">
                                            {{appointment.client.email}}
                                        </p>
                                    </div>
                                </div>
                                <p v-if="appointment.client.notes" class="m-0 mt-3 font-italic">{{appointment.client.notes}}</p>
                            </div>
                        </div>
                        <template v-if="appointment.invoice_id">
                            <div class="d-flex flex-column align-items-center mt-5 ml-3 mr-3">
                                <template v-if="appointment.invoice.status === 'unpaid'">
                                    <span class="svg-wrapper wh-100 d-block">
                                        <img src="@/assets/images/unpaid.svg" />
                                    </span>
                                    <p class="m-0 mt-3 font-size-24 font-weight-700">Unpaid</p>
                                </template>
                                <template v-if="appointment.invoice.status === 'refunded'">
                                    <span class="svg-wrapper wh-100 d-block">
                                        <img src="@/assets/images/refunded.svg" />
                                    </span>
                                    <p class="m-0 mt-3 font-size-24 font-weight-700">Refunded</p>
                                </template>
                                <template v-if="appointment.invoice.status === 'completed'">
                                    <span class="svg-wrapper wh-100 d-block">
                                        <img src="@/assets/images/completed.svg" />
                                    </span>
                                    <p class="m-0 mt-3 font-size-24 font-weight-700">Completed</p>
                                </template>
                                <template v-if="appointment.invoice.status === 'voided'">
                                    <span class="svg-wrapper wh-100 d-block">
                                        <img src="@/assets/images/voided.svg" />
                                    </span>
                                    <p class="m-0 mt-3 font-size-24 font-weight-700">Voided</p>
                                </template>
                                <p class="mt-4 mb-0 font-size-17 text-center" v-if="appointment.invoice.status === 'completed'">Full payment received on {{$helpers.formatDate(appointment.invoice.payment_created_at)}}</p>
                            </div>
                        </template>
                        <div v-else-if="appointment.status === 'cancelled'" class="d-flex flex-column align-items-center mt-5 ml-3 mr-3">
                            <span class="svg-wrapper wh-100 d-block">
                                <img src="@/assets/images/voided.svg" />
                            </span>
                            <p class="m-0 mt-3 font-size-24 font-weight-700">Cancelled</p>
                        </div>
                        <b-tabs v-else-if="appointment.client_id">
                            <b-tab @click="currentTab = 'appointments'" title="Appointments">
                                <div :class="{'scrollable': true, 'with-client-notes': appointment.client && appointment.client.notes}">
                                    <client-appointments v-if="currentTab == 'appointments'" :client_id="appointment.client_id"></client-appointments>
                                </div>
                            </b-tab>
                            <b-tab @click="currentTab = 'products'" title="Products">
                                <div :class="{'scrollable': true, 'with-client-notes': appointment.client && appointment.client.notes}">
                                    <client-products v-if="currentTab == 'products'" :client_id="appointment.client_id"></client-products>
                                </div>
                            </b-tab>
                            <b-tab @click="currentTab = 'invoices'" title="Invoices">
                                <div :class="{'scrollable': true, 'with-client-notes': appointment.client && appointment.client.notes}">
                                    <client-invoices v-if="currentTab == 'invoices'" :client_id="appointment.client_id"></client-invoices>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </div>
                    <div class="p-3 border-top">
                        <p class="m-0 mb-3 font-size-17 font-weight-700 text-center">
                            Total: {{$store.getters.user.business.country.currency}} {{totalPrice | currency}}
                            ({{$helpers.convertToHoursAndMinutes(totalDuration)}})
                        </p>
                        <div class="d-flex">
                            <dropdown dropup class="flex-basis-50 mr-2" menu-class="w-100" text="More Options" variant="outline-primary">
                                <template v-if="appointment.invoice_id || appointment.status === 'cancelled'">
                                    <b-dropdown-item :to="{name: 'calendar', query: {action: 'rebook', appointment_id: appointment.id}}">Rebook</b-dropdown-item>
                                </template>
                                <template v-else>
                                    <b-dropdown-item :to="{name: 'calendar.appointments.edit', params: {id: appointment.id}}">Edit Appointment</b-dropdown-item>
                                    <b-dropdown-item :to="{name: 'calendar', query: {action: 'reschedule', appointment_id: appointment.id}}">Reschedule</b-dropdown-item>
                                    <b-dropdown-item variant="danger" @click="$refs['cancel-modal'].show()">Cancel</b-dropdown-item>
                                    <b-dropdown-item variant="danger" @click="$refs['no-show-modal'].show()">No Show</b-dropdown-item>
                                    <b-dropdown-item v-if="appointment.status === 'no-show'" @click="$refs['undo-no-show-modal'].show()">Undo No Show</b-dropdown-item>
                                </template>
                            </dropdown>
                            <template v-if="appointment.status !== 'cancelled'">
                                <submit-button v-if="!appointment.invoice_id" @click.native="checkout()" class="flex-basis-50 ml-2">Checkout</submit-button>
                                <router-link v-else :to="{name: 'view.invoice', params: {id: appointment.invoice_id}}" class="flex-basis-50 ml-2 btn btn-primary">View Invoice</router-link>
                            </template>
                            <template v-else>
                                <router-link :to="{name: 'calendar'}" class="flex-basis-50 ml-2 btn btn-secondary">Close</router-link>
                            </template>
                        </div>
                    </div>
                </b-col>
            </b-row>
            <b-modal ref="cancel-modal" @show="getCancellationReasons()" no-close-on-esc no-close-on-backdrop title="Cancel Appointment">
                <ValidationObserver ref="cancel-form">
                    <ValidationProvider vid="cancel-reason" name="Cancellation reason" :rules="{required: true}" v-slot="{errors}">
                        <b-form-group label="Cancellation reason" label-for="cancel-reason">
                            <overlay :show="!cancellation.reasons.length" is-field>
                                <b-form-select v-model="cancellation.reason_id" :options="cancellation.reasons" :class="{'is-invalid': errors[0]}">
                                    <template #first>
                                        <b-form-select-option :value="null">Please Select</b-form-select-option>
                                    </template>
                                </b-form-select>
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </overlay>
                        </b-form-group>
                    </ValidationProvider>
                </ValidationObserver>
                <template #modal-footer>
                    <submit-button ref="btn-cancel-appointment" @click.native="submitCancelAppointment()">Cancel appointment</submit-button>
                </template>
            </b-modal>
            <b-modal ref="no-show-modal" no-close-on-esc no-close-on-backdrop title="Did not show">
                <p class="m-0">Are you sure you want to set this appointment as "No Show"?</p>
                <template #modal-footer>
                    <submit-button ref="submit-no-show-button" @click.native="submitSetAsNoShow()">Set as No-Show</submit-button>
                </template>
            </b-modal>
            <b-modal ref="undo-no-show-modal" no-close-on-esc no-close-on-backdrop title="Undo no show">
                <p class="m-0">Are you sure you want to undo this appointment from "No Show"?</p>
                <template #modal-footer>
                    <submit-button ref="submit-undo-no-show-button" @click.native="submitUndoNoShow()">Undo No-Show</submit-button>
                </template>
            </b-modal>
        </overlay>
    </b-container>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import VMask from "v-mask"
    import Overlay from "../helpers/overlay.vue"
    import Dropdown from "../helpers/dropdown.vue"
    import ClientAppointments from "../clients/appointments.vue"
    import ClientProducts from "../clients/products.vue"
    import ClientInvoices from "../clients/invoices.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)
    Vue.use(VMask)

    export default {
        components: {
            Overlay,
            Dropdown,
            ClientAppointments,
            ClientProducts,
            ClientInvoices,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                appointment: {},
                currentTab: "appointments",
                cancellation: {
                    reasons: [],
                    reason_id: null
                },
                appointmentStatuses: [
                    { value: "new", text: "New", "icon": "star", "variant": "primary" },
                    { value: "confirmed", text: "Confirmed", "icon": "hand-thumbs-up", "variant": "success" },
                    { value: "arrived", text: "Arrived", "icon": "caret-down", "variant": "warning" },
                    { value: "started", text: "Started", "icon": "caret-right", "variant": "success" }
                ]
            }
        },
        watch: {
            $route: {
                handler: function () {
                    this.getAppointment()
                }
            }
        },
        created: async function () {
            await this.getAppointment()
        },
        methods: {
            getAppointment: function () {
                this.showLoader = true
                this.$http.get("appointments/" + this.$route.params.id, {params: {'with-client': true, 'with-items': true, 'with-history': true, 'with-invoice': true}})
                .then(appointment => {
                    this.showLoader = false
                    this.appointment = appointment.data
                })
            },
            getCancellationReasons: function () {
                this.cancellation.reasons = []
                this.$http.get("utilities/appointment-cancellation-reasons")
                .then(cancellationReasons => {
                    this.cancellation.reasons = cancellationReasons.data
                })
            },
            submitChangeStatus: function (newStatus) {
                if (newStatus === this.appointment.status) {
                    return
                }

                this.showLoader = true
                this.$http.put("appointments/change-status/" + this.$route.params.id, { status: newStatus })
                .then(response => {
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$http.get("appointments/" + this.$route.params.id + "?with-history")
                        .then(appointment => {
                            this.appointment.status = newStatus
                            this.appointment.history = appointment.data.history
                            this.showLoader = false
                        })
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
                .catch(() => {
                    this.showLoader = false
                })
            },
            submitCancelAppointment: function () {
                this.$refs["cancel-form"].validate().then(isValid => {
                    if (isValid) {
                        this.$refs["btn-cancel-appointment"].displayLoader = true
                        this.$http.put("appointments/change-status/" + this.$route.params.id, { status: "cancelled", cancel_reason_id: this.cancellation.reason_id })
                        .then(response => {
                            if (response.data.success) {
                                this.$helpers.showToast("success", response.data.message)
                                this.$http.get("appointments/" + this.$route.params.id + "?with-history")
                                .then(appointment => {
                                    this.appointment.status = "cancelled"
                                    this.appointment.history = appointment.data.history
                                    this.$refs["btn-cancel-appointment"].displayLoader = false
                                    this.$refs["cancel-modal"].hide()
                                })
                            } else {
                                this.$helpers.showToast("danger", response.data.message)
                            }
                        })
                        .catch(() => {
                            this.$refs["btn-cancel-appointment"].displayLoader = false
                        })
                    }
                })
            },
            submitSetAsNoShow: function () {
                this.$refs["submit-no-show-button"].displayLoader = true
                this.$http.put("appointments/change-status/" + this.$route.params.id, { status: "no-show" })
                .then(response => {
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$http.get("appointments/" + this.$route.params.id + "?with-history")
                        .then(appointment => {
                            this.appointment.history = appointment.data.history
                            this.$refs["submit-no-show-button"].displayLoader = false
                            this.$refs["no-show-modal"].hide()
                        })
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
                .catch(() => {
                    this.$refs["submit-no-show-button"].displayLoader = false
                })
            },
            submitUndoNoShow: function () {
                this.$refs["submit-undo-no-show-button"].displayLoader = true
                this.$http.put("appointments/change-status/" + this.$route.params.id, { status: "new" })
                .then(response => {
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$http.get("appointments/" + this.$route.params.id + "?with-history")
                        .then(appointment => {
                            this.appointment.history = appointment.data.history
                            this.$refs["submit-undo-no-show-button"].displayLoader = false
                            this.$refs["undo-no-show-modal"].hide()
                        })
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
                .catch(() => {
                    this.$refs["submit-undo-no-show-button"].displayLoader = false
                })
            },
            checkout: function () {
                this.$router.push({name: "checkout", query: {branch_id: this.appointment.branch_id, appointment_id: this.$route.params.id}})
            }
        },
        computed: {
            currentStatus: function () {
                return this.appointmentStatuses.find(appointmentStatus => appointmentStatus.value == this.appointment.status)
            },
            totalPrice: function () {
                let totalPrice = 0
                if (Object.keys(this.appointment).length) {
                    this.appointment.items.forEach(itemRow => {
                        totalPrice += parseFloat(itemRow.price)
                    })
                }
                return totalPrice
            },
            totalDuration: function () {
                let totalDuration = 0
                if (Object.keys(this.appointment).length) {
                    this.appointment.items.forEach(itemRow => {
                        totalDuration += parseInt(itemRow.duration)
                    })
                }
                return totalDuration
            }
        }
    }
</script>
<style scoped lang="scss">
    ::v-deep .status-dropdown {
        button {
            width: 165px;
        }
    }
    @media (min-width: 992px) {
        .left-side {
            .scrollable {
                height: calc(100vh - 71px);
                overflow-y: scroll;
                .appointments-wrapper {
                    width: 70%;
                    margin: auto;
                }
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
        }
    }
</style>