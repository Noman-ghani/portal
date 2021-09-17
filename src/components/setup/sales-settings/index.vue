<template>
    <div class="centralized">
        <heading-with-back :back-link-to="{name: 'setup.index'}" title="Sales Settings" description="Manage sales settings such as staff commissions">
            <template #right>
                <submit-button ref="submit-button" :class="{'mt-4': $screen.width <= 520}" @click.native="onSubmit()">Save</submit-button>
            </template>
        </heading-with-back>
        <b-card>
            <template #header>
                <h1>Staff Commissions</h1>
                <p>Changes to commission and tax settings will only apply to new invoices, existing invoices are not impacted.</p>
            </template>
            <radio size="lg" v-model="staff_commission_logic" name="staff-commission-logic" value="1">Calculate by item sale price before discount excluding tax</radio>
            <radio size="lg" v-model="staff_commission_logic" name="staff-commission-logic" value="2" class="mt-3">Calculate by item sale price before discount including tax</radio>
            <radio size="lg" v-model="staff_commission_logic" name="staff-commission-logic" value="3" class="mt-3">Calculate by item sale price after discount excluding tax</radio>
            <radio size="lg" v-model="staff_commission_logic" name="staff-commission-logic" value="4" class="mt-3">Calculate by item sale price after discount including tax</radio>
        </b-card>
    </div>
</template>
<script>
    import HeadingWithBack from "@/components/heading-with-back.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"
    import Radio from "@/components/helpers/radio.vue"

    export default {
        components: {
            HeadingWithBack,
            SubmitButton,
            Radio
        },
        data: function () {
            return {
                staff_commission_logic: this.$store.getters.user.business.staff_commission_logic
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("business/update-sales-settings", {staff_commission_logic: this.staff_commission_logic})
                .then(response => {
                    this.$refs["submit-button"].displayLoader = false
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$store.getters.user.business.staff_commission_logic = this.staff_commission_logic
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
            }
        }
    }
</script>