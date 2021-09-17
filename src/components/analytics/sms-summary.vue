<template>
    <overlay :show="showLoader" full-height-with-heading>
        <template v-if="!showLoader">
            <router-link :to="{name: 'analytics.index'}"><b-icon-arrow-left></b-icon-arrow-left> Reports</router-link>
            <p class="mt-2 mb-3 font-size-24 font-weight-800">SMS Summary</p>
            <b-row>
                <b-col md="6" :class="{'mb-3': $screen.width < 768}">
                    <div class="form-control d-flex align-items-center" style="max-width: 350px;">
                        <b-icon-calendar-fill class="mr-2"></b-icon-calendar-fill>
                        <date-range-picker @update="fetchData()" control-container-class="" :locale-data="{firstDay: 1, format: 'mmmm dd, yyyy'}" show-dropdowns v-model="form.dateRange"></date-range-picker>
                    </div>
                </b-col>
            </b-row>
            <overlay :show="dataLoader" class="mt-4 data-wrapper">
                <template v-if="!dataLoader">
                    <b-table class="mt-4 report-table" responsive hover :fields="data.fields" :items="data.items">
                        <template #cell(message)="data">
                            <span style="white-space: pre;">{{data.item.message}}</span>
                        </template>
                        <template #cell(created_at)="data">
                            {{$helpers.formatDateTime(data.item.created_at)}}
                        </template>
                    </b-table>
                </template>
            </overlay>
        </template>
    </overlay>
</template>
<script>
    import DateRangePicker from "vue2-daterange-picker"
    import moment from "moment"
    import Overlay from "@/components/helpers/overlay.vue"

    export default {
        components: {
            DateRangePicker,
            Overlay
        },
        data: function () {
            return {
                showLoader: false,
                dataLoader: true,
                data: {
                    fields: [
                        {key: "mobile_number"},
                        {key: "message"},
                        {key: "created_at", label: "Sent On"}
                    ],
                    items: []
                },
                form: {
                    dateRange: {
                        startDate: this.$route.query.start_date ?? moment().startOf("month"),
                        endDate: this.$route.query.end_date ?? moment().endOf("month")
                    }
                }
            }
        },
        created: function () {
            this.fetchData()
        },
        methods: {
            reset: function () {
                this.form = {
                    dateRange: {
                        startDate: moment().startOf("month"),
                        endDate: moment().endOf("month")
                    }
                }
            },
            fetchData: function () {
                history.pushState({}, null, this.$route.path + '?' + new URLSearchParams(this.query).toString())

                this.dataLoader = true
                this.$http.get("reports/sms-summary", {params: this.query})
                .then(response => {
                    this.data.items = response.data
                    this.dataLoader = false
                })
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
<style scoped lang="scss">
    .data-wrapper {
        min-height: calc(100vh - 275px);
    }

::v-deep .vue-daterange-picker{
    font-size: 12px;
    line-height: 1.9;
}

::v-deep .report-table{
    table{
        @media (max-width: 540px) {
               width: 540px;
            }
        }
        tr{
            td:nth-child(2){
                max-width: 190px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
</style>