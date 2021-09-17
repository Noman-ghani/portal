<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
            <b-modal visible no-close-on-esc no-close-on-backdrop title="Decrease Stock" body-class="p-0" @hidden="$router.push({name: 'inventory.products.stock-history', params: $route.params.id})">
                <overlay :show="showLoader">
                    <template v-if="!showLoader">
                        <template v-if="!branch_id">
                            <b-link @click="branch_id = branch.id" v-for="branch in branches" v-bind:key="branch.id" class="theme-color d-flex align-items-center justify-content-between p-4 border-top">
                                <h4 class="mb-0">{{branch.name}}</h4>
                                <b-icon-caret-right-fill />
                            </b-link>
                        </template>
                        <b-row v-else class="p-3">
                            <b-col md="3">
                                <ValidationProvider vid="quantity" name="Qty" :rules="{required: true, min_value: 1}" v-slot="{errors}">
                                    <b-form-group label="Qty" label-for="quantity">
                                        <b-form-input type="number" v-model="form.quantity" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="9">
                                <b-form-group label="Decrease reason" label-for="reason">
                                    <b-form-select v-model="form.reason" :options="reasons" />
                                </b-form-group>
                            </b-col>
                            <b-col md="12" v-if="form.reason === 'other'">
                                <ValidationProvider vid="description" name="Description" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Description *" label-for="description">
                                        <b-form-textarea v-model="form.description" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                    </template>
                </overlay>
                <template #modal-footer>
                    <submit-button @click.native="onSubmit()" type="submit" ref="submit-button" :disabled="!branch_id || invalid"></submit-button>
                </template>
            </b-modal>
        </b-form>
    </ValidationObserver>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import Overlay from "../../helpers/overlay.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            Overlay,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                branch_id: null,
                form: {
                    reason: null
                },
                branches: [],
                reasons: []
            }
        },
        computed: {
            branch: function () {
                return this.branches.find(branch => branch.id == this.branch_id) ?? {}
            }
        },
        created: async function () {
            const branchesResponse = await this.$http.get("branches")
            this.branches = branchesResponse.data

            const decreaseStockReasonsResponse = await this.$http.get("utilities/decrease-stock-reasons")
            this.reasons = decreaseStockReasonsResponse.data
            this.form.reason = this.reasons[0].value
            
            this.showLoader = false
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.post("inventory/products/stocks/decrease/" + this.branch_id + '/' + this.$route.params.id, this.form)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "inventory.products.stock-history", params: {id: this.$route.params.id, reload: true}})
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