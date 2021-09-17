<template>
    <b-modal visible no-close-on-esc no-close-on-backdrop @hidden="$router.push({name: 'setup.taxes'})">
        <template #modal-title>
            {{$route.params.branch.name}}
        </template>
        <p class="mb-4">Once saved, changes will automatically apply to all products and services which are already assigned to default taxes</p>
        <b-form-group label="Products Default Tax" label-for="product_tax">
            <b-form-select :options="$route.params.taxes" value-field="id" text-field="title" v-model="form.product_tax">
                <template #first>
                    <b-form-select-option :value="null">Please Select</b-form-select-option>
                </template>
            </b-form-select>
        </b-form-group>
        <b-form-group label="Service Default Tax" label-for="service_tax">
            <b-form-select :options="$route.params.taxes" value-field="id" text-field="title" v-model="form.service_tax">
                <template #first>
                    <b-form-select-option :value="null">Please Select</b-form-select-option>
                </template>
            </b-form-select>
        </b-form-group>
        <template #modal-footer>
            <submit-button ref="submit-button" @click.native="onSubmit()"></submit-button>
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
                    product_tax: this.$route.params.branch.product_tax_id,
                    service_tax: this.$route.params.branch.service_tax_id
                }
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.put("branches/update_tax_defaults/" + this.$route.params.branch.id, this.form)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
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