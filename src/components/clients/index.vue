<template>
    <overlay :show="showLoader" full-height>
        <template v-if="!showLoader">
            <div class="centralized">
                <heading-with-back>
                    <template #left>
                        <search-field>
                            <b-form-input autocomplete="off" v-model="searchQuery" placeholder="Search by name, e-mail or mobile number" />
                        </search-field>
                    </template>
                    <template #right>
                        <dropdown right text="Options" class="mr-3" variant="primary">
                            <b-dropdown-item v-b-modal.import-clients-modal>Import Clients</b-dropdown-item>
                        </dropdown>
                        <router-link :to="{ name: 'clients.add' }" class="btn btn-primary">Add Client</router-link>
                    </template>
                </heading-with-back>
                <template v-if="clientsList.length">
                    <b-card class="block-card" v-for="clientRow in clientsList" v-bind:key="clientRow.id">
                        <router-link class="align-center-flex" :to="{name: 'clients.view', params: {id: clientRow.id}}">
                            <div class="w-100">
                                <div class="block_list d-flex justify-content-between align-items-center">
                                    <div class="block-title d-flex align-items-center">
                                        <div class="nick-name" :style="'border-color: #bbc1e8'">
                                            <p class="inner d-flex justify-content-center align-items-center">
                                                {{clientRow.first_name.charAt(0)}}{{clientRow.last_name.charAt(0)}}
                                            </p>
                                        </div>
                                        <div class="full-name">
                                            <h4>{{clientRow.full_name}}</h4>
                                        </div>
                                    </div>
                                    <div class="block-details d-flex flex-column flex-grow-1" v-if="$screen.width > 1024">
                                        <span class="email">
                                            <a :href="'mailto:' + clientRow.email">
                                                {{clientRow.email}}
                                            </a>
                                        </span>
                                        <span class="phone mt-1">
                                            <a :href="'tel:' + clientRow.phone_country.phone_code + clientRow.phone_number">
                                                +{{clientRow.phone_country.phone_code}} {{clientRow.phone_number | VMask(clientRow.phone_country.phone_mask)}}
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
                    <template v-if="searchQuery">
                        <img src="@/assets/images/clients.svg" />
                        <h2>No results found</h2>
                        <p>We could not find any results based on your search.</p>
                        <b-link @click="searchQuery = null" class="btn btn-primary w-100">Back to Clients</b-link>
                    </template>
                    <template v-else>
                        <img src="@/assets/images/clients.svg" />
                        <h2>No Clients</h2>
                        <p>You do not have any clients yet, create new clients manually or import your full list at once</p>
                        <router-link :to="{name: 'clients.add'}" class="btn btn-primary w-100 d-block">New Client</router-link>
                    </template>
                </no-data>
            </div>
            <b-modal id="import-clients-modal" no-close-on-esc no-close-on-backdrop title="Import Clients">
                <overlay :show="isUploading">
                    <template #overlay>
                        <div class="text-center">
                            <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                            <p class="mt-3 font-weight-bold font-size-17">System is importing your clients. Please do not close this window</p>
                        </div>
                    </template>
                    <p class="m-0 sub-color">Follow the simple instructions below to import clients to your ServU partner account</p>
                    <ol class="steps mt-4 mb-4">
                        <li>Download your import spreadsheet using the button below</li>
                        <li>Copy and paste your client details into the spreadsheet</li>
                        <li>Upload your csv file using the button below and your clients will be imported</li>
                    </ol>
                    <div class="d-flex align-items-center sub-color">
                        <b-icon-bell-fill></b-icon-bell-fill>
                        <p class="m-0 ml-2 font-italic">Maximum 100 clients are allowed in one sheet.</p>
                    </div>
                </overlay>
                <template #modal-footer>
                    <div class="d-flex flex-grow-1">
                        <submit-button ref="import-button" variant="primary" class="flex-basis-50 mr-2 upload-import-file">
                            <b-icon-cloud-upload-fill></b-icon-cloud-upload-fill>
                            Upload import file
                            <b-form-file accept=".csv" @change="onUpload($event)" plain></b-form-file>
                        </submit-button>
                        <submit-button ref="download-button" class="btn btn-primary flex-basis-50 ml-2" @click.native="downloadImportFile">
                            <b-icon-cloud-download-fill></b-icon-cloud-download-fill>
                            Download import file
                        </submit-button>
                    </div>
                </template>
            </b-modal>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import VueScreen from "vue-screen"
    import VueMask from "v-mask"
    import Overlay from "../helpers/overlay.vue"
    import Dropdown from "../helpers/dropdown.vue"
    import HeadingWithBack from "../heading-with-back.vue"
    import SearchField from "../search-field"
    import NoData from "../no-data.vue"
    import SubmitButton from "@/components/helpers/submit-button.vue"

    Vue.use(VueMask)
    Vue.use(VueScreen)
    
    export default {
        components: {
            Overlay,
            Dropdown,
            HeadingWithBack,
            SearchField,
            NoData,
            SubmitButton
        },
        data: function () {
            return {
                showLoader: true,
                searchQuery: null,
                clients: [],
                uploadedCsvFile: null,
                isUploading: false
            }
        },
        created: function () {
            this.getClients()
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
        },
        methods: {
            getClients: function () {
                this.showLoader = true
                this.$http.get("clients?with-phone-country")
                .then(clients => {
                    this.clients = clients.data
                    this.showLoader = false
                })
            },
            downloadImportFile: function () {
                this.$refs["download-button"].displayLoader = true
                this.$http.get("clients/download-import-file", {responseType: "arraybuffer"})
                .then(response => {
                    const blob = new Blob([response.data], {type: "application/csv"})
                    let link = document.createElement("a")
                    link.href = window.URL.createObjectURL(blob)
                    link.download = "Servu Partners Client Import.csv"
                    link.click()
                    this.$refs["download-button"].displayLoader = false
                })
            },
            onUpload: function (event) {
                this.isUploading = true
                this.$refs["import-button"].displayLoader = true
                let formData = new FormData()
                formData.append("file", event.target.files[0])

                this.$http.post("clients/import", formData)
                .then(response => {
                    this.isUploading = false
                    if (response.data.success) {
                        this.$helpers.showToast(response.data.variant, response.data.message)
                        this.$bvModal.hide("import-clients-modal")
                        this.getClients()
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
                .catch(() => {
                    this.isUploading = false
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .steps {
        font-size: 17px;
        list-style: none;
        counter-reset: item;
        li {
            &:not(:first-child) {
                margin-top: 25px;
            }
            counter-increment: item;
            position: relative;
            padding-left: 48px;
            color: #101928;
            &::before {
                position: absolute;
                left: 0;
                top: -2px;
                content: counter(item);
                display: block;
                width: 28px;
                height: 28px;
                border: 2px solid var(--primary);
                border-radius: 50%;
                line-height: 24px;
                color: var(--primary);
                background-color: #fff;
                text-align: center;
                font-weight: 500;
            }
            &:not(:last-of-type)::after {
                content: "";
                position: absolute;
                width: 1px;
                height: calc(100% - 0px);
                left: 13px;
                top: 28px;
                border-left: 2px dashed #dee3e7;
            }
        }
    }
    .upload-import-file {
        position: relative;
        input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            border-radius : 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2;
        }
    }
</style>