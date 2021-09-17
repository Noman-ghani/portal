<template>
    <b-modal no-close-on-esc no-close-on-backdrop :visible="visible" body-class="p-0" hide-footer @hidden="onHidden()">
        <template #modal-title>
            <b-icon-arrow-left @click="category = {}" class="pointer" v-if="Object.keys(category).length" />
            {{title}}
        </template>
        <services :show-category="Object.keys(category).length" v-on:category_selected="category = $event" v-on:selected="onServiceSelected($event)" />
    </b-modal>
</template>
<script>
    import Services from "../services"

    export default {
        components: {
            Services
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                category: {}
            }
        },
        computed: {
            title: function () {
                if (Object.keys(this.category).length) {
                    return this.category.title
                }

                return "Select Services"
            }
        },
        methods: {
            onHidden: function () {
                this.category = {}
                this.$emit("closed")
            },
            onServiceSelected: function (data) {
                this.onHidden()
                this.$emit("selected", data)
            }
        }
    }
</script>