<template>
    <overlay :show="showLoader" :full-height="true">
        <div class="centralized d-flex flex-column align-items-center justify-content-start flex-wrap bg-shadow" v-if="!showLoader && campaigns.length > 0">
            <router-link :to="{name: 'campaign.add'}" class="btn btn-primary add-campaign-btn">New Campaign</router-link>
            <div class="d-flex flex-wrap">
                <b-card class="block-card" v-for="campaign in campaigns" v-bind:key="campaign.id">
                        <div class="w-100">
                            <div class="block_list d-flex align-items-center" :class="{'flex-wrap justify-content-center text-center': $screen.width <= 992, 'justify-content-between': $screen.width > 992}">
                                <div class="block-title d-flex align-items-center" :class="{'flex-wrap justify-content-center': $screen.width <= 992}">
                                    <div class="nick-name">
                                        <p class="inner d-flex justify-content-center align-items-center">
                                            <!-- {{campaign.name.charAt(0)}} -->
                                            <b-icon-chat-dots-fill font-scale="1.5"/>
                                        </p>
                                    </div>
                                    <div class="full-name" :class="{'w-100 mt-4 mb-4': $screen.width <= 992}">
                                        <h4>{{campaign.name}}</h4>
                                        <p class="campaign-text">{{campaign.message}}</p>
                                        <p class="mt-2"><b-badge :variant="campaign.status == 'draft'? 'danger' : 'success'">{{campaign.status}}</b-badge></p>
                                    </div>
                                </div>
                                <div class="btns-area d-flex justify-content-around align-items-center">
                                    <div>
                                        <router-link :to="{name : 'campaign.edit', params: {id: campaign.id}}" class="mr-4">
                                            <span v-b-tooltip.hover title="Edit Campaign">
                                                <b-icon-pencil font-scale="1.4" class="text-primary"/>
                                            </span>
                                        </router-link>
                                        <span class="pointer" v-b-tooltip.hover title="Delete Campaign" @click="deleteCampaign(campaign.id)">
                                            <b-icon-trash font-scale="1.6" class="text-danger"/>
                                        </span>
                                    </div>
                                    <div class="pointer" @click="runCampaign(campaign)" v-if="campaign.status !== 'draft'">
                                        <span v-b-tooltip.hover title="Run Campaign">
                                            <b-icon-play-circle-fill font-scale="1.6" class="text-success"/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                </b-card>
            </div>
        </div>
        <div class="no-data bg-shadow" v-else>
            <div class="p-4" v-if="!showLoader">
                <div class="row">
                    <div class="col-sm-6 first-col">
                        <p class="servu-title">
                            ServU
                            <span class="plus">Plus</span>
                        </p>
                        <p class="no-heading">
                            Send smart marketing offers
                        </p>
                        <p class="detail">
                            Boost sales and fill your calendar with a suite of intelligent marketing tools. Retain and reward clients using smart targeting and personalize offers for birthdays, lapsing clients and more.
                        </p>
                        <router-link :to="{name: 'step-1'}" class="btn btn-primary pl-4 pr-4 mt-4">Start Now</router-link>
                    </div>
                    <div class="col-sm-6 second-col">
                        <img src="@/assets/images/add-campaign.png" alt="Add Image" class="w-100"/>
                    </div>
                </div>
            </div>
        </div>
    </overlay>
</template>
<script>
import Overlay from "../helpers/overlay.vue"
export default {
    components: {
        Overlay,
    },
    data: function () {
        return {
            showLoader: true,
            campaigns: null
        }
    },
    created: function(){
        this.$http.get('sms-campaign')
        .then(res => {
            this.campaigns = res.data;
            this.campaigns.filter(camp => {
                camp.filter = JSON.parse(camp.filter);
                return camp;
            })
            this.showLoader = false
        })
    },
    methods:{
        deleteCampaign: function (id){
            this.showLoader = true
            this.$http.delete('sms-campaign/'+id)
            .then(res => {
                if (res.data.success) {
                    this.$helpers.showToast("success", res.data.message)
                    this.campaigns = res.data.campaigns;
                    if(res.data.campaigns.length > 0){
                        this.campaigns.filter(camp => {
                            camp.filter = JSON.parse(camp.filter);
                            return camp;
                        })
                    }
                } else {
                    this.$helpers.showToast("danger", res.data.message)
                }
                this.showLoader = false
            })
            .catch((err) => {
                console.log(err);
            })
        },
        runCampaign: function(campaign){
            this.$bvModal.msgBoxConfirm(`Please confirm that you really want to run '${campaign.name}' campaign.`, {
            title: 'Confirm',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'success',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true
            })
            .then(value => {
                if(value){
                    this.$http.post("sms-campaign/run/"+campaign.id)
                    .then(response => {
                        console.log(response.data.success);
                        if(response.data.success){
                            this.$helpers.showToast("success", response.data.message)
                        }else{
                            this.$helpers.showToast("danger", response.data.message)
                        }
                    })
                }
            })
            .catch(errors => {
                this.$helpers.showToast("danger", errors.response.data)
            })
        }   
    }
    
}
</script>
<style lang="scss" scoped>
.bg-shadow{
    position: relative;
    &:after{
        content: "";
        background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'><circle cx='1' cy='1' r='1' fill='%230C56C9'/></svg>") no-repeat calc(50% + 490px) 112%/auto 200%,linear-gradient(180deg, #f6f7f8 0%, transparent 100%);
        position: absolute;
        z-index: -1;
        height: 100%;
        top: 0;
        right: 0;
        width: 100%;
        opacity: 0.4;
    }
    &.centralized{
        position: static;
        &:before{
                content: "";
                background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'><circle cx='1' cy='1' r='1' fill='%230C56C9'/></svg>");
                position: fixed;
                z-index: -1;
                bottom: 0;
                left: 0;
                width: 100%;
                background-repeat: no-repeat;
                overflow: hidden;
                background-position: 190px 250px;
        }
        &:after,&:before{
            position: fixed;
            opacity: 0.15;
            height: 60%;
        }
    }
}
.no-data{
    .first-col {
        padding-top: 106px;
        align-self: flex-start;
        flex-basis: 45%;
        .servu-title {
            font-size: 32px;
            line-height: 38px;
            color: #101928;
            font-weight: 700;
            .plus{
                color: #ffc00a;
            }
        }
        .no-heading {
            font-size: 56px;
            font-weight: 800;
            line-height: 70px;
        }
        .detail {
            font-size: 17px;
            font-weight: 400;
            line-height: 24px;
        }
    }
    .second-col {
        flex-basis: 55%;
        height: 600px;
        img{
            pointer-events: none;
            user-select: none;
        }
    }
}

.campaign-text{
    font-size: 14px;
}
.btns-area{
    width: 150px;
}
.add-campaign-btn{
    align-self: flex-end;
    margin-bottom: 20px;
}
::v-deep .block-card {
    width: 100%;
    @media (max-width:992px) {
        max-width: 240px;
        margin: 0 10px;
    }
    .card-body{
        .block_list{
            .block-title{
               max-width: 800px;
               .full-name{
                   width: calc(100% - 130px);
                   .campaign-text{
                        text-overflow: ellipsis;
                        width: 100%;
                        white-space: nowrap;
                        overflow: hidden;
                        @media (max-width: 1280px) {
                            max-width: 400px;
                        }
                        @media (max-width: 992px) {
                            margin: auto;
                        }
                   }
               }
               .nick-name {
                    @media (max-width:992px) {
                        margin: 0;
                    } 
               }
           }
        }
    } 
}
</style>