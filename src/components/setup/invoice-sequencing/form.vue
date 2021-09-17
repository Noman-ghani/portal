<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
            <b-modal visible no-close-on-esc no-close-on-backdrop title="Change Sequencing" @hidden="$router.push({name: 'setup.invoice-sequencing'})">
                <p class="m-0">You are about to introduce this change for <b>{{$route.params.data.name}}</b></p>
                <b-row class="mt-5">
                    <b-col md="6">
                        <ValidationProvider vid="invoice_prefix" name="Invoice No. Prefix" v-slot="{errors}">
                            <b-form-group label="Invoice No. Prefix" label-for="invoice_prefix">
                                <b-form-input v-model="form.invoice_prefix" :class="{'is-invalid': errors[0]}" />
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="next_invoice_number" name="Next Invoice Number" v-slot="{errors}">
                            <b-form-group label="Next Invoice Number" label-for="next_invoice_number">
                                <b-form-input type="number" v-model="form.next_invoice_number" :class="{'is-invalid': errors[0]}" />
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <template #modal-footer>
                    <submit-button @click.native="onSubmit()" ref="submit-button" type="submit"></submit-button>
                </template>
            </b-modal>
        </b-form>
    </ValidationObserver>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            SubmitButton
        },
        data: function () {
            return {
                form: {
                    invoice_prefix: this.$route.params.data.invoice_prefix,
                    next_invoice_number: this.$route.params.data.next_invoice_number
                }
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("branches/invoice_sequences/" + this.$route.params.id, this.form)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: 'setup.invoice-sequencing', params: {reload: true}})
                    }
                })
                .catch(errors => {
                    this.$refs["submit-button"].displayLoader = false
                    this.$refs.form.setErrors(errors.response.data)
                })
            }
        }
    }
</script>