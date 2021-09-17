<template>
    <b-modal :visible=true @hidden="$router.push({name:'services'})" title="Delete Confirmation">
        <p class="m-0">Are you sure you want to delete <b>{{$route.params.title}}</b> ?</p>
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
                this.$http.delete("services/categories/" + this.$route.params.id)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "services", params: {reload: true}})
                    } else {
                        this.$helpers.showToast("danger", res.data.message)
                        this.$router.push({name: "services"})
                    }
                })
                .catch(() => {
                    this.$refs["submit-button"].displayLoader = false
                })
            }
        }
    }
</script>