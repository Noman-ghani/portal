<template>
<b-container fluid>
    <overlay :show="loader" full-height>
        <b-row>
            <b-col md="7" class="left-side p-0">
                <div class="scrollable pt-5">
                    <div class="mobile-wrapper d-flex align-items-center justify-content-center flex-wrap">
                        <p class="heading mt-3 mb-3">Message Preview</p>
                        <div class="mobile">
                            <div class="mobile-top d-flex align-items-center justify-content-center flex-wrap">
                                <div class="speaker-area"></div>
                            </div>
                            <div class="mobile-body">
                                <div class="chat">
                                    <p class="m-0">
                                        <span v-if="msg.text">{{msg.text}}</span> 
                                        <router-link to="" v-if="msg.short_url" class="link d-block">{{msg.short_url.url}}</router-link>
                                    </p>
                                    <span class="left-seprater">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 27"><path fill-rule="evenodd" d="M7.0087928 0s.4228315 11.9906796-.477657 17.6725139C5.6306474 23.3543481.2728575 26.5754605.2728575 26.5754605c-.3592855.2426478-.2955957.4351557.1465609.4195844 0 0 8.85898603.1312245 16.62040744-5.4847054C24.80124725 15.8944096 7.0087928 0 7.0087928 0z"></path></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </b-col>
            <b-col md="5" class="right-side bg-white border-left p-0 d-flex flex-column">
                <router-view :msg="msg" v-on:msg="printMsgOnMobile($event)" v-on:short_url="show_short_url($event)"/>
            </b-col>
        </b-row>
    </overlay>
</b-container>
</template>
<script>
import Overlay from "../helpers/overlay.vue"
// import moment from "moment"
export default {
    components: {
        Overlay,
    },
    data(){
        return {
            msg: {},
            loader: true,
        }
    },
    mounted: function(){
        this.loader = false
    },
    watch:{
        msg: function(msg){
            this.msg = msg
        }
    },
    methods:{
        printMsgOnMobile: function(msg){
            if(msg.text == undefined){
                if(this.$route.params.id){
                    this.$router.push({name: "edit.step-1"})
                }else{
                    this.$router.push({name: "step-1"})
                } 
            }
            this.msg = msg
        },
        show_short_url: function(data){
            this.msg.short_url = data
        }
    }
}
</script>
<style scoped lang="scss">
/* Mobile CSS Start*/
.mobile-wrapper {
    width: 360px;
    border: 1px solid #d5d7da;
    border-radius: 64px;
    margin-bottom: 32px;
    margin: auto;
    .mobile{
        width: 100%;
        border-radius: 64px;
        height: 100%;
        margin-bottom: -1px;
        margin-left: -1px;
        margin-right: -1px;
        background: white;
        box-shadow: 0 16px 32px 0 rgb(16 25 40 / 16%);
        .speaker-area {
            background-color: #e8e8ee;
            border-radius: 4px;
            height: 8px;
            width: 85px;
            margin: 30px 0;
        }
        .mobile-body {
            height: 568px;
            margin: 0;
            padding: 0 12px;
            padding-bottom: 64px;
            overflow: hidden;
            .chat {
                align-self: flex-start;
                background: #e8e8ee;
                font-size: 17px;
                font-weight: 400;
                line-height: 24px;
                pointer-events: none;
                position: relative;
                display: inline-block;
                overflow-wrap: break-word;
                padding: 16px;
                border-radius: 16px;
                margin: 5px;
                width: 85%;
                white-space: pre-wrap;
                .left-seprater {
                    position: absolute;
                    bottom: -4px;
                    left: -5px;
                    z-index: 1;
                    width: 20px;
                    height: 20px;
                    svg{
                        fill: #e8e8ee;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%; 
                    }
                }
            }
        }
    }
}
/* Mobile CSS End*/

    @media (min-width: 992px) {
        .left-side {
            .scrollable {
                height: calc(100vh - 71px);
                overflow: hidden;
                .wrapper {
                    width: 80%;
                    margin: 0 auto;
                }
            }
        }
        .right-side {
            height: calc(100vh - 71px);
            overflow: auto;
        }
    }
    .click-to-close {
        &:hover {
            .bi-x {
                transition: transform 150ms ease;
                transform: rotate(-180deg);
            }
        }
    }
    .bi-x,
    .bi-list {
        transition: transform 150ms ease;
        &:hover {
            transform: rotate(-180deg);
        }
    }
</style>