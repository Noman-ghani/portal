<template>
    <b-input-group class="w-auto">
        <b-input-group-prepend v-if="!showDateFieldOnly">
            <b-button class="default">
                <b-icon-chevron-left />
            </b-button>
            <b-button @click="setToday()" class="default today">Today</b-button>
        </b-input-group-prepend>
        <date-range-picker :class="{'w-100': showDateFieldOnly}" time-picker v-model="dateRange" :singleDatePicker="singleDatePicker" auto-apply :ranges="ranges" :locale-data="{format: dateFormat}" v-on:update="onDateRangeSelected($event)" />
        <b-input-group-append v-if="!showDateFieldOnly">
            <b-button class="default">
                <b-icon-chevron-right />
            </b-button>
        </b-input-group-append>
    </b-input-group>
</template>
<script>
    import DateRangePicker from "vue2-daterange-picker"
    import "vue2-daterange-picker/dist/vue2-daterange-picker.css"
    import moment from "moment"

    export default {
        components: {
            DateRangePicker
        },
        props: {
            showDateFieldOnly: {
                type: Boolean,
                default: false
            },
            startOfMonth: {
                type: Boolean,
                default: false
            },
            ranges: {
                type: Boolean,
                default: false
            },
            singleDatePicker: {
                type: Boolean,
                default: false
            },
            dateFormat: {
                type: String,
                default: "dd mmm, yyyy"
            }
        },
        data: function () {
            return {
                dateRange: {
                    startDate: moment(new Date()),
                    endDate: moment(new Date())
                }
            }
        },
        created: function () {
            if (this.startOfMonth) {
                this.dateRange.startDate = moment().startOf("month")
            }

            this.$emit("created", this.dateRange)
        },
        methods: {
            setToday: function () {
                this.dateRange.startDate = moment(new Date())
                this.dateRange.endDate = moment(new Date())
                this.$emit('selected', this.dateRange)
            },
            onDateRangeSelected: function (dateRange) {
                dateRange.startDate = moment(dateRange.startDate)
                dateRange.endDate = moment(dateRange.endDate)
                this.$emit('selected', dateRange)
            }
        }
    }
</script>
<style scoped lang="scss">
    .default {
        color: var(--body-color);
        box-shadow: none;
        transform: none;
        font-weight: 500;
        line-height: 16px;
        text-transform: none;
        font-size: 10px;
        min-height: 40px;
        border-color: #d5d7da;
        background: #FFFFFF;
        min-width: 40px;
        @media screen and (max-width: 767px) {
           font-size: 12px;
           min-width: 20px;
           min-height: 20px;
           padding: 0.5rem 0.5rem !important;  
        }
    }
    .today {
        font-size: 15px;
        background: #dee3e7;
        @media screen and (max-width: 767px) {
            font-size: 12px;
        }
    }
    ::v-deep .form-control {
        // min-height: 40px;
        // border-radius: 0;
        // padding: 0.7rem 2rem !important;
        @media screen and (max-width: 767px) {
            font-size: 12px;
            // min-height: 20px;
            // padding: 0.5rem 0.5rem !important;
        }
    }
    ::v-deep .reportrange-text {
        padding: inherit;
        padding: 0.7rem 0.7rem;
    }
    ::v-deep .daterangepicker {
        .calendar-table {
            td, th {
                font-size: 15px;
                padding: 10px 0;
            }
        }
        td {
            &.active {
                background-color: var(--primary);
                &:hover {
                    background-color: var(--primary);
                }
            }
            &.start-date.end-date {
                border-radius: 25px;
            }
        }
        .drp-calendar {
            width: 400px;
            max-width: 400px;
        }
    }
</style>