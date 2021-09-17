<template>
    <b-modal visible no-close-on-esc no-close-on-backdrop title="Cancel Appointment" @hidden="$router.push({name: 'appointments.calendar'})">
        <b-form-group label="Cancellation Reason" label-for="reason">
            <b-form-select v-model="reason_id" :options="cancellationReasons" value-field="id" text-field="reason">
                <template #first>
                    <b-form-select-option :value="null">No Reason Provided</b-form-select-option>
                </template>
            </b-form-select>
        </b-form-group>
        <template #modal-footer>
            <submit-button @click.native="onSubmit()" ref="submit-button">Cancel Appointment</submit-button>
        </template>
    </b-modal>
</template>
<script>
    import SubmitButton from "@/components/helpers/submit-button.vue"

    export default {
        components: {
            SubmitButton
        },
        data: function () {
            return {
                reason_id: null,
                cancellationReasons: []
            }
        },
        created: function () {
            this.$http.get("cancellation-reasons")
            .then(cancellationReasons => {
                this.cancellationReasons = cancellationReasons.data
            })
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("appointments/change-status/" + this.$route.params.id, {status: "cancelled", reason_id: this.reason_id})
                .then(res => {
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                    } else {
                        this.$helpers.showToast("danger", res.data.message)
                    }
                    this.$router.push({name: "appointments.calendar", params: {reload: true}})
                })
                .catch(() => {
                    this.$refs["submit-button"].displayLoader = false
                })
            }
        }
    }
</script>