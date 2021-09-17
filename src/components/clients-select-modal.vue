<template>
    <b-modal ref="modal" v-bind="$attrs" no-close-on-esc no-close-on-backdrop ok-only ok-title="Close" body-class="p-0" hide-header @show="selectClient()" @hidden="$emit('closed')">
        <div class="p-4 border-bottom">
            <search-field>
                <b-form-input autofocus autocomplete="off" v-model="searchQuery" placeholder="Search by client name, email address or phone number" />
            </search-field>
        </div>
        <div class="scrollable">
            <div class="d-flex">
                <span :class="{'all': true, 'active' : (selectedTab === 'all')}" @click="getClients('all')">All ({{clientsList.length}})</span>
                <span :class="{'all': true, 'active' : (selectedTab === 'inc')}" @click="getClients('inc')" v-if="selectedClients.length > 0">Included ({{selectedClients.length}})</span>
                <span :class="{'all': true, 'active' : (selectedTab === 'exc')}" @click="getClients('exc')" v-if="exculdedClients > 0">Excluded ({{exculdedClients}})</span>
            </div>
            <overlay :show="showLoader" with-min-height>
                <template v-if="!showLoader">
                    <template v-if="clientsList.length > 0">
                        <div :class="{'d-flex': true,'align-items-center': true, 'p-3': true, 'border-top': 0}">
                        <b-form-checkbox @change="allClients" :checked="selectAll" :value="true">
                            <span class="pointer">
                                All Clients
                            </span>
                        </b-form-checkbox>
                        </div>
                        <div v-for="(clientRow, idx) in clientsList" v-bind:key="idx" :class="{'d-flex': clientRow.show,'d-none': !clientRow.show, 'align-items-center': true, 'pointer': true, 'p-4': true, 'border-top': true}">
                             <b-form-group>
                                    <b-form-checkbox @change="selectClient" v-model="selectedClients" name="check-button" :value="clientRow.id">
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
                                        
                                        </div>
                                    </b-form-checkbox>
                            </b-form-group>
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
        props:{
            all: {
                type: Boolean,
                default: false
            },
            clients: {
                type: Array,
                default: function () {
                    return []
                }
            },
        },
        data: function () {
            return {
                showLoader: true,
                searchQuery: null,
                selectedClients: [],
                clientsList: [],
                exculdedClients: 0,
                selectAll: true,
                selectedTab: 'all'
            }
        },
        mounted:function(){
            setTimeout(() => {
                if(this.all && this.clients.length > 0){
                   this.clients.filter(res => {
                       this.selectedClients.push(res.id);
                   }) 
                }
                this.clientsList = this.clients
                this.showLoader = false 
            }, 1000);
        },
        methods: {
            selectClient: function(){
                let client = this.clients;
                if(this.clients.length){
                    //Empty Excluded clients
                    this.exculdedClients = 0

                    if(this.selectedClients.length === this.clients.length){
                        this.selectAll = true
                    }
                    
                    client = this.clients.filter(res => {
                        
                        if(this.selectedClients.includes(res.id)){
                            res.show = true
                            return res;
                        }
                        if(!this.selectedClients.includes(res.id)){
                            this.exculdedClients += 1;
                        }
                        
                        this.selectAll = false

                    });
                }
                
                this.$emit('selected', client)
                this.showLoader = false
            },
            getClients: function(value){
                this.selectedTab = value
                if(this.clients.length){
                    this.clientsList = this.clientsList.filter(res => {
                        res.show = true
                        if(value == 'all' && this.selectedClients.length < this.clients.length){
                            this.selectAll = false
                        }
                        
                        if(!this.selectedClients.includes(res.id)){
                            if(value == 'inc'){
                                this.selectAll = true
                                res.show = false
                            }
                        }

                        if(this.selectedClients.includes(res.id)){
                            if(value == 'exc'){
                                this.selectAll = false
                                res.show = false
                            }
                        }

                        return res;
                    })

                }
            },
            allClients: function(){
                
                this.selectedClients = [];

                if(!this.selectAll){                    
                    this.clientsList.forEach(clientRow => {
                        this.selectedClients.push(clientRow.id)
                    });
                }

                this.selectAll = !this.selectAll
            }
        },
        watch: {
            clientsList: function (value) {
                if (this.clients.length > 0) {
                    const searchQuery = this.searchQuery
                    if (searchQuery) {
                        return this.clients.filter(clientRow => {
                            clientRow.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || clientRow.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) || (clientRow.email && clientRow.email.toLowerCase().includes(searchQuery.toLowerCase()))
                            return clientRow;
                        })
                    }
                    
                    return this.clients
                }

                return value
            }
        }
    }
</script>
<style scoped lang="scss">
::v-deep .form-group{
    margin: 0;
}
::v-deep .custom-control-label::before, 
::v-deep .custom-control-label::after,
::v-deep .custom-control-input {
        width: 2rem;
        height: 2rem;
        left: -2.5rem;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    ::v-deep .custom-control-input{
        left: 0;
    }
    .scrollable {
        max-height: calc(100vh - 237px);
        overflow-y: scroll;
    }
    .all{
        border-radius: 24px;
        padding: 8.5px 16px;
        color: #0c56c9;
        border-color: #d5d7da;
        background-color: #ffffff;
        font-size: 15px;
        font-weight: 400;
        /* line-height: 21px; */
        display: inline-block;
        border: solid 1px #d5d7da;
        line-height: 1;
        box-shadow: 0 4px 6px rgb(16 25 40 / 6%);
        transition: background-color 0.3s ease;
        margin: 10px;
        cursor: pointer;
        &:hover, &:focus, &:active,&.active{
            background-color: #0c56c9 ;
            color: #FFF;
            transition: background-color 0.3s ease;
        }
    }
@media (max-width: 768px) {
    .sub-color{
        font-size: 12px;
    }
}
</style>