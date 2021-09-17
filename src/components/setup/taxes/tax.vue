<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
            <b-modal visible no-close-on-esc no-close-on-backdrop @hidden="$router.push({name: 'setup.taxes'})">
                <template #modal-title>
                    {{$route.params.id ? "Edit Tax" : "New Tax"}}
                </template>
                <p class="mb-4">Set the tax name and percentage rate. To apply this to your products and services, adjust your tax defaults settings.</p>
                <ValidationProvider vid="title" name="Tax name" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Tax name *" label-for="title">
                        <b-form-input v-model="form.title" :class="{'is-invalid': errors[0]}" />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <ValidationProvider vid="rate" name="Tax rate" :rules="{required: true, min_value: 1, max_value: 100}" v-slot="{errors}">
                    <b-form-group label="Tax rate *" label-for="rate">
                        <b-input-group>
                            <b-input-group-prepend>
                                <b-input-group-text>%</b-input-group-text>
                            </b-input-group-prepend>
                            <b-form-input type="number" v-model="form.rate" :class="{'is-invalid': errors[0]}" />
                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                        </b-input-group>
                    </b-form-group>
                </ValidationProvider>
                <template #modal-footer>
                    <div class="d-flex flex-grow-1 justify-content-between">
                        <router-link v-if="$route.params.id" :to="{name: 'setup.taxes.delete', params: {id: $route.params.id, title: form.title}}" class="mr-auto btn btn-danger">DELETE</router-link>
                        <submit-button @click.native="onSubmit()" ref="submit-button" type="submit" class="ml-auto" :disabled="invalid"></submit-button>
                    </div>
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
                    title: null,
                    rate: null
                }
            }
        },
        created: function () {
            if (this.$route.params.id) {
                const taxes = this.$parent.$data.taxes
                
                if (taxes.length) {
                    const tax = taxes.find(row => row.id == this.$route.params.id)
                    this.form.title = tax.title
                    this.form.rate = tax.rate
                } else {
                    this.$router.push({name: "setup.taxes"})
                }
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("taxes/tax/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("taxes/tax", this.form)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "setup.taxes", params: {reload: true}})
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