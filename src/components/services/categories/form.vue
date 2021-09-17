<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
            <b-modal :visible=true no-close-on-esc no-close-on-backdrop @hidden="$router.push({name: 'services'})">
                <template #modal-title>
                    {{$route.params.id ? "Edit Category" : "New Category"}}
                </template>
                <ValidationProvider vid="title" name="Category name" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Category name *" label-for="title">
                        <b-form-input v-model="form.title" :class="{'is-invalid': errors[0]}" />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <b-form-group label="Category description" label-for="description">
                    <b-form-textarea v-model="form.description" rows="6" />
                </b-form-group>
                <b-form-group label="Appointment color" label-for="color">
                    <ul class="colors_list">
                        <li v-for="color in colors_list" v-bind:key="color">
                            <a v-on:click="form.color = color" href="javascript:;" v-bind:class="{active: form.color == color}" :style="'background-color: ' + color"></a>
                        </li>
                    </ul>
                </b-form-group>
                <template #modal-footer>
                    <div class="d-flex flex-grow-1 justify-content-between">
                        <router-link v-if="$route.params.id" :to="{name: 'services.category.delete', params: {id: $route.params.id, title: form.title}}" class="mr-auto btn btn-danger">DELETE</router-link>
                        <submit-button @click.native="onSubmit()" :disabled="invalid" ref="submit-button" type="submit" class="ml-auto"></submit-button>
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
                    title: null,
                    description: null,
                    color: null
                },
                colors_list : this.$store.getters.config.colors
            }
        },
        created: function () {
            this.form.color = this.colors_list[Math.floor(Math.random() * this.colors_list.length)]
            if (this.$route.params.id) {
                this.form.title = this.$route.params.data.title
                this.form.color = this.$route.params.data.color
                this.form.description = this.$route.params.data.description
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs["submit-button"].displayLoader = true
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("services/categories/" + this.$route.params.id, this.form)
                } else {
                    axios = this.$http.post("services/categories", this.form)
                }

                axios
                .then(res => {
                    this.$refs["submit-button"].displayLoader = false
                    if (res.data.success) {
                        this.$helpers.showToast("success", res.data.message)
                        if (this.$route.params.id) {
                            this.$router.push({name: "services", params: {category: {...this.form, id: this.$route.params.id}}})
                        } else {
                            this.$router.push({name: "services", params: {reload: true}})
                        }
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
<style lang="scss" scoped>
    .colors_list {
        margin: .5rem 0 0;
        li {
            display: inline-block;
            margin-right: 1.1rem;
            a {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: block;
                &:hover,
                &.active {
                    border: 1px solid #000000;
                }
                &.active {
                    background-image: url('data:image/svg+xml; utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>');
                    background-repeat: no-repeat;
                    background-position: 50%;
                }
            }
        }
    }
</style>