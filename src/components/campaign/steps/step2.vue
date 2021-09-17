<template>
    <div class="d-flex flex-column flex-grow-1 ">
        <div class="d-flex flex-column flex-grow-1 ">
            <div class="p-3">
                <h3 class="title m-0">Audience</h3>
                <p class="subtitle">Choose which clients will receive your message</p>
                <b-tabs lazy>
                    <b-tab :active="selectedFilter.length === 0">
                        <template #title>
                            <div @click="getAllClients" class="inner">
                                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="25"><g fill="none" fill-rule="evenodd"><circle fill="#0C56C9" cx="10" cy="10" r="10"></circle><path d="M13.817 6.265a.666.666 0 01.91-.148.62.62 0 01.202.801l-.05.08-4.953 6.737a.666.666 0 01-.88.168l-.075-.054-3.742-3.092a.618.618 0 01-.073-.89.667.667 0 01.842-.126l.077.055 3.2 2.644 4.542-6.175z" fill="#FFF" fill-rule="nonzero"></path></g></svg>
                                <span class="heading">All clients</span>
                                <span class="detail">Send to every client in your client list.</span>
                            </div>
                        </template>
                    </b-tab>

                    <b-tab :active="selectedFilter.length > 0"> 
                        <template #title>
                            <div class="inner">
                                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="25"><g fill="none" fill-rule="evenodd"><circle fill="#0C56C9" cx="10" cy="10" r="10"></circle><path d="M13.817 6.265a.666.666 0 01.91-.148.62.62 0 01.202.801l-.05.08-4.953 6.737a.666.666 0 01-.88.168l-.075-.054-3.742-3.092a.618.618 0 01-.073-.89.667.667 0 01.842-.126l.077.055 3.2 2.644 4.542-6.175z" fill="#FFF" fill-rule="nonzero"></path></g></svg>
                                <span class="heading">Client groups</span>
                                <span class="detail">Choose groups of clients in your client list.</span>
                            </div>
                        </template>
                        <div>
                            <clients-sms-filter v-if="showFilters" :get_filter="selectedFilter[0]"  @selected="onFilterSelected($event)"></clients-sms-filter>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
            <div class="p-3">
                <h3 class="title m-0">Total clients</h3>
                <p class="subtitle">View and edit the clients your message will be sent to.</p>
                <div class="view-clients">
                    <p class="m-0">{{clients.data.length}} Clients</p>
                    <span @click="$refs['clients-select-modal'].$refs.modal.show()" class="edit">Edit</span>
                </div>
            </div>
        </div>
        <div class="p-3 border-top">
            <div class="d-flex">
                <router-link :to="{name: 'campaign'}" class="btn btn-primary flex-basis-50 mr-2">Cancel</router-link>
                <b-button variant="primary" @click="saveCampaign" class="flex-basis-50 ml-2">Save</b-button>
            </div>
        </div>
        <clients-select-modal ref="clients-select-modal" v-if="clients.status" :clients="clients.orignal" @selected="onClientSelected($event)" :all="true"></clients-select-modal>
    </div>
</template>
<script>
import ClientsSmsFilter from '../../clients-sms-filter.vue'
import ClientsSelectModal from '../../clients-select-modal.vue'
export default {
    components:{
        ClientsSelectModal,
        ClientsSmsFilter,
    },
    props:{
        msg: {},
    },
    data: function(){
        return {
            clients: {
                status: false,
                data: [],
                orignal: [],
                filter: null
            },
            selectedFilter: [],
            showFilters: false
        }
    },
    created: function(){

        if (this.$route.params.id) {
            this.$http.get("sms-campaign/"+this.$route.params.id)
            .then(responce => {
                let tmp_clients = []
                responce.data.clients.forEach(data => {
                    tmp_clients.push(data.client); 
                });

                this.clients.data = this.clients.orignal = tmp_clients

                this.clients.filter = JSON.parse(responce.data.filter);
                
                if(this.clients.filter){
                    this.selectedFilter = Object.keys(this.clients.filter);
                }

                if(responce.data.clients.length === 0 && !this.clients.filter){
                    this.getAllClients();
                }

                this.msg.name = responce.data.name
                this.msg.text = responce.data.message
                this.msg.short_url = responce.data.short_url
                this.showFilters = true
                this.clients.status = true
                this.$emit('msg',this.msg);
            })
            .catch(err => {
                console.log(err);
            })
        }else{

            this.getAllClients();

            if(Object.keys(this.msg).length === 0){
                if(this.$route.params.id){
                    this.$router.push({name: "edit.step-1"})
                }else{
                    this.$router.push({name: "step-1"})
                } 
            }
        }

        this.$emit('msg',this.msg);
    },
    methods:{
        getAllClients: function(){
            this.clients.status = false
            this.$http.get("clients?with-phone-country")
            .then(clients => {
                this.clients.data = this.clients.orignal = clients.data
                this.showFilters = true
                this.clients.filter = null
                this.selectedFilter = []
                this.clients.status = true
            })
        },
        onClientSelected: function ($event) {
            this.clients.data = $event;
            this.clients.status = true
        },
        onFilterSelected: function ($event) {
            this.clients.status = false
            setTimeout(() => {
                this.clients.data = this.clients.orignal = $event.clients;
                this.clients.filter = $event.filter;
                this.clients.status = true
            });
        },
        saveCampaign: function(){
            if(Object.keys(this.msg).length > 0){
                let form = new Object();
                form.name = this.msg.name
                form.message = this.msg.text
                form.clients = this.clients.data
                form.filter = this.clients.filter
                form.status = 'complete'
                if(this.msg.short_url){
                    form.short_url_id = this.msg.short_url.id
                }
                let axios = null

                if (this.$route.params.id) {
                    axios = this.$http.put("sms-campaign/" + this.$route.params.id, form)
                } else {
                    axios = this.$http.post("sms-campaign", form)
                }

                axios.then(response => {
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$router.push({name: "campaign"})
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .nav-tabs{
    border:none;
    .nav-item {
        width: calc(50% - 10px);
        a{
            white-space: normal;
            border: 1px solid #d5d7da;
            padding: 0;
            margin: 0;
            &.active{
                border-color: #0C56C9;
                background: #e5f1ff;
                svg{
                    display: block;
                }
            }
            svg{
                display: none;
                position: absolute;
                right: -10px;
                top: -10px;
                width: 24px;
            }
            &:after{
                content:none
            }
            .heading{
                font-size: 17px;
                font-weight: 700;
                line-height: 24px;
                color: #101928;
                text-transform: capitalize;
                margin-bottom: 3px;
                display: block;
            }
            .detail{
                font-size: 13px;
                font-weight: 400;
                line-height: 19px;
                color: #101928;
                max-width: 170px;
                display: block;
                margin: auto;
            }
            .inner{
                padding: 20px;
            }
        }
        &:first-child{
            margin-right: 20px;
        }
    }
}
.view-clients{
    background-color: #f2f2f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid #f2f2f7;
    width: 100%;
    .edit{
        transition: border-color 150ms ease-in-out;
        border-bottom: 1px solid transparent;
        margin-bottom: -1px;
        word-break: break-all;
        font-size: 17px;
        font-weight: 400;
        line-height: 24px;
        color: #0C56C9;
        &:hover{
            border-color: #0C56C9;
        }
    }
}
::v-deep #client-groups {
    padding-top: 20px;
    .custom-control{
        width: 100%;
        margin: 10px 0;
        label{
            width: 100%;
        }
    }
}
</style>