<template>
    <b-container fluid>
        <overlay :show="showDataLoader" full-height>
            <template v-if="!showDataLoader">
                <div v-if="'action' in $route.query" class="fixed-top bg-info px-3 py-4">
                    <div class="d-flex">
                        <p class="m-0 text-white font-size-20 font-weight-600 flex-grow-1 text-center">Select a time to book</p>
                        <b-icon-x @click="$router.push({name: 'calendar'})" class="text-white pointer" font-scale="2"></b-icon-x>
                    </div>
                </div>
                <div class="d-flex justify-content-between pt-3" v-if="$screen.width <= 768">
                    <b-button variant="primary" @click="showPopup"><b-icon-list /> Filters</b-button>
                    <dropdown right no-caret text="Add New" variant="primary" class="ml-3">
                        <b-dropdown-item :to="{name: 'calendar.appointments', query: {branch_id: form.branch_id, date: $helpers.formatDate(form.date.startDate, 'YYYY-MM-DD')}}">New Appointment</b-dropdown-item>
                        <b-dropdown-item :to="{name: 'checkout', query: {branch_id: form.branch_id}}">New Sale</b-dropdown-item>
                    </dropdown>
                </div>
                <div class="pt-3 justify-content-between cal-options-row" ref="calOptions">
                <div class="close-popup" ref="popupBG" @click="closePopup" v-if="$screen.width <= 768"></div>
                    <div class="d-flex align-items-center half-col">
                        <b-form-select @change="setDefaultLocation($event)" v-model="form.branch_id" :options="branches" value-field="id" text-field="name">
                            <template #first>
                                <b-form-select-option :value="null">Select Branch</b-form-select-option>
                            </template>
                        </b-form-select>
                        <b-form-select v-model="form.staff_id" :options="branchStaff" class="ml-3">
                            <template #first>
                                <b-form-select-option :value="null">Select Staff</b-form-select-option>
                            </template>
                        </b-form-select>
                    </div>
                    <div class="d-flex align-items-center half-col">
                        <div class="form-control pointer d-flex align-items-center px-3 date-picker-wrap">
                            <b-icon-calendar-fill class="mr-3"></b-icon-calendar-fill>
                            <date-range-picker @update="getTimeSlots()" control-container-class="" :locale-data="{firstDay: 1, format: 'mmmm dd, yyyy'}" single-date-picker show-dropdowns v-model="form.date"></date-range-picker>
                        </div>
                        <dropdown right no-caret text="Add New" variant="primary" class="ml-3 cal-btns" v-if="$screen.width > 768">
                            <b-dropdown-item :to="{name: 'calendar.appointments', query: {branch_id: form.branch_id, date: $helpers.formatDate(form.date.startDate, 'YYYY-MM-DD')}}">New Appointment</b-dropdown-item>
                            <b-dropdown-item :to="{name: 'checkout', query: {branch_id: form.branch_id}}">New Sale</b-dropdown-item>
                        </dropdown>
                        <b-button variant="transparent" class="bg-danger text-white w-100 close-btn" @click="closePopup" v-if="$screen.width <= 768">Close</b-button>
                    </div>
                </div>
                <overlay :show="showCalendarLoader" full-height-with-heading>
                    <template v-if="!showCalendarLoader">
                        <div class="mt-4 d-flex w-100 pl-2 pr-4 cal-layout-wrap">
                            <ul class="hours-rows d-flex flex-wrap">
                                <li v-for="(hours,idx) in timeSlots" v-bind:key="idx" class="d-flex align-items-center">
                                    <span class="hour">
                                        <div class="d-flex align-items-center justify-content-center text-center">
                                            {{hours.time}}
                                        </div>
                                    </span>
                                </li>
                            </ul>
                            <div class="d-flex w-100 cal-layout">
                                <ul v-for="(branch, idx) in displayStaff" v-bind:key="idx" class="flex-grow-1 border-bottom">
                                    <li class="text-center staff-details">
                                        <b-img-lazy v-if="branch.staff.profile_image" :src="branch.staff.profile_image + '?' + new Date().getTime()"></b-img-lazy>
                                        <b-badge v-else pill :class="'first-letter d-flex justify-content-center align-items-center bg-' + branch.staff.appointment_color.replace('#', '')">{{branch.staff.first_name.charAt(0)}}</b-badge>
                                        <p class="staff-name m-0">{{branch.staff.full_name}}</p>
                                    </li>
                                    <li v-for="(hours, idx) in timeSlots" v-bind:key="idx">
                                        <ul class="mins-rows bg-light flex-grow-1 border-bottom">
                                            <li v-for="(mins, idx) in hours.subtime" v-bind:key="idx" class="minutes border-left border-top border-right">
                                                <template v-if="mins.value in bookings">
                                                    <template v-if="branch.staff.id in bookings[mins.value]">
                                                        <router-link :to="{name: 'calendar.appointments.view', params: {id: book.appointment.id}}" v-bind:key="idx" v-for="(book, idx) in bookings[mins.value][branch.staff.id]" :style="'left: calc((' + idx + ' * 100%) / ' + (bookings[mins.value][branch.staff.id]).length + ' - 1px); width: calc(100% / ' + (bookings[mins.value][branch.staff.id]).length + ' - 2px); height: ' + (((book.duration / 15) * 30) - 3) + 'px; background: ' + (book.appointment.status === 'no-show' ? '#f67a6f' : book.service.category.color)"  class="bookedAppoint">
                                                            <p class="m-0">
                                                                <span class="font-size-12 d-inline-block mr-3">{{fromAndToTime(book)}}</span>
                                                                <span v-if="book.appointment.client" class="font-weight-700">{{book.appointment.client.first_name}} {{book.appointment.client.last_name}}</span>
                                                                <span v-else class="font-weight-700">Walk-In</span>
                                                            </p>
                                                            <p class="m-0 font-size-12">{{book.service.title}}</p>
                                                            <div class="client-details bg-white text-dark border" :style="'bottom:'+ (((book.duration * 2) / 30) * 2) * 10 + 'px;'">
                                                                <div class="d-flex align-items-center pt-3 pl-3 pr-3 pb-1">
                                                                    <b-avatar class="mr-3"></b-avatar>
                                                                    <div class="detail flex-grow-1">
                                                                        <template v-if="book.appointment.client">
                                                                            <h4 class="mb-0">{{book.appointment.client.first_name}} {{book.appointment.client.last_name}}</h4>
                                                                            <p class="num mb-0">
                                                                                +{{book.appointment.client.phone_country.phone_code}} {{book.appointment.client.phone_number | VMask(book.appointment.client.phone_country.phone_mask)}}
                                                                            </p>
                                                                        </template>
                                                                        <template v-else>
                                                                            <h4 class="mb-0">Walk-In</h4>
                                                                        </template>
                                                                    </div>
                                                                </div>
                                                                <p class="m-0 ml-3 mt-1 font-italic" v-if="book.appointment.notes">{{book.appointment.notes}}</p>
                                                                <div class="extra-info border-top d-flex justify-content-between mt-2">
                                                                    <div class="left">
                                                                        <div class="time">
                                                                            <span class="start">
                                                                                {{fromAndToTime(book)}}
                                                                                <span :class="{'font-size-10': true, 'text-danger': book.appointment.status === 'no-show', 'text-primary': book.appointment.status !== 'no-show'}">
                                                                                    {{humanreadable(book.appointment.status)}}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div class="service-name">
                                                                            <span class="category">{{book.service.title}}</span>
                                                                        </div>
                                                                        <div class="summary">
                                                                            <span>{{getDuration(book.duration)}} with {{book.staff.first_name}} {{book.staff.last_name}}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="right">
                                                                        <p class="special-price">
                                                                            {{$store.getters.user.business.country.currency}} {{book.price}}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </router-link>
                                                    </template>
                                                </template>
                                                <router-link :to="{name: 'calendar.appointments', query: {...$route.query, ...{date: $helpers.formatDate(form.date.startDate, 'YYYY-MM-DD'), branch_id: form.branch_id, start_time: mins.value, staff_id: branch.staff.id}}}" class="w-100 float-left">{{mins.text}}</router-link>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                </overlay>
            </template>
        </overlay>
    </b-container>
</template>
<script>
    import Vue from "vue"
    import VueScreen from "vue-screen"
    import VMask from "v-mask"
    import DateRangePicker from "vue2-daterange-picker"
    import Overlay from "../helpers/overlay.vue"
    import Dropdown from "../helpers/dropdown.vue"
    import moment from "moment"

    Vue.use(VMask)
    Vue.use(VueScreen)

    export default {
        components: {
            DateRangePicker,
            Overlay,
            Dropdown
        },
        data: function () {
            return {
                showDataLoader: true,
                showCalendarLoader: true,
                form: {
                    branch_id: this.$store.getters.user.business.default_branch_id,
                    staff_id: null,
                    date: {
                        startDate: new Date(),
                        endDate: new Date()
                    }
                },
                branches: [],
                timeSlots: [],
                bookings: []
            }
        },
        created: async function () {
            const branchesWithStaffResponse = await this.$http.get("branches?with-staff=true&with-timings=true")
            this.branches = branchesWithStaffResponse.data
            this.showDataLoader = false
            this.getTimeSlots()
        },
        computed: {
            currentBranch: function () {
                return this.branches.find(branch => branch.id == this.form.branch_id) ?? {}
            },
            displayStaff: function () {
                let staff = []
                
                if (Object.keys(this.currentBranch).length) {
                    staff = this.currentBranch.staff

                    if (this.form.staff_id) {
                        staff = staff.filter(row => row.staff.id == this.form.staff_id)
                    }
                }

                return staff
            },
            branchStaff: function () {
                let branchStaff = []
                
                if (this.form.branch_id && Object.keys(this.currentBranch).length) {
                    this.currentBranch.staff.forEach(staff => {
                        branchStaff.push({value: staff.staff.id, text: staff.staff.full_name})
                    })
                }

                return branchStaff
            }
        },
        methods: {
            humanreadable: function (status) {
                if (status === "no-show") {
                    return "NO SHOW"
                }

                return status.toUpperCase()
            },
            setDefaultLocation: function (branch_id) {
                this.$http.put("business/settings", {default_branch_id: branch_id})
                this.$store.dispatch("updateBusinessData", {...this.$store.getters.user.business, ...{default_branch_id: branch_id}})
                this.getTimeSlots()
            },
            getTimeSlots: async function () {
                this.showCalendarLoader = true
                const weekday = this.form.date.startDate.getDay()
                const dayTimings = this.currentBranch.timings.find(time => time.day_of_week == weekday)
                
                let startTime = moment(this.$helpers.formatDate(this.form.date.startDate, "YYYY-MM-DD") + " " + dayTimings.starts_at).toDate()
                let endTime = moment(this.$helpers.formatDate(this.form.date.startDate, "YYYY-MM-DD") + " " + dayTimings.ends_at).toDate()
                this.timeSlots = []

                while (startTime <= endTime) {
                    let subtime = []
                    for (let i = 0; i <= 45; i++) {
                        if (i % 15 == 0 && startTime) {
                            subtime.push({
                                text: moment(startTime).add(i, "minutes").format(this.$helpers.timeFormat()).replace(/\s/g, ''),
                                value: moment(startTime).add(i, "minutes").format("HH:mm:ss").replace(/\s/g, '')
                            })
                        }
                    }
                    
                    this.timeSlots.push({
                        time: moment(startTime).format(this.$helpers.timeFormat()).replace(/\s/g, ''),
                        date: startTime,
                        subtime: subtime
                    })
                    
                    startTime = moment(startTime).add(1, "hours").toDate()
                }

                this.bookings = []
                const appointmentsResponse = await this.$http.get("appointments?for_calendar=1&branch_id=" + this.form.branch_id + "&date=" + moment(this.form.date.startDate).format("YYYY-MM-DD"))
                appointmentsResponse.data.forEach(row => {
                    const startTime = row.start_time
                    
                    if (!(startTime in this.bookings)) {
                        this.bookings[startTime] = {}
                    }

                    if (!(row.staff.id in this.bookings[startTime])) {
                        this.bookings[startTime][row.staff.id] = []
                    }

                    this.bookings[startTime][row.staff.id].push({
                        appointment: row.appointment,
                        staff: row.staff,
                        service: row.service,
                        duration: row.duration,
                        start_time: row.start_time,
                        end_time: row.end_time,
                        price: row.price
                    })
                })

                this.showCalendarLoader = false
            },
            fromAndToTime: function (booking) {
                return this.$helpers.formatTime(booking.appointment.booking_date + " " + booking.start_time) + " - " + this.$helpers.formatTime(booking.appointment.booking_date + " " + booking.end_time)
            },
            getDuration: function (duration) {
                return this.$store.getters.user.settings.durations.filter(row => row.value == duration)[0].text
            },
            closePopup: function(){
                this.$refs.calOptions.style.display = "none"
                this.$refs.popupBG.style.display = "none"
            },
            showPopup: function() {
                this.$refs.calOptions.style.display = "flex"
                this.$refs.popupBG.style.display = "flex"
            }
        }
    }
</script>
<style lang="scss" scoped>
    @media screen and (max-width:1520px) {
        .cal-header > .col-md-5,.cal-header > .col-md-7{
            flex: 0 0 100% !important;
            max-width: 100% !important;
        }
    }
    .hours-rows {
        max-width: 45px;
        margin-top: 98px;
        @media(max-width:768px){
            flex-shrink: 0;
        }
        .hour {
            text-align: right;
            font-size: 14px;
            font-weight: 700;
            line-height: 1;
            margin-top: -5px;
            word-break: break-all;
        }
    }
    .mins-rows {
        .minutes {
            background: #FFFFFF;
            font-size: 0;
            min-height: 30px;
            display: flex;
            align-items: center;
            position: relative;
            padding-left: 4px;
            &:hover {
                font-size: 13px;
                cursor: pointer;
                background: #e5f1ff;
                color: #0C56C9;
            }
        }
    }
    .staff-details {
        padding: 10px;
        .first-letter {
            height: 40px;
            width: 40px;
            color: #FFF;
            margin: 0 auto 5px;
            font-weight: 700;
            font-size: 20px;
        }
        .staff-name {
            font-size: 14px;
        }
        img {
            height: 44px;
            width: 44px;
            border-radius: 100%;
        }
    }
    .bookedAppoint {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% - 2px);
        padding: 4px 4px 4px 8px;
        border-radius: 4px;
        font-size: 14px;
        color: #000000;
        z-index: 2;
        margin: 1px;
        &:hover{
            .client-details{
                display: block;
            }
        }
        .font-size-12 {
            font-size: 12px;
        }
        .client-details{
            position: absolute;
            left: 0;right: 0;
            margin: 0 auto;
            background: #FFF;
            width: 100%;
            max-width: 380px;
            box-shadow: 0 10px 10px rgb(0 0 0 / 40%);
            border-radius: 5px;
            z-index: 9999;
            display: none;
            &:after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                border-top: 10px solid white;
                border-right: 10px solid transparent;
                border-left: 10px solid transparent;
                margin: auto;
                width: 10px;
                box-shadow: 0 10px 10px rgb(0 0 0 / 40%);
            }
            .extra-info{
                color: #9093a5;
                font-weight: 400;
                font-size: 14px;
                padding: 10px;
                .service-name,.special-price {
                    color: #1a1a1a;
                    font-weight: 700;
                    margin: 5px 0;
                    font-size: 16px;
                }
                .special-price{
                    margin: 0;
                }
                .special-price ~ .regular-price {
                    text-decoration: line-through;
                }
            }
        }
    }
.cal-options-row{
    display: flex;
    @media(max-width:768px){
        display: none;
        flex-wrap: wrap;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        width: 100%;
        height: 100vh;
        align-content: flex-start;
        padding: 10px;
        max-width: 420px;
        margin: auto;
        .half-col{
            z-index: 1;
            width: 100%;
            flex-wrap: wrap;
            justify-content: flex-end;
            select,.date-pick{
                width: 100%;
                margin:0 0 10px !important;
                border: none;
            }
            .date-pick{
                border-bottom-left-radius: 7px;
                border-bottom-right-radius: 7px;  
            }
            .close-btn{
                text-transform: capitalize;
                margin-top: 10px;
                border-radius:7px;
                font-size: 16px;
                position: absolute;
                bottom: 20px;
                left: 0;
            }
        }
        .close-popup{
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(103,118,140,.5);
        }
    }
}
.cal-layout-wrap{
    overflow: auto;
    padding-bottom: 80px;
    .cal-layout{
        @media(max-width:768px){
            min-width: 767px;
            flex-wrap: wrap;
        }
    }
}
.date-picker-wrap{
    @media(max-width:768px){
        //    position: absolute;
        //     top: 10px;
        //     left: 0;
        }
}
</style>