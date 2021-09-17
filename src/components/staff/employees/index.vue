<template>
    <overlay :show="showLoader" full-height>
        <template v-if="!showLoader">
            <div class="centralized">
                <heading-with-back>
                    <template #left>
                        <search-field class="mb-3">
                            <b-form-input autocomplete="off" v-model="searchQuery" placeholder="Search by name, e-mail or mobile number" />
                        </search-field>
                    </template>
                    <template #right>
                        <router-link :to="{ name: 'staff.employees.add' }" class="btn btn-primary">Add Staff</router-link>
                    </template>
                </heading-with-back>
                <template v-if="employeesList.length">
                    <b-card class="block-card" v-for="employeeRow in employeesList" v-bind:key="employeeRow.id">
                        <router-link class="align-center-flex" :to="{name: 'staff.employees.edit', params: {id: employeeRow.id}}">
                            <div class="w-100">
                                <div class="block_list d-flex justify-content-between align-items-center">
                                    <div class="block-title d-flex align-items-center">
                                        <div class="nick-name" :style="'border-color:' + employeeRow.appointment_color">
                                            <p v-if="!employeeRow.profile_image" class="inner d-flex justify-content-center align-items-center">
                                                {{employeeRow.first_name.charAt(0)}}{{employeeRow.last_name.charAt(0)}}
                                            </p>
                                            <b-img-lazy v-else :src="employeeRow.profile_image + '?' + new Date().getTime()"></b-img-lazy>
                                        </div>
                                        <div class="full-name">
                                            <h4>{{employeeRow.first_name}} {{employeeRow.last_name}}</h4>
                                            <p>{{employeeRow.staff_title}}</p>
                                        </div>
                                    </div>
                                    <div class="block-details d-flex flex-column flex-grow-1" v-if="$screen.width > 1024">
                                        <span class="email">
                                            <a :href="'mailto:' + employeeRow.user.email">
                                                {{employeeRow.user.email}}
                                            </a>
                                        </span>
                                        <span class="phone mt-1">
                                            <a :href="'tel:' + employeeRow.phone_code + employeeRow.phone_number">
                                                +{{employeeRow.phone_country.phone_code}} {{employeeRow.phone_number | VMask(employeeRow.phone_country.phone_mask)}}
                                            </a>
                                        </span>
                                    </div>
                                    <div class="next">
                                        <b-icon-caret-right-fill font-scale="1.1"></b-icon-caret-right-fill>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </b-card>
                </template>
                <no-data v-else>
                    <img src="@/assets/images/staff.svg" />
                    <h2>No results found</h2>
                    <p>We could not find any results based on your search.</p>
                    <b-link @click="searchQuery = null" class="btn btn-primary w-100">Back to Staff</b-link>
                </no-data>
            </div>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import VueScreen from "vue-screen"
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import SearchField from "../../search-field.vue"
    import NoData from "../../no-data.vue"

    Vue.use(VueScreen)

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            SearchField,
            NoData
        },
        data: function () {
            return {
                showLoader: true,
                searchQuery: null,
                employees: []
            }
        },
        created: function () {
            this.$http.get("staff?with-phone-country&with-user")
            .then(employees => {
                this.employees = employees.data
                this.showLoader = false
            })
        },
        computed: {
            employeesList: function () {
                if (this.employees.length) {
                    const searchQuery = this.searchQuery
                    if (searchQuery) {
                        return this.employees.filter(employeeRow => {
                            return employeeRow.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || employeeRow.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) || employeeRow.user.email.toLowerCase().includes(searchQuery.toLowerCase())
                        })
                    }

                    return this.employees
                }

                return []
            }
        }
    }
</script>