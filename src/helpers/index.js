import Vue from "vue"
import Store from "../store"
import moment from "moment"

const formatAsCurrency = (value) => parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')

Vue.filter("uppercase_first_each", (value) => {
    if (value) {
        return value[0].toUpperCase() + value.substring(1)
    }

    return ""
})

Vue.filter("currency", (value) => {
    if (value) return formatAsCurrency(value)

    return value
})

Vue.filter("uppercase", (value) => {
    if (value) {
        return value.toUpperCase()
    }

    return ""
})

export default {
    formatAsCurrency,
    formatDate: function(date, format) {
        if (format === undefined) {
            format = "ddd, DD MMM YYYY"
        }

        return moment(new Date(date)).format(format)
    },
    formatTime: function(date, format) {
        if (isNaN(Date.parse(date))) {
            date = moment(date, "HH:mm:ss")
        }
        
        if (format === undefined) {
            format = "HH:mm"

            if (Store.getters.user.business.time_format === "12h") {
                format = "hh:mma"
            }
        }

        return moment(date).format(format)
    },
    timeFormat: function() {
        let format = "hh:mma"

        if (Store.getters.user.business.time_format === "24h") {
            format = "HH:mm"
        }

        return format
    },
    formatDateTime: function(date, format) {
        if (format === undefined) {
            format = "DD MMM YYYY"
        }

        format += ", " + this.timeFormat()

        return moment(date).format(format)
    },
    getTimeSlots: function(interval = 15) {
        let fromDateTime = moment().format("YYYY-MM-DD 00:00:00")
        let toDateTime = moment().format("YYYY-MM-DD 23:45:00")
        let slots = []
        
        while (fromDateTime <= toDateTime) {
            slots.push({ value: moment(fromDateTime).format("HH:mm:ss"), text: moment(fromDateTime).format(this.timeFormat()) })
            fromDateTime = moment(fromDateTime).add(interval, "minutes").format('YYYY-MM-DD HH:mm:ss')
        }

        return slots
    },
    getNextInterval(intervalInMinutes = 15) {
        const currentDateTime = moment()
        const intervalRemainder = intervalInMinutes - (currentDateTime.minute() % intervalInMinutes)
        return moment(currentDateTime).add(intervalRemainder, "minutes")
    },
    convertToHoursAndMinutes: function(time) {
        if (time <= 0) return 0
        time = moment.utc(moment.duration(time, "minutes").asMilliseconds())
        const hourFormatStr = "h"
        const minuteFormatStr = "min"
        if (!time.minutes()) {
            return time.format(`h[${hourFormatStr}]`)
        }
        return time.format(`h[${hourFormatStr}] mm[${minuteFormatStr}]`)
    },
    weekdays: function () {
        return [
            { value: 0, text: "Sunday" },
            { value: 1, text: "Monday" },
            { value: 2, text: "Tuesday" },
            { value: 3, text: "Wednesday" },
            { value: 4, text: "Thursday" },
            { value: 5, text: "Friday" },
            { value: 6, text: "Saturday" }
        ]
    },
    showToast: (variant, message, config = {}) => {
        const vm = new Vue()
        let title = config.title ?? variant.charAt(0).toUpperCase() + variant.slice(1)
        if (title === "Danger") {
            title = "Error"
        }
        vm.$bvToast.toast(message, {
            title: title,
            variant: variant,
            autoHideDelay: 3000,
            solid: true
        })
    },
    copyToClipboard: function (text) {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        this.showToast("success", "Copied to clipboard successfully")
    },
    appointmentStatusVariants: function (appointmentStatus) {
        let variant = null
        switch (appointmentStatus) {
            case "new":
                variant = "primary"
                break
            case "cancelled":
                variant = "danger"
                break
            case "confirmed":
            case "completed":
            case "started":
                variant = "success"
                break
            case "arrived":
                variant = "warning"
                break
        }

        return variant
    },
    invoiceStatusVariants: function (status) {
        let variant = null
        switch (status) {
            case "completed":
                variant = "success"
                break
            case "voided":
            case "refunded":
                variant = "danger"
                break
            case "unpaid":
                variant = "warning"
                break
        }

        return variant
    },
    calculateTax: function (rate, price)  {
        let taxAmount = (rate / 100) * price
    
        if (Store.getters.user.business.is_tax_inclusive) {
            taxAmount = taxAmount / (1 + (rate / 100))
        }
    
        return taxAmount
    },
    getMonthNameFromNum: function(num, format = "MMMM"){
        return moment(num, 'M').format(format)
    }
}