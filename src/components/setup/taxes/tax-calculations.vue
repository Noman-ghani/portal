<template>
    <b-modal visible no-close-on-esc no-close-on-backdrop title="Change Tax Calculations" @hidden="$router.push({name: 'setup.taxes'})">
        <b-alert show variant="warning">
            <div class="d-flex">
                <p class="m-0 mr-3">This change will have a big impact on your sales. Make sure you understand all implications</p>
                <b-icon icon="bell" font-scale="1.5" />
            </div>
        </b-alert>
        <b-form-group>
            <b-form-radio v-model="form.is_tax_inclusive" name="is_tax_inclusive" value="0" class="mt-1">
                <h5>Retail Prices Exclude Tax</h5>
                <p class="font-weight-normal m-0">If selected, all taxes will be calculated using this formula:</p>
                <code>Tax = Retail * Tax</code>
                <p class="m-0">For e.g. 20% tax on a {{$store.getters.user.business.country.currency}} 10.00 item comes to {{$store.getters.user.business.country.currency}} 2.00</p>
            </b-form-radio>
            <b-form-radio v-model="form.is_tax_inclusive" name="is_tax_inclusive" value="1" class="mt-5">
                <h5>Retail Prices Include Tax</h5>
                <p class="font-weight-normal m-0">If selected, all taxes will be calculated using this formula:</p>
                <code>Tax = (Tax Rate * Retail Price) / (1 + Tax Rate)</code>
                <p class="m-0">For e.g. 20% tax on a {{$store.getters.user.business.country.currency}} 10.00 item comes to {{$store.getters.user.business.country.currency}} 1.67</p>
            </b-form-radio>
        </b-form-group>
        <template #modal-footer>
            <submit-button @click.native="onSubmit()" ref="submit-button"></submit-button>
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
                form: {
                    is_tax_inclusive: this.$store.getters.user.business.is_tax_inclusive
                }
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("business/update-tax-settings", this.form)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$store.dispatch("updateBusinessData", {...this.$store.getters.user.business, ...{is_tax_inclusive: parseInt(this.form.is_tax_inclusive)}})
                        this.$router.push({name: "setup.taxes", params: {reload: true}})
                    } else {
                        this.$helpers.showToast("danger", res.data.message)
                    }
                })
                .catch(() => {
                    this.$refs["submit-button"].displayLoader = false
                })
            }
        }
    }
</script>