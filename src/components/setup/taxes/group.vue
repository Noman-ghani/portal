<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
            <b-modal :visible=true no-close-on-esc no-close-on-backdrop @hidden="$router.push({name: 'setup.taxes'})">
                <template #modal-title>
                    {{$route.params.id ? "Edit Tax Group" : "New Tax Group"}}
                </template>
                <p class="mb-4">Combine multiple taxes into a group, each tax still shows individually on invoices and reports. To apply this group to your products and services, adjust your tax default settings.</p>
                <ValidationProvider vid="title" name="Tax name" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Tax name *" label-for="title">
                        <b-form-input v-model="form.title" :class="{'is-invalid': errors[0]}" />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <ValidationProvider vid="tax_1" name="Tax 1" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Tax 1 *" label-for="tax_1">
                        <b-form-select v-model="form.tax_1" :class="{'is-invalid': errors[0]}" :options="tax_1_list" text-field="title" value-field="id">
                            <template #first>
                                <b-form-select-option :value="null">-- Please select an option --</b-form-select-option>
                            </template>
                        </b-form-select>
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <ValidationProvider vid="tax_2" name="Tax 2" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Tax 2 *" label-for="tax_2">
                        <b-form-select v-model="form.tax_2" :class="{'is-invalid': errors[0]}" :options="tax_2_list" text-field="title" value-field="id">
                            <template #first>
                                <b-form-select-option :value="null">-- Please select an option --</b-form-select-option>
                            </template>
                        </b-form-select>
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <ValidationProvider vid="tax_3" name="Tax 3" v-slot="{errors}">
                    <b-form-group label="Tax 3" label-for="tax_3">
                        <b-form-select v-model="form.tax_3" :class="{'is-invalid': errors[0]}" :options="tax_3_list" text-field="title" value-field="id">
                            <template #first>
                                <b-form-select-option :value="null">-- Please select an option --</b-form-select-option>
                            </template>
                        </b-form-select>
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <template #modal-footer>
                    <div class="d-flex flex-grow-1 justify-content-between">
                        <router-link v-if="$route.params.id" :to="{name: 'setup.taxes.delete', params: {id: $route.params.id, title: form.title}}" class="mr-auto btn btn-danger">DELETE</router-link>
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
                    tax_1: null,
                    tax_2: null,
                    tax_3: null,
                },
                tax_1_list: [],
                tax_2_list: [],
                tax_3_list: []
            }
        },
        watch: {
            "form.tax_1": {
                handler: function (id) {
                    this.tax_2_list = this.tax_3_list = this.tax_1_list
                    this.tax_2_list = this.tax_3_list = this.tax_2_list.filter(row => {
                        return row.id != id
                    })
                }
            },
            "form.tax_2": {
                handler: function (id) {
                    this.tax_3_list = this.tax_3_list.filter(row => {
                        return row.id != id
                    })
                }
            }
        },
        created: function () {
            const list = this.$parent.$data.taxes
                
            this.tax_1_list = list
            this.tax_2_list = list
            this.tax_3_list = list

            if (this.$route.params.id) {
                const row = list.find(row => row.id == this.$route.params.id)
                this.form.title = row.title
                this.form.tax_1 = row.tax_1
                this.form.tax_2 = row.tax_2
                this.form.tax_3 = row.tax_3 ? row.tax_3 : ""
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("taxes/group/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("taxes/group", this.form)
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