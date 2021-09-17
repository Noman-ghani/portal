<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
            <b-modal :visible=true no-close-on-esc no-close-on-backdrop @hidden="$router.push({name: 'inventory.brands'})">
                <template #modal-title>
                    {{$route.params.id ? "Edit Brand" : "New Brand"}}
                </template>
                <ValidationProvider vid="name" name="Brand name" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Brand name *" label-for="name">
                        <b-form-input v-model="form.name" :class="{'is-invalid': errors[0]}" placeholder="e.g. L'Oreal" />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <template #modal-footer>
                    <div class="d-flex flex-grow-1 justify-content-between">
                        <router-link v-if="$route.params.id" :to="{name: 'inventory.brands.delete', params: {id: $route.params.id, name: form.name}}" class="mr-auto btn btn-danger">DELETE</router-link>
                        <submit-button @click.native="onSubmit()" type="submit" ref="submit-button" :disabled="invalid" class="ml-auto"></submit-button>
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
                    name: null
                }
            }
        },
        created: function () {
            if (this.$route.params.id) {
                this.form.name = this.$route.params.data.name
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("inventory/brands/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("inventory/brands", this.form)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "inventory.brands", params: {reload: true}})
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