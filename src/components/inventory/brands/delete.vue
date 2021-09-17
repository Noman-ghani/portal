<template>
    <b-modal :visible=true @hidden="$router.push({name: 'inventory.brands'})" title="Delete Confirmation">
        <p class="m-0">Are you sure you want to delete <b>{{$route.params.name}}</b> ?</p>
        <template #modal-footer>
            <submit-button @click.native="onSubmit()" ref="submit-button" type="submit">Yes, Delete</submit-button>
        </template>
    </b-modal>
</template>
<script>
    import SubmitButton from "@/components/helpers/submit-button.vue"

    export default {
        components: {
            SubmitButton
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                this.$http.delete("inventory/brands/" + this.$route.params.id)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "inventory.brands", params: {reload: true}})
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