<template>
    <b-modal visible @hidden="$router.push({name:'inventory.categories'})" title="Delete Confirmation">
        <p class="m-0">Are you sure you want to delete <b>{{$route.params.name}}</b> ?</p>
        <template #modal-footer>
            <submit-button @click.native="onSubmit()" type="submit" ref="submit-button">Yes, Delete</submit-button>
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
                this.$http.delete("inventory/categories/" + this.$route.params.id)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "inventory.categories", params: {reload: true}})
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