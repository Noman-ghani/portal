<template>
    <overlay :show="showLoader" full-height-with-heading :class="{'full-centralized': true, 'mb-5' : $screen.width < 768}">
        <template v-if="!showLoader">
            <b-row>
                <b-col :md="$screen.width > 992 ? 5 : 12">
                    <div :class="{'d-flex align-items-center half-col' : true, 'mb-4' : $screen.width <= 992, 'flex-wrap' : $screen.width <= 480 }">
                        <b-form-select @change="filterForm.staff_id = null; getShifts()" v-model="filterForm.branch_id" :options="branches" value-field="id" text-field="name"></b-form-select>
                        <b-form-select v-model="filterForm.staff_id" :options="branchEmployees" :class="{'ml-3' : $screen.width > 480, 'm-0 mt-4' : $screen.width <= 480}">
                            <template #first>
                                <b-form-select-option :value="null">All Staff</b-form-select-option>
                            </template>
                        </b-form-select>
                    </div>
                </b-col>
                <b-col :md="$screen.width > 992 ? 4 : 12"></b-col>
                <b-col :md="$screen.width > 992 ? 3 : 12">
                    <div class="form-control d-flex align-items-center text-center">
                        <date-range-picker @update="getShifts()" :ranges="false" auto-apply control-container-class="text-left" :locale-data="{firstDay: parseInt($store.getters.user.business.week_start), format: 'mmm dd yyyy'}" single-date-picker v-model="filterForm.dateRange"></date-range-picker>
                        <b-icon-calendar-fill class="ml-3"></b-icon-calendar-fill>
                    </div>
                </b-col>
            </b-row>
            <div class="overflow-auto">
                <overlay :show="dataLoader" full-height-with-heading-and-submenus class="staff-schedule-wrapper mt-4 d-table w-100">
                    <template v-if="!dataLoader">
                        <div class="staff-left">
                            <table class="table table-bordered m-0 table-left" responsive>
                                <thead>
                                    <tr>
                                        <th class="text-center">All Staff</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="staffShift, idx in staffShiftsList" v-bind:key="'staff-' + idx">
                                        <td>
                                            <div>
                                                <p class="m-0">{{staffShift.staff.name}}</p>
                                                <p class="m-0 sub-color">{{getStaffTotalWorkingHours(staffShift.shifts)}}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="weekdays">
                            <table class="table table-bordered m-0 table-right" responsive>
                                <thead>
                                    <tr>
                                        <th v-for="weekDate, weekDateIdx in weekDates" v-bind:key="'weekDate-' + weekDateIdx" class="text-center border-left">
                                            {{$helpers.formatDate(weekDate, "ddd DD MMM")}}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="staffShift, staffShiftIdx in staffShiftsList" v-bind:key="'shifts-' + staffShiftIdx">
                                        <td>
                                            <div @click="editShiftFormModal(staffShift, 0)" v-if="staffShift.shifts[0].timeslots.length" class="pointer">
                                                <p class="m-0" v-for="timeslot, timeSlotIndex in staffShift.shifts[0].timeslots" v-bind:key="'timeslot-' + staffShiftIdx + '-' + timeSlotIndex">
                                                    {{$helpers.formatTime(timeslot.starts_at)}} - {{$helpers.formatTime(timeslot.ends_at)}}
                                                </p>
                                            </div>
                                            <b-link class="add-edit-shift" @click="newShiftFormModal(staffShift.staff, 0)" v-else>
                                                <span>+</span>
                                            </b-link>
                                        </td>
                                        <td>
                                            <div @click="editShiftFormModal(staffShift, 1)" v-if="staffShift.shifts[1].timeslots.length" class="pointer">
                                                <p class="m-0" v-for="timeslot, timeSlotIndex in staffShift.shifts[1].timeslots" v-bind:key="'timeslot-' + staffShiftIdx + '-' + timeSlotIndex">
                                                    {{$helpers.formatTime(timeslot.starts_at)}} - {{$helpers.formatTime(timeslot.ends_at)}}
                                                </p>
                                            </div>
                                            <b-link class="add-edit-shift" @click="newShiftFormModal(staffShift.staff, 1)" v-else>
                                                <span>+</span>
                                            </b-link>
                                        </td>
                                        <td>
                                            <div @click="editShiftFormModal(staffShift, 2)" v-if="staffShift.shifts[2].timeslots.length" class="pointer">
                                                <p class="m-0" v-for="timeslot, timeSlotIndex in staffShift.shifts[2].timeslots" v-bind:key="'timeslot-' + staffShiftIdx + '-' + timeSlotIndex">
                                                    {{$helpers.formatTime(timeslot.starts_at)}} - {{$helpers.formatTime(timeslot.ends_at)}}
                                                </p>
                                            </div>
                                            <b-link class="add-edit-shift" @click="newShiftFormModal(staffShift.staff, 2)" v-else>
                                                <span>+</span>
                                            </b-link>
                                        </td>
                                        <td>
                                            <div @click="editShiftFormModal(staffShift, 3)" v-if="staffShift.shifts[3].timeslots.length" class="pointer">
                                                <p class="m-0" v-for="timeslot, timeSlotIndex in staffShift.shifts[3].timeslots" v-bind:key="'timeslot-' + staffShiftIdx + '-' + timeSlotIndex">
                                                    {{$helpers.formatTime(timeslot.starts_at)}} - {{$helpers.formatTime(timeslot.ends_at)}}
                                                </p>
                                            </div>
                                            <b-link class="add-edit-shift" @click="newShiftFormModal(staffShift.staff, 3)" v-else>
                                                <span>+</span>
                                            </b-link>
                                        </td>
                                        <td>
                                            <div @click="editShiftFormModal(staffShift, 4)" v-if="staffShift.shifts[4].timeslots.length" class="pointer">
                                                <p class="m-0" v-for="timeslot, timeSlotIndex in staffShift.shifts[4].timeslots" v-bind:key="'timeslot-' + staffShiftIdx + '-' + timeSlotIndex">
                                                    {{$helpers.formatTime(timeslot.starts_at)}} - {{$helpers.formatTime(timeslot.ends_at)}}
                                                </p>
                                            </div>
                                            <b-link class="add-edit-shift" @click="newShiftFormModal(staffShift.staff, 4)" v-else>
                                                <span>+</span>
                                            </b-link>
                                        </td>
                                        <td>
                                            <div @click="editShiftFormModal(staffShift, 5)" v-if="staffShift.shifts[5].timeslots.length" class="pointer">
                                                <p class="m-0" v-for="timeslot, timeSlotIndex in staffShift.shifts[5].timeslots" v-bind:key="'timeslot-' + staffShiftIdx + '-' + timeSlotIndex">
                                                    {{$helpers.formatTime(timeslot.starts_at)}} - {{$helpers.formatTime(timeslot.ends_at)}}
                                                </p>
                                            </div>
                                            <b-link class="add-edit-shift" @click="newShiftFormModal(staffShift.staff, 5)" v-else>
                                                <span>+</span>
                                            </b-link>
                                        </td>
                                        <td>
                                            <div @click="editShiftFormModal(staffShift, 6)" v-if="staffShift.shifts[6].timeslots.length" class="pointer">
                                                <p class="m-0" v-for="timeslot, timeSlotIndex in staffShift.shifts[6].timeslots" v-bind:key="'timeslot-' + staffShiftIdx + '-' + timeSlotIndex">
                                                    {{$helpers.formatTime(timeslot.starts_at)}} - {{$helpers.formatTime(timeslot.ends_at)}}
                                                </p>
                                            </div>
                                            <b-link class="add-edit-shift" @click="newShiftFormModal(staffShift.staff, 6)" v-else>
                                                <span>+</span>
                                            </b-link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                                <b-modal ref="shift-form-modal" no-close-on-esc no-close-on-backdrop size="lg">
                                    <template #modal-title>
                                        <p class="m-0">Edit {{shiftForm.staff.name}}'s Hours</p>
                                        <p class="m-0 sub-color font-size-15">{{$helpers.formatDate(shiftForm.date)}}</p>
                                    </template>
                                    <b-row>
                                        <b-col class="pr-0">
                                            <ValidationProvider vid="first_starts_at" name="Shift Start" :rules="{required: true}" v-slot="{errors}">
                                                <b-form-group label="Shift Start" label-for="first_starts_at">
                                                    <b-form-select :options="$helpers.getTimeSlots(5)" v-model="shiftForm.first_shift.starts_at" :class="{'rounded-0': true, 'is-invalid': errors[0]}"></b-form-select>
                                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                                </b-form-group>
                                            </ValidationProvider>
                                        </b-col>
                                        <b-col class="pl-0">
                                            <ValidationProvider vid="first_ends_at" name="Shift End" :rules="{required: true}" v-slot="{errors}">
                                                <b-form-group label="Shift End" label-for="first_ends_at">
                                                    <b-form-select :options="$helpers.getTimeSlots(5)" v-model="shiftForm.first_shift.ends_at" :class="{'rounded-0': true, 'is-invalid': errors[0]}"></b-form-select>
                                                </b-form-group>
                                            </ValidationProvider>
                                        </b-col>
                                    </b-row>
                                    <b-row class="mt-2">
                                        <b-col :class="{'pr-0': shiftForm.repeats === 'weekly'}">
                                            <b-form-group label="Repeats" label-for="repeats">
                                                <b-form-select :options="[{ value: 'dont_repeat', text: 'Don\'t Repeat' }, { value: 'weekly', text: 'Weekly' }]" v-model="shiftForm.repeats" class="rounded-0"></b-form-select>
                                            </b-form-group>
                                        </b-col>
                                        <b-col v-if="shiftForm.repeats === 'weekly'" class="pl-0">
                                            <b-form-group label="End Repeat" label-for="end-repeat">
                                                <b-form-select v-if="shiftForm.end_repeat === 'ongoing'" :options="[{ value: 'ongoing', text: 'Ongoing' }, { value: 'specific_date', text: 'Specific Date' }]" v-model="shiftForm.end_repeat" class="rounded-0"></b-form-select>
                                                <div v-else class="form-control d-flex align-items-center rounded-0">
                                                    <b-icon-calendar-fill class="mr-2"></b-icon-calendar-fill>
                                                    <date-range-picker :ranges="false" :date-format="filteredDates" auto-apply show-dropdowns control-container-class="" :locale-data="{firstDay: 1, format: 'dddd, mmmm dd, yyyy'}" single-date-picker v-model="shiftForm.specific_date"></date-range-picker>
                                                    <b-icon-x @click="shiftForm.end_repeat = 'ongoing'" font-scale="1.5" class="ml-1 pointer"></b-icon-x>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <template #modal-footer>
                                        <div :class="{'d-flex': true, 'w-100': shiftForm.isUpdate, 'justify-content-between': true}">
                                            <b-button v-if="shiftForm.isUpdate" variant="danger" @click="showShiftDeleteModal()">DELETE</b-button>
                                            <b-button variant="primary" @click="showShiftUpdateModal()" :disabled="invalid || isShiftFormSubmitted">
                                                <b-spinner label="Spinning" v-if="isShiftFormSubmitted"></b-spinner>
                                                <span v-else>Save</span>
                                            </b-button>
                                        </div>
                                    </template>
                                </b-modal>
                            </b-form>
                        </ValidationObserver>
                        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                                <b-modal ref="shift-update-modal" no-close-on-esc no-close-on-backdrop>
                                    <template #modal-title>
                                        <p class="m-0">Repeating Shift</p>
                                    </template>
                                    <p class="m-0" v-if="shiftForm.end_repeat == 'ongoing'">You have edited a shift that repeats weekly. Updating upcoming shifts will overwrite {{shiftForm.staff.name}}'s ongoing {{$helpers.formatDate(shiftForm.date, "dddd")}} schedule.</p>
                                    <p class="m-0" v-else>You have edited a shift that repeats weekly. Updating upcoming shifts will overwrite {{shiftForm.staff.name}}'s {{$helpers.formatDate(shiftForm.date, "dddd")}} schedule up to {{$helpers.formatDate(shiftForm.specific_date.startDate)}}.</p>
                                    <template #modal-footer>
                                        <div class="d-flex flex-grow-1 justify-content-between">
                                            <b-button variant="secondary" @click="saveStaffShift(false)" :disabled="invalid || isShiftFormSubmitted">
                                                <b-spinner label="Spinning" v-if="isShiftFormSubmitted"></b-spinner>
                                                <span v-else>Update upcoming shifts</span>
                                            </b-button>
                                            <b-button variant="primary" @click="saveStaffShift(true)" :disabled="invalid || isShiftFormSubmitted">
                                                <b-spinner label="Spinning" v-if="isShiftFormSubmitted"></b-spinner>
                                                <span v-else>Update this shift only</span>
                                            </b-button>
                                        </div>
                                    </template>
                                </b-modal>
                            </b-form>
                        </ValidationObserver>
                        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                                <b-modal ref="shift-delete-modal" no-close-on-esc no-close-on-backdrop>
                                    <template #modal-title>
                                        <p class="m-0">Repeating Shift</p>
                                    </template>
                                    <p class="m-0">You are deleting a shift that repeats weekly. Deleting upcoming shifts will overwrite {{shiftForm.staff.name}}'s ongoing {{$helpers.formatDate(shiftForm.date, "dddd")}} schedule.</p>
                                    <template #modal-footer>
                                        <div class="d-flex flex-grow-1 justify-content-between">
                                            <b-button variant="secondary" @click="deleteStaffShift(false)" :disabled="invalid || isDeleteFormSubmitted">
                                                <b-spinner label="Spinning" v-if="isDeleteFormSubmitted"></b-spinner>
                                                <span v-else>Delete upcoming shifts</span>
                                            </b-button>
                                            <b-button variant="danger" @click="deleteStaffShift(true)" :disabled="invalid || isDeleteFormSubmitted">
                                                <b-spinner label="Spinning" v-if="isDeleteFormSubmitted"></b-spinner>
                                                <span v-else>Delete this shift only</span>
                                            </b-button>
                                        </div>
                                    </template>
                                </b-modal>
                            </b-form>
                        </ValidationObserver>
                    </template>
                </overlay>
            </div>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import moment from "moment"
    import DateRangePicker from "vue2-daterange-picker"
    import Overlay from "../../helpers/overlay.vue"
    // import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            DateRangePicker,
            Overlay,
            // SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                dataLoader: true,
                branches: [],
                staffShiftsData: [],
                filterForm: {
                    branch_id: null,
                    staff_id: null,
                    dateRange: {
                        startDate: new Date(),
                        endDate: new Date()
                    }
                },
                shiftForm: {
                    isUpdate: false,
                    staff: {},
                    date: new Date(),
                    first_shift: {
                        starts_at: null,
                        ends_at: null
                    },
                    second_shift: {
                        starts_at: null,
                        ends_at: null
                    },
                    repeats: "dont_repeat",
                    end_repeat: "ongoing",
                    specific_date: {
                        startDate: new Date(),
                        endDate: new Date()
                    }
                },
                isDeleteFormSubmitted: false
            }
        },
        created: async function () {
            const branchesResponse = await this.$http.get("branches?with-timings&with-staff")
            this.branches = branchesResponse.data

            if (this.$route.query.branch_id) {
                this.filterForm.branch_id = this.$route.query.branch_id
            } else {
                this.filterForm.branch_id = localStorage.getItem("branch_id") ?? this.branches[0].id
            }
            if (this.$route.query.date) {
                this.filterForm.dateRange = {
                    startDate: new Date(this.$route.query.date),
                    endDate: new Date(this.$route.query.date)
                }
            }

            this.showLoader = false
            
            await this.getShifts()
        },
        methods: {
            getShifts: function () {
                this.dataLoader = true
                this.$http.get("staff/shifts", {params: this.filterForm})
                .then(staffShiftsResponse => {
                    this.staffShiftsData = staffShiftsResponse.data
                    this.dataLoader = false
                })
            },
            getStaffTotalWorkingHours: function (weeklyShifts) {
                let staffTotalWorkingHours = 0
                weeklyShifts.forEach(weeklyShift => {
                    weeklyShift.timeslots.forEach(timeslot => {
                        const startTime = moment(timeslot.starts_at, "HH:mm:ss")
                        const endTime = moment(timeslot.ends_at, "HH:mm:ss")
                        const duration = moment.duration(endTime.diff(startTime))
                        staffTotalWorkingHours += parseInt(duration.asHours())
                    })
                })
                return staffTotalWorkingHours > 0 ? staffTotalWorkingHours + 'h' : "Not Working"
            },
            filteredDates: function (classes, date) {
                if (!classes.disabled) {
                    classes.disabled = date.getDay() != this.shiftForm.date.getDay() || date < this.shiftForm.date
                }
                return classes
            },
            newShiftFormModal: function (staff, index) {
                this.shiftForm.isUpdate = false
                this.shiftForm.staff = staff
                this.shiftForm.date = new Date(this.weekDates[index])
                this.shiftForm.specific_date = {
                    startDate: new Date(new Date(this.weekDates[index]).getTime() + 7 * 24 * 60 * 60 * 1000),
                    endDate: new Date(new Date(this.weekDates[index]).getTime() + 7 * 24 * 60 * 60 * 1000)
                }
                this.shiftForm.repeats = "dont_repeat"
                this.shiftForm.end_repeat = "ongoing"
                const branch = this.branches.find(branch => branch.id == this.filterForm.branch_id)
                const timings = branch.timings.find(timings => timings.day_of_week == this.shiftForm.date.getDay())
                this.shiftForm.first_shift.starts_at = timings.starts_at
                this.shiftForm.first_shift.ends_at = timings.ends_at
                this.$refs["shift-form-modal"].show()
            },
            editShiftFormModal: function (staffShift, index) {
                this.shiftForm.isUpdate = true
                this.shiftForm.staff = staffShift.staff
                this.shiftForm.date = new Date(staffShift.shifts[index].date)
                this.shiftForm.specific_date = {
                    startDate: new Date(new Date(staffShift.shifts[index].date).getTime() + 7 * 24 * 60 * 60 * 1000),
                    endDate: new Date(new Date(staffShift.shifts[index].date).getTime() + 7 * 24 * 60 * 60 * 1000)
                }
                this.shiftForm.first_shift.starts_at = staffShift.shifts[index].timeslots[0].starts_at
                this.shiftForm.first_shift.ends_at = staffShift.shifts[index].timeslots[0].ends_at
                this.shiftForm.repeats = staffShift.shifts[index].timeslots[0].repeats
                this.shiftForm.end_repeat = staffShift.shifts[index].timeslots[0].end_repeat

                if (staffShift.shifts[index].timeslots[0].repeats === "weekly" && staffShift.shifts[index].timeslots[0].end_repeat === "specific_date") {
                    this.shiftForm.specific_date = {
                        startDate: new Date(staffShift.shifts[index].timeslots[0].date_end),
                        endDate: new Date(staffShift.shifts[index].timeslots[0].date_end)
                    }
                }

                this.$refs["shift-form-modal"].show()
            },
            saveStaffShift: function (updateCurrentShiftOnly) {
                if (this.shiftForm.isUpdate && this.shiftForm.repeats === "weekly") {
                    this.$refs["update-upcoming-shifts-button"].displayLoader = true
                    this.$refs["update-this-shift-button"].displayLoader = true
                }
                let formData = {...this.shiftForm}
                formData["branch_id"] = this.filterForm.branch_id
                formData["staff_id"] = this.shiftForm.staff.id
                delete formData["staff"]

                if (updateCurrentShiftOnly) {
                    formData.repeats = "dont_repeat"
                    formData.end_repeat = null
                }

                this.$http.post("staff/shifts", formData)
                .then(response => {
                    if (this.shiftForm.isUpdate && this.shiftForm.repeats === "weekly") {
                        this.$refs["update-upcoming-shifts-button"].displayLoader = false
                        this.$refs["update-this-shift-button"].displayLoader = false
                    }
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.getShifts()
                    }
                })
            },
            showShiftUpdateModal: function () {
                if (this.shiftForm.isUpdate && this.shiftForm.repeats === "weekly") {
                    this.$refs["shift-form-modal"].hide()
                    this.$refs["shift-update-modal"].show()
                } else {
                    this.saveStaffShift(false)
                }
            },
            showShiftDeleteModal: function () {
                
            },
            deleteStaffShift: function () {
                this.isDeleteFormSubmitted = true
                const formData = {...this.shiftForm}
                this.$http.delete("staff/shifts", formData)
                .then(response => {
                    this.isDeleteFormSubmitted = false
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.getShifts()
                    }
                })
            }
        },
        computed: {
            branchEmployees: function () {
                let branchEmployees = []
                if (this.branches.length) {
                    const branch = this.branches.find(branch => branch.id == this.filterForm.branch_id)
                    if (branch.staff.length) {
                        branch.staff.forEach(branchStaff => {
                            branchEmployees.push({value: branchStaff.staff.id, text: branchStaff.staff.full_name})
                        })
                    }
                }
                return branchEmployees
            },
            weekDates: function () {
                let weekDates = []
                if (this.staffShiftsList.length) {
                    this.staffShiftsList[0].shifts.forEach(shift =>  {
                        weekDates.push(shift.date)
                    })
                }
                return weekDates
            },
            staffShiftsList: function () {
                return this.staffShiftsData.filter(staffShift => {
                    if (this.filterForm.staff_id) {
                        return staffShift.staff.id == this.filterForm.staff_id
                    }
                    return staffShift
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .staff-schedule-wrapper {
        @media (max-width : 1100px){
            width: 992px !important;
        }
        .staff-left {
            float: left;
            width: 20%;
            table {
                tbody {
                    tr {
                        td {
                            padding: 0;
                            height: 60px;
                            div {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                margin: 0 10px;
                            }
                        }
                    }
                }
            }
        }
        .weekdays {
            float: left;
            width: 80%;
            table {
                thead {
                    tr {
                        th {
                            width: calc(100% / 7);
                        }
                    }
                }
                tbody {
                    tr {
                        td {
                            padding: 0;
                            height: 60px;
                            div {
                                background: #b4dff2;
                                margin: 5px;
                                height: 49px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                border-radius: 2px;
                                &:hover {
                                    background: #c3e5f5;
                                }
                            }
                            .add-edit-shift {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                                span {
                                    visibility: hidden;
                                }
                                &:hover {
                                    span {
                                        visibility: visible;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>