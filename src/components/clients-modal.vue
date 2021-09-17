<template>
    <b-modal ref="modal" v-bind="$attrs" no-close-on-esc no-close-on-backdrop ok-only ok-title="Close" body-class="p-0" hide-header @show="getClients()" @hidden="$emit('closed')">
        <div class="p-4 border-bottom">
            <search-field>
                <b-form-input autofocus autocomplete="off" v-model="searchQuery" placeholder="Search by client name, email address or phone number" />
            </search-field>
        </div>
        <div class="scrollable">
            <overlay :show="showLoader" with-min-height>
                <template v-if="!showLoader">
                    <template v-if="clientsList.length">
                        <div @click="$emit('selected', clientRow)" v-for="(clientRow, idx) in clientsList" v-bind:key="clientRow.id" :class="{'d-flex': true, 'align-items-center': true, 'pointer': true, 'p-3': true, 'border-top': idx > 0}">
                            <div class="d-flex align-items-center flex-grow-1 justify-content-between">
                                <div class="d-flex">
                                    <b-avatar variant="primary" :text="clientRow.first_name[0] + clientRow.last_name[0]" size="4rem" class="nick-name" />
                                    <div class="d-flex flex-column ml-3">
                                        <p class="m-0 font-size-17 font-weight-700">
                                            {{clientRow.full_name}}
                                        </p>
                                        <p class="m-0 sub-color">{{clientRow.email}}</p>
                                        <p class="m-0 sub-color">+{{clientRow.phone_country.phone_code}} {{clientRow.phone_number | VMask(clientRow.phone_country.phone_mask)}}</p>
                                    </div>
                                </div>
                                <b-icon-caret-right-fill font-scale="1.3" />
                            </div>
                        </div>
                    </template>
                    <no-data class="pt-5 pb-5" v-else>
                        <img src="@/assets/images/clients.svg" />
                        <h2>No results found</h2>
                        <p>We could not find any results based on your search.</p>
                    </no-data>
                </template>
            </overlay>
        </div>
    </b-modal>
</template>
<script>
    import SearchField from "./search-field"
    import Overlay from "./overlay"
    import NoData from "./no-data.vue"
    import Vue from "vue"
    import VMask from "v-mask"

    Vue.use(VMask)

    export default {
        components: {
            SearchField,
            Overlay,
            NoData
        },
        data: function () {
            return {
                showLoader: false,
                searchQuery: null,
                clients: [],
                originalClients: []
            }
        },
        methods: {
            getClients: function () {
                this.showLoader = true
                this.$http.get("clients", {params: {"with-phone-country": 1, "with-deals": 1}})
                .then(clients => {
                    this.clients = clients.data
                    this.showLoader = false
                })
            }
        },
        computed: {
            clientsList: function () {
                if (this.clients.length) {
                    const searchQuery = this.searchQuery
                    if (searchQuery) {
                        return this.clients.filter(clientRow => {
                            return clientRow.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || clientRow.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) || (clientRow.email && clientRow.email.toLowerCase().includes(searchQuery.toLowerCase()))
                        })
                    }

                    return this.clients
                }

                return []
            }
        }
    }
</script>
<style scoped lang="scss">
    .scrollable {
        max-height: calc(100vh - 237px);
        overflow-y: scroll;
    }
@media (max-width: 768px) {
    .sub-color{
        font-size: 12px;
    }

    ::v-deep .nick-name{
        height: 3rem !important;
        width: 3rem !important;
        .b-avatar-text{
            font-size: 16px !important;
        }
    }
}
@media (max-width: 400px) {
    .sub-color{
        max-width: 175px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>