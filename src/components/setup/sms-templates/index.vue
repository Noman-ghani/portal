<template>
    <div class="centralized">
        <heading-with-back :back-link-to="{name: 'setup.index'}" title="SMS Templates" description="Set your sms templates for your customers"></heading-with-back>
        <overlay :show="showLoader" full-height-with-heading>
            <template v-if="!showLoader">
                <b-card no-body>
                    <b-card-body class="p-0">
                        <div v-b-modal.modal @click="setFormAttributes(smsTemplate)" v-for="smsTemplate, idx in smsTemplates" v-bind:key="idx" :class="{'p-4': true, 'd-flex': true, 'align-items-center': true, 'border-top': idx > 0}">
                            <div>
                                <p class="m-0 font-size-17 font-weight-700">{{smsTemplate.title}}</p>
                                <p class="m-0 sub-color">{{smsTemplate.description}}</p>
                            </div>
                            <b-icon-check2 v-if="smsTemplate.is_active" variant="success" font-scale="2" class="ml-auto"></b-icon-check2>
                            <b-icon-x v-else variant="danger" font-scale="2" class="ml-auto"></b-icon-x>
                        </div>
                    </b-card-body>
                    <router-view></router-view>
                </b-card>
                <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                    <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                        <b-modal id="modal" no-close-on-esc no-close-on-backdrop>
                            <template #modal-header>
                                <h5 class="modal-title">{{form.title}}</h5>
                                <toggle-button v-model="form.is_active" color="#0C56C9" :height="30" :width="50" :sync="true" class="m-0"></toggle-button>
                            </template>
                            <code v-html="form.template"></code>
                            <b-row class="mt-4" v-if="form.send !== 'immediately'">
                                <b-col>
                                    <b-form-group label="Time Variant" label-for="time_variant">
                                        <ValidationProvider vid="time_variant" name="Time Variant" :rules="{required: true}" v-slot="{errors}">
                                            <b-form-select v-model="form.time_variant" :options="timeVariantOptions" :class="{'is-invalid': errors[0]}"></b-form-select>
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </ValidationProvider>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="Duration" label-for="duration">
                                        <ValidationProvider vid="duration" name="Duration" :rules="{required: true}" v-slot="{errors}">
                                            <b-form-input type="number" v-model="form.duration" :class="{'is-invalid': errors[0]}"></b-form-input>
                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </ValidationProvider>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <template #modal-footer="{close}">
                                <div class="d-flex flex-grow-1 justify-content-between">
                                    <submit-button variant="secondary" @click.native="close()">Close</submit-button>
                                    <submit-button @click.native="onSubmit()" ref="submit-button" type="submit" class="ml-auto" :disabled="invalid"></submit-button>
                                </div>
                            </template>
                        </b-modal>
                    </b-form>
                </ValidationObserver>
            </template>
        </overlay>
    </div>
</template>
<script>
    import Vue from "vue"
    import * as VeeValidate from "../../../plugins/vee-validate"
    import {ToggleButton} from "vue-js-toggle-button"
    import HeadingWithBack from "../../heading-with-back.vue"
    import Overlay from "../../helpers/overlay.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VeeValidate)

    export default {
        components: {
            ToggleButton,
            HeadingWithBack,
            Overlay,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                smsTemplates: [],
                form: {},
                timeVariantOptions: [
                    { value: "minutes", text: "Minutes" },
                    { value: "hours", text: "Hours" },
                    { value: "days", text: "Days" }
                ]
            }
        },
        created: function () {
            this.getData()
        },
        methods: {
            getData: function () {
                this.showLoader = true
                this.$http.get("sms-templates")
                .then(response => {
                    this.smsTemplates = response.data
                    this.showLoader = false
                })
            },
            setFormAttributes: function (template) {
                this.form = template
                this.form.is_active = this.form.is_active == 1

                if (this.form.time_details.i > 0) {
                    this.form.time_variant = "minutes"
                    this.form.duration = this.form.time_details.i
                } else if (this.form.time_details.h > 0) {
                    this.form.time_variant = "hours"
                    this.form.duration = this.form.time_details.h
                } else if (this.form.time_details.d > 0) {
                    this.form.time_variant = "days"
                    this.form.duration = this.form.time_details.d
                }
            },
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("sms-templates/" + this.form.id, this.form)
                .then(response => {
                    this.$refs["submit-button"].displayLoader = false
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$bvModal.hide("modal")
                        this.getData()
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
                .catch(() => {
                    this.$refs["submit-button"].displayLoader = false
                })
            }
        }
    }
</script>