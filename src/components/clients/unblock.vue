<template>
    <b-modal visible no-close-on-esc no-close-on-backdrop title="Unblock Client" @hidden="$router.push({name: 'clients.view', params: {id: $route.params.id}})">
        <p class="font-weight-bold">Are you sure you want to unblock this client?</p>
        <p class="m-0">This will allow the client to book online appointments with you and to receive marketing messages.</p>
        <template #modal-footer>
            <submit-button @click.native="onSubmit()"></submit-button>
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
                this.$http.put("clients/unblock/" + this.$route.params.id)
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        this.$router.push({name: "clients.view", params: {id: this.$route.params.id, reload: true}})
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