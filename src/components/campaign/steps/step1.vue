<template>
    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}" class="d-flex flex-column flex-grow-1">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off" class="d-flex flex-column flex-grow-1">
                <div class="flex-grow-1">
                    <ValidationProvider vid="msg-name" name="Campaign Name" :rules="{required: true}" v-slot="{errors}">
                        <b-form-group
                        class="pt-4 pl-3 pr-3 pb-4 border-bottom"
                        description="This is not visible to clients."
                        label="Campaign Name"
                        label-for="msg-name">
                            <b-form-input id="msg-name" v-model="msg.name" :class="{'is-invalid': errors[0]}"></b-form-input>
                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                        </b-form-group>
                    </ValidationProvider>
                    <div class="p-3">
                        <h3 class="title m-0">Text</h3>
                    </div>
                    <ValidationProvider vid="msg" name="Message" :rules="{required: true}" v-slot="{errors}">
                        <b-form-group
                        class="pt-0 pl-3 pr-3 pb-4 border-bottom position-relative"
                        description="All links will be added at the end of text message"
                        label="Message"
                        label-for="msg">
                            <small class="limiter text-muted">{{msg.characters}}</small>
                            <b-form-textarea
                            id="msg"
                            placeholder="Type message here"
                            rows="4"
                            v-model="msg.text"
                            no-resize
                            :class="{'is-invalid': errors[0]}"
                            @keyup="charactersLeft()"
                            ></b-form-textarea>
                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                        </b-form-group>
                    </ValidationProvider>
                    <div class="p-3">
                        <h3 class="title m-0">Links</h3>
                    </div>
                    <b-form-group class="pt-0 pl-3 pr-3 pb-4" >
                        <b-form-radio name="radio-size" class="mb-4" @change="getLinks(selected_link)" v-model="selected_link" value="">No Links <small class="text-muted d-block">No link will be added on text message.</small></b-form-radio>
                        <b-form-radio name="radio-size" class="mb-4" @change="getLinks(selected_link)" v-model="selected_link" value="deals">Deals Links <small class="text-muted d-block">Add a deal shortlink to text message</small></b-form-radio>
                        <b-form-radio name="radio-size" class="mb-4" @change="getLinks(selected_link)" v-model="selected_link" value="branches">Booking Links <small class="text-muted d-block">Add a booking shortlink to text message</small></b-form-radio>
                    </b-form-group>
                    <div>
                        <items-modal ref="items-modal" v-if="load_items" :deal-url-params="{'with-inclusions': true, 'with-short-url': true}" :componentToShow="load_items" @selected="onItemSelected($event)"></items-modal>
                    </div>
                </div>
                <div class="p-3 border-top">
                    <div class="d-flex">
                        <router-link :to="{name: 'campaign'}" class="btn btn-primary flex-basis-50 mr-2">Cancel</router-link>
                        <submit-button ref="submit-button" type="submit" class="btn flex-basis-50 ml-2 btn-primary" :disabled="invalid">Next Step</submit-button>
                    </div>
                </div>
        </b-form>
    </ValidationObserver>
</template>
<script>
import Vue from "vue"
import ItemsModal from "../../items-modal.vue"
import * as VeeValidate from "../../../plugins/vee-validate"
import SubmitButton from "@/components/helpers/submit-button.vue"

Vue.use(VeeValidate)

export default {
    components: {
        ItemsModal,
        SubmitButton
    },
    data: function(){
        return {
            msg:{
                name: '',
                text: 'Lorem Ipsum is simply a dummy text of the printing and typesetting industry.',
                limit: 160,
                characters: '',
                short_url: null
            },
            selected_link: '',
            load_items: ''
        }
    },
    created: function(){
        if(this.$route.params.id){
            this.$http.get("sms-campaign/"+this.$route.params.id)
            .then(responce => {
                this.msg.name = responce.data.name
                this.msg.text = responce.data.message
                this.msg.short_url = responce.data.short_url
                if(responce.data.short_url){
                    this.selected_link = responce.data.short_url.type == 'branch' ? 'branches' :  responce.data.short_url.type;
                }
                this.$emit('msg',this.msg);
                this.charactersLeft()
            })
        }
        this.$emit('msg',this.msg);
        this.charactersLeft()
    },
     mounted(){
        this.$root.$on('bv::modal::hide',() => {
            this.load_items = ''
        })
    },
    methods: {
        getLinks: function(value){
            this.load_items = value
            if(value != ''){
                setTimeout(() => {
                    this.$refs['items-modal'].$refs['modal'].show() 
                });
            }
            this.$emit('short_url',value);
            this.charactersLeft()
        },
        onItemSelected: function(event){
            if(event.data.shorturl){
                this.msg.short_url = event.data.shorturl;
                this.$emit('msg',this.msg);
                this.$refs['items-modal'].$refs['modal'].hide();
                this.charactersLeft()
                this.load_items = ''
            }else{
                this.$helpers.showToast('danger', 'Short Url Not Found. Please Select another one.');
            }

        },
        charactersLeft: function() {
            // this.msg.text = htmlentities(this.msg.text)
            
            // Per msg text mimit
            let textLimit = 160
            // Character count in msg box with url
            var char = this.msg.text.length + (this.msg.short_url ? this.msg.short_url.url.length + 1 : 0)
            // Msg count
            let msg = Math.floor(char / textLimit) + 1 
            // Chracter limit as per text on msg box
            let limit = this.msg.limit * msg;

            this.msg.characters = (char) + " / " + limit + " ("+ msg + " message)";
            
            // Send text to parent component
            this.$emit('msg',this.msg);

        },
        onSubmit: function () {
            this.$refs["submit-button"].displayLoader = true
            if(this.msg){
                let form = new Object();
                form.name = this.msg.name
                form.message = this.msg.text
                if(!this.$route.params.id){
                    form.status = 'draft'
                }
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
                        this.$route.params.id = response.data.campaign_id 
                        let urlName = this.$route.params.id ? "edit.step-2" : 'step-2'
                        this.$router.push({name: urlName})
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
.form-group{
    margin-bottom: 0;
    & > div {
    font-size: 15px;  
    }
}
.limiter {
    position: absolute;
    right: 20px;
    top: 5px;
}
</style>