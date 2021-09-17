<template>
    <div>
        <b-form-group>
            <b-form-radio-group
                id="client-groups"
                v-model="selected_filter"
                @change="onSelectFilter"
                name="radio-sub-component">
                <b-form-radio value="new_clients">
                    <span class="d-flex justify-content-between">
                        New clients 
                        <span class="modify pointer" v-if="filter.new_clients.selected" @click="$refs.modal.show()">Modify</span>
                    </span>
                    <small class="description text-muted d-block">Clients added in the last {{filter.new_clients.day_limit}} {{filter.new_clients.type}}</small>
                </b-form-radio>
                <b-form-radio value="recent">
                    <span class="d-flex justify-content-between">
                        Recent clients 
                        <span class="modify pointer" v-if="filter.recent.selected" @click="$refs.modal.show()">Modify</span>
                    </span>
                    <small class="description text-muted d-block">Clients with their first sale in the last {{filter.recent.day_limit}} {{filter.recent.type}}</small>
                </b-form-radio>
                <b-form-radio value="loyal">
                    <span class="d-flex justify-content-between">
                        Loyal clients 
                        <span class="modify pointer" v-if="filter.loyal.selected" @click="$refs.modal.show()">Modify</span>
                    </span>
                    <small class="description text-muted d-block">Clients with {{filter.loyal.sales}} or more sales, within the last {{filter.loyal.months}} month period.</small>
                </b-form-radio>
                <b-form-radio value="lapsed">
                    <span class="d-flex justify-content-between">
                        Lapsed clients 
                        <span class="modify pointer" v-if="filter.lapsed.selected" @click="$refs.modal.show()">Modify</span>
                    </span>
                    <small class="description text-muted d-block">Clients with at least {{filter.lapsed.sales}} sales anytime in the last {{filter.lapsed.months}} months, but did not return in the last {{filter.lapsed.not_return}} months</small>
                </b-form-radio>
                <b-form-radio value="online_booking">
                    <span class="d-flex justify-content-between">
                        Online booking clients 
                        <span class="modify pointer" v-if="filter.online_booking.selected" @click="$refs.modal.show()">Modify</span>
                    </span>
                    <small class="description text-muted d-block">Clients who have previously booked an appointment online</small>
                </b-form-radio>
                <b-form-radio value="appointment">
                    <span class="d-flex justify-content-between">
                        Clients by appointment date
                        <span class="modify pointer" v-if="filter.appointment.selected" @click="$refs.modal.show()">Modify</span>
                    </span>
                    <small class="description text-muted d-block">Clients with appointments scheduled from 23 Aug 2021 to 22 Sep 2021</small>
                </b-form-radio>
                <b-form-radio value="birthday">
                    <span class="d-flex justify-content-between">
                        Clients by birthday
                        <span class="modify pointer" v-if="filter.birthday.selected" @click="$refs.modal.show()">Modify</span>
                    </span>
                    <small class="description text-muted d-block">Clients with their birthday in {{$helpers.getMonthNameFromNum(filter.birthday.select_month, 'MMMM')}}</small>
                </b-form-radio>
                <b-form-radio value="spend">
                    <span class="d-flex justify-content-between">
                        Top spending clients
                        <span class="modify pointer" v-if="filter.spend.selected" @click="$refs.modal.show()">Modify</span>
                    </span>
                    <small class="description text-muted d-block">Clients that have spent over A {{$store.getters.user.business.country.currency}}{{filter.spend.total}} in the last 6 months</small>
                </b-form-radio>
            </b-form-radio-group>
        </b-form-group>
        <b-modal ref="modal" 
            v-if="selected_filter"
            ok-title="Save" 
            body-class="p-0" 
            centered 
            :title="selected_filter.replaceAll('_', ' ')"
            @hidden="$emit('closed')"
            @ok="handleOk">
                <b-form ref="form" class="pt-4">
                    <!-- New Clients Fields -->
                    <div class="w-100 d-flex align-items-end" v-if="selected_filter == 'new_clients'">
                        <b-form-group id="days-limit-wrap1" label="Clients added in the last" label-for="days-limit1" class="col-sm-6">
                            <b-form-input
                            id="days-limit1"
                            v-model="filter.new_clients.day_limit"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group id="days-type-wrap1" label=" " label-for="days-type" class="col-sm-6">
                            <b-input-group class="phone">
                                    <b-input-group-text class="p-0 w-100">
                                        <div class="select-wrap w-100">
                                            <b-form-select
                                            id="days-type2"
                                            class="w-100 border-0"
                                            v-model="filter.new_clients.type">
                                                <b-form-select-option value="days">Days</b-form-select-option>
                                                <b-form-select-option value="weeks">Week</b-form-select-option>
                                                <b-form-select-option value="months">Month</b-form-select-option>
                                            </b-form-select>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-input-group-text>
                            </b-input-group>
                        </b-form-group>
                    </div>
                    <!-- Recent Clients Fields -->
                    <div class="w-100 d-flex align-items-end" v-if="selected_filter == 'recent'">
                        <b-form-group id="days-limit-wrap2" label="Clients with first sale in the last" label-for="days-limit2" class="col-sm-6">
                            <b-form-input
                            id="days-limit2"
                            v-model="filter.recent.day_limit"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group id="days-type-wrap2" label=" " label-for="days-type" class="col-sm-6">
                            <b-input-group class="phone">
                                    <b-input-group-text class="p-0 w-100">
                                        <div class="select-wrap w-100">
                                            <b-form-select
                                            id="days-type2"
                                            class="w-100 border-0"
                                            v-model="filter.recent.type">
                                                <b-form-select-option value="days">Days</b-form-select-option>
                                                <b-form-select-option value="weeks">Week</b-form-select-option>
                                                <b-form-select-option value="months">Month</b-form-select-option>
                                            </b-form-select>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-input-group-text>
                            </b-input-group>
                        </b-form-group>
                    </div>
                    <!-- Loyal Clients -->
                    <div class="w-100 d-flex align-items-end flex-wrap" v-if="selected_filter == 'loyal'">
                        
                        <b-form-group id="sales-wrap" label="Clients with at least" label-for="loyal-sales" class="col-sm-12">
                            <b-input-group class="mt-3 w-100">
                                <template #append>
                                    <b-input-group-text>Sales</b-input-group-text>
                                </template>
                                <b-form-input id="loyal-sales" v-model="filter.loyal.sales"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group id="loyal-months-wrap" label="within the last" label-for="loyal-months" class="col-sm-12">
                            <b-input-group class="mt-3 w-100">
                                <template #append>
                                    <b-input-group-text>Months</b-input-group-text>
                                </template>
                                <b-form-input id="loyal-months" v-model="filter.loyal.months"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group id="spend-wrap" label="who spent" label-for="spend" class="col-sm-12">
                            <b-input-group class="phone">
                                    <b-input-group-text class="p-0 w-100">
                                        <div class="select-wrap w-100">
                                            <b-form-select
                                            id="spend"
                                            @change="filter.loyal.money = 0"
                                            class="w-100 border-0"
                                            v-model="filter.loyal.spend">
                                                <b-form-select-option value="any">any amount</b-form-select-option>
                                                <b-form-select-option value="at-least">at least</b-form-select-option>
                                            </b-form-select>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-input-group-text>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group v-if="filter.loyal.spend == 'at-least'" id="spend-money-wrap" label="Clients have spend" label-for="spend-money" class="col-sm-12">
                            <b-input-group class="mt-3 w-100">
                                <template #prepend>
                                    <b-input-group-text>{{$store.getters.user.business.country.currency}}</b-input-group-text>
                                </template>
                                <b-form-input id="spend-money" v-model="filter.loyal.money"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                    </div>
                    <!-- Lapsed Clients -->
                    <div class="w-100 d-flex align-items-end flex-wrap" v-if="selected_filter == 'lapsed'">
                        <b-form-group id="lapsed-sales-wrap" label="Clients with at least" label-for="lapsed-sales" class="col-sm-12">
                            <b-input-group class="mt-3 w-100">
                                <template #append>
                                    <b-input-group-text>Sales</b-input-group-text>
                                </template>
                                <b-form-input id="lapsed-sales" v-model="filter.lapsed.sales"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group id="lapsed-months-wrap" label="within the last" label-for="lapsed-months" class="col-sm-12">
                            <b-input-group class="mt-3 w-100">
                                <template #append>
                                    <b-input-group-text>Months</b-input-group-text>
                                </template>
                                <b-form-input id="lapsed-months" v-model="filter.lapsed.months"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group id="lapsed-not-return-wrap" label="who did not return in the last" label-for="lapsed-not-return" class="col-sm-12">
                            <b-input-group class="mt-3 w-100">
                                <template #append>
                                    <b-input-group-text>Months</b-input-group-text>
                                </template>
                                <b-form-input id="lapsed-not-return" v-model="filter.lapsed.not_return"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                    </div>
                    <!-- Online Booking Clients -->
                    <div v-if="selected_filter == 'online_booking'">
                        <b-form-group class="col-sm-12">
                            <b-form-radio-group
                                id="online_booking"
                                v-model="filter.online_booking.data"
                                :options="online_booking_options">
                            </b-form-radio-group>
                        </b-form-group>
                    </div>
                    <!-- Appointment Date Clients -->
                    <div v-if="selected_filter == 'appointment'">
                        <b-form-group id="app-schedule-wrap" label="Appointment scheduled in" label-for="app-schedule" class="col-sm-12">
                            <b-input-group class="phone">
                                    <b-input-group-text class="p-0 w-100">
                                        <div class="select-wrap w-100">
                                            <b-form-select
                                            id="app-schedule"
                                            class="w-100 border-0"
                                            v-model="filter.appointment.date_type">
                                                <b-form-select-option value="custom-date">Custom Dates</b-form-select-option>
                                                <b-form-select-option value="last_90_days">The last 90 days</b-form-select-option>
                                                <b-form-select-option value="last_30_days">The last 30 days</b-form-select-option>
                                                <b-form-select-option value="last_7_days">The last 7 days</b-form-select-option>
                                                <b-form-select-option value="next_7_days">The next 7 days</b-form-select-option>
                                                <b-form-select-option value="next_30_days">The next 30 days</b-form-select-option>
                                                <b-form-select-option value="next_90_days">The next 90 days</b-form-select-option>
                                            </b-form-select>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-input-group-text>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group v-if="filter.appointment.date_type == 'custom-date'" id="date-from-wrap" label="Date From" label-for="date-from" class="col-sm-12">
                            <b-input-group class="phone">
                                    <b-input-group-text class="p-0 w-100">
                                        <div class="select-wrap w-100">
                                            <b-form-datepicker id="date-from" v-model="filter.appointment.date_from" ></b-form-datepicker>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-input-group-text>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group v-if="filter.appointment.date_type == 'custom-date'" id="date-to-wrap" label="Date To" label-for="date-to" class="col-sm-12">
                            <b-input-group class="phone">
                                    <b-input-group-text class="p-0 w-100">
                                        <div class="select-wrap w-100">
                                            <b-form-datepicker id="date-to" v-model="filter.appointment.date_to" ></b-form-datepicker>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-input-group-text>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group id="staff-wrap" label="Appointments booked with" label-for="staff" class="col-sm-12">
                            <b-input-group class="phone">
                                    <b-input-group-text class="p-0 w-100">
                                        <div class="select-wrap w-100">
                                            <b-form-select
                                            id="staff"
                                            v-if="!showLoader"
                                            class="w-100 border-0"
                                            v-model="filter.appointment.staff"
                                            :options="staff_options"
                                            >
                                            </b-form-select>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-input-group-text>
                            </b-input-group>
                        </b-form-group>

                    </div>
                    <!-- Birthday Clients Fields -->
                    <div class="w-100 d-flex align-items-end" v-if="selected_filter == 'birthday'">
                        <b-form-group id="biethday-wrap" label="Clients with how have birthday in " label-for="birthday" class="col-sm-12">
                            <b-input-group class="phone">
                                    <b-input-group-text class="p-0 w-100">
                                        <div class="select-wrap w-100">
                                            <b-form-select
                                            id="birthday"
                                            v-if="filter.birthday.upcomming_months.length > 0"
                                            class="w-100 border-0"
                                            v-model="filter.birthday.select_month">
                                                <b-form-select-option :value="month" v-for="(month,idx) in filter.birthday.upcomming_months" :key="idx">
                                                    {{$helpers.getMonthNameFromNum(month, 'MMMM')}}
                                                </b-form-select-option>
                                            </b-form-select>
                                            <span class="select-icon">
                                                <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                            </span>
                                        </div>
                                    </b-input-group-text>
                            </b-input-group>
                        </b-form-group>
                    </div>
                    <!-- Top Spending Clients -->
                    <div class="w-100 d-flex align-items-end flex-wrap" v-if="selected_filter == 'spend'">
                        <b-form-group id="total-spend-wrap" label="Clients have spend" label-for="total-spend" class="col-sm-12">
                            <b-input-group class="mt-3 w-100">
                                <template #prepend>
                                    <b-input-group-text>{{$store.getters.user.business.country.currency}}</b-input-group-text>
                                </template>
                                <b-form-input id="total-spend" v-model="filter.spend.total"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group id="spend-months-wrap" label="within the last" label-for="spend-months" class="col-sm-12">
                            <b-input-group class="mt-3 w-100">
                                <template #append>
                                    <b-input-group-text>Months</b-input-group-text>
                                </template>
                                <b-form-input id="spend-months" v-model="filter.spend.months"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                    </div>
                </b-form>
        </b-modal>
    </div>
</template>
<script>
import moment from "moment"
    export default {
        props: {
            get_filter: null
        },
        data: function () {
            return {
                showLoader: true,
                selected_filter: null,
                selectedClients: [],
                filter:{
                    new_clients: {
                        day_limit: 30,
                        type: 'days',
                        selected: false
                    },
                    recent: {
                        day_limit: 30,
                        type: 'days',
                        selected: false
                    },
                    loyal: {
                        sales: 3,
                        months: 2,
                        spend: 'any',
                        money: 0,
                        selected: false
                    },
                    lapsed: {
                        sales: 3,
                        months: 6,
                        not_return: 2,
                        selected: false
                    },
                    online_booking: {
                        data: 'have-online-bookings',
                        selected: false
                    },
                    appointment:{
                        date_type: 'custom-date',
                        date_from : null,
                        date_to: new Date(),
                        staff: 0,
                        selected: false
                    },
                    birthday: {
                        select_month: null,
                        upcomming_months: [],
                        selected: false
                    },
                    spend: {
                        total: 500,
                        months: 6,
                        selected: false
                    },                    
                },
                staff_options: [{
                        value: 0,
                        text: "Any Staff"
                }],
                online_booking_options: [{
                        value: 'have-online-bookings',
                        text: "Clients who have previously booked an appointment online"
                },{
                        value: 'no-online-bookings',
                        text: "Clients with no online bookings"
                }]
            }
        },
        created: function(){
            var d = new Date();
            d.setMonth(d.getMonth() - 1);
            this.filter.appointment.date_from = d;
        },
        mounted: function(){
            if (this.get_filter in this.filter) {
                this.filter[this.get_filter].selected = true
                this.selected_filter = this.get_filter
            }
            
            this.filter.birthday.select_month = moment(new Date()).format("M");
            let current_month = moment(new Date());
            this.filter.birthday.upcomming_months.push(current_month.format("M"));                        
            for (let i = 1; i < 12; i++) {
                this.filter.birthday.upcomming_months.push(moment(current_month).add(i, 'M').format("M"));                        
            }
            

            console.log(this.filter.birthday.upcomming_months);
        },
        watch: {
            selected_filter : function(filter){
                if(filter){
                    switch (filter) {
                        case 'appointment':
                            this.$http.get('staff')
                            .then(res => {
                                res.data.forEach(staff => {
                                    this.staff_options.push({
                                        value: staff.id,
                                        text: staff.full_name
                                    });
                                });
                                this.showLoader = false
                            })    
                        break;
                    }
                }
            },
        },
        methods: {
            onSelectFilter: function(){
                
                for (let value of Object.keys(this.filter)) {
                   this.filter[value].selected = false; 
                }

                this.filter[this.selected_filter].selected = true

                let parameters = {
                    'with-phone-country': true,
                    'filter': {}
                }
                parameters.filter[this.selected_filter] = this.filter[this.selected_filter];
                
                this.$http.get("clients",{params: parameters})
                .then(clients => {
                    let emitData = {
                        'clients': clients.data,
                        'filter': parameters.filter
                    }
                    this.$emit('selected', emitData);
                })
                
            },
            handleOk: function(){
                this.onSelectFilter();   
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .modal{
    .modal-title{
        text-transform: capitalize;
    }
}
</style>