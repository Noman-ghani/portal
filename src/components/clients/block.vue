<template>
    <ValidationObserver ref="form" v-slot="{invalid}">
        <b-modal visible no-close-on-esc no-close-on-backdrop title="Block Client" @hidden="$router.push({name: 'clients.view', params: {id: $route.params.id}})">
            <p class="font-weight-bold">Are you sure you want to block this client?</p>
            <p>Blocking prevents this client from booking online appointments with you, they will find no available time slots.</p>
            <p>Blocked clients are also automatically excluded from any marketing messages.</p>
            <ValidationProvider vid="block_reason" name="Block reason" :rules="{required: true}" v-slot="{errors}">
                <b-form-group label="Block reason" label-for="block_reason">
                    <b-form-select :options=block_reasons v-model="form.block_reason" :class="{'is-invalid': errors[0]}">
                        <template #first>
                            <b-form-select-option :value=null>Please Select</b-form-select-option>
                        </template>
                    </b-form-select>
                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                </b-form-group>
            </ValidationProvider>
            <template #modal-footer>
                <submit-button ref="submit-button" @click.native="onSubmit()" :disabled="invalid"></submit-button>
            </template>
        </b-modal>
    </ValidationObserver>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../plugins/vee-validate"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            SubmitButton
        },
        data: function () {
            return {
                form: {
                    block_reason: null
                },
                block_reasons: []
            }
        },
        created: function () {
            this.$http.get("settings/block_reasons")
            .then(block_reasons => {
                this.block_reasons = block_reasons.data
            })
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("clients/block/" + this.$route.params.id, this.form)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: 'clients.view', params: {id: this.$route.params.id, reload: true}})
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