<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
            <b-modal :visible=true no-close-on-esc no-close-on-backdrop @hidden="$router.push({name: 'setup.discounts'})">
                <template #modal-title>
                    {{$route.params.id ? "Edit Discount Type" : "New Discount Type"}}
                </template>
                <ValidationProvider vid="title" name="Discount name" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Discount name *" label-for="title">
                        <b-form-input v-model="form.title" :class="{'is-invalid': errors[0]}" placeholder="e.g. Senior Citizens" />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <b-form-group label="Discount value *" label-for="value">
                    <b-row>
                        <b-col md="8">
                            <b-input-group class="phone">
                                <b-input-group-prepend>
                                    <b-input-group-text class="pt-0 pb-0">
                                        {{options.find(option => option.value === form.type).text}}
                                    </b-input-group-text>
                                </b-input-group-prepend>
                                <ValidationProvider vid="value" name="Discount value" :rules="{required: true, min_value: (form.type === 'percentage' ? 1 : false), max_value: (form.type === 'percentage' ? 100 : false)}" v-slot="{errors}" tag="div">
                                    <b-form-input type="number" v-model="form.value" :class="{'is-invalid': errors[0]}" />
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </ValidationProvider>
                            </b-input-group>
                        </b-col>
                        <b-col md="4" :class="{'mt-4' : $screen.width < 768}">
                            <b-form-radio-group v-model="form.type" :options="options" class="w-100" button-variant="outline-primary" buttons></b-form-radio-group>
                        </b-col>
                    </b-row>
                </b-form-group>
                <checkbox size="lg" v-model="form.enable_for_service" value="1" unchecked-value="0" class="mb-3">
                    Enable for service sales
                </checkbox>
                <checkbox size="lg" v-model="form.enable_for_product" value="1" unchecked-value="0" class="mb-3">
                    Enable for product sales
                </checkbox>
                <checkbox size="lg" v-model="form.enable_for_voucher" value="1" unchecked-value="0" class="mb-3">
                    Enable for voucher sales
                </checkbox>
                <template #modal-footer>
                    <div class="d-flex flex-grow-1">
                        <router-link v-if="$route.params.id" :to="{name: 'setup.discounts.delete', params: {id: $route.params.id, title: form.title}}" class="mr-auto btn btn-danger">DELETE</router-link>
                        <submit-button @click.native="onSubmit()" ref="submit-button" type="submit" :disabled="invalid" class="ml-auto"></submit-button>
                    </div>
                </template>
            </b-modal>
        </b-form>
    </ValidationObserver>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import Checkbox from "@/components/helpers/checkbox.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            Checkbox,
            SubmitButton
        },
        data: function () {
            return {
                form: {
                    title: null,
                    type: "percentage",
                    enable_for_service: "1",
                    enable_for_product: "1",
                    enable_for_voucher: "1",
                },
                options: [
                    { value: "amount", text: this.$store.getters.user.business.country.currency },
                    { value: "percentage", text: "%" }
                ]
            }
        },
        created: function () {
            if (this.$route.params.id) {
                this.form.title = this.$route.params.data.title
                this.form.type = this.$route.params.data.type
                this.form.value = this.$route.params.data.value
                this.form.enable_for_service = this.$route.params.data.enable_for_service
                this.form.enable_for_product = this.$route.params.data.enable_for_product
                this.form.enable_for_voucher = this.$route.params.data.enable_for_voucher
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("discounts/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("discounts", this.form)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "setup.discounts", params: {reload: true}})
                    } else {
                        this.$helpers.showToast("danger", res.data.message)
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