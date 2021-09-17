<template>
    <overlay :show="showLoader" full-height class="centralized">
        <template v-if="!showLoader">
            <heading-with-back :back-link-to="{name: 'setup.index'}" :title="branch.name">
                <template #right>
                    <router-link class="btn btn-primary" :to="{name: 'setup.locations.edit', params: {id: $route.params.id}}">Edit Location</router-link>
                    <b-button v-if="branch.shorturl" variant="primary" @click="$helpers.copyToClipboard(branch.shorturl.url)" v-b-tooltip.hover title="Copy URL to clipboard" class="ml-3">
                        <b-icon-link></b-icon-link> Booking URL
                    </b-button>
                    <b-link :href="branch.servu_url" target="_blank" class="btn btn-primary ml-3">View on ServU</b-link>
                </template>
            </heading-with-back>
            <b-row>
                <b-col md="6">
                    <b-card>
                        <template #header>
                            <h2>Basic Details</h2>
                        </template>
                        <b-form-group label="Location email address" label-for="title">
                            <b-link :href="'mailto:' + branch.email">{{branch.email}}</b-link>
                        </b-form-group>
                        <b-form-group label="Location contact number" label-for="title" class="mt-4 mb-0">
                            <b-link :href="'tel:' + branch.phone_country.phone_code + branch.phone_number">+ {{branch.phone_country.phone_code}} {{branch.phone_number | VMask(branch.phone_country.phone_mask)}}</b-link>
                        </b-form-group>
                    </b-card>
                </b-col>
                <b-col md="6">
                    <b-card class="h-100">
                        <template #header>
                            <h2>Business Types</h2>
                        </template>
                        <ul v-if="businessTypes.length" class="business-types d-flex flex-wrap">
                            <li v-for="businessTypeRow in businessTypes" v-bind:key="businessTypeRow.icon">
                                <img :src="businessTypeRow.url" />
                                <p>{{businessTypeRow.title}}</p>
                            </li>
                        </ul>
                        <p v-else>No Business types added.</p>
                    </b-card>
                </b-col>
            </b-row>
            <b-card class="mt-4">
                <template #header>
                    <h2>Location Address</h2>
                </template>
                <p class="font-size-17">{{completeAddress}}</p>
                <iframe :src="'https://www.google.com/maps?q=' + mapAddress + '&output=embed'" width="100%" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
            </b-card>
            <b-card class="mt-4">
                <template #header>
                    <h2>Opening hours</h2>
                    <p>Opening hours for these locations are default working hours for your staff and will be visible to your clients. You can amend closed dates for events like Bank Holidays in <router-link :to="{name: 'staff.closed-dates'}">Settings</router-link>.</p>
                </template>
                <div class="opening-hours">
                    <b-card v-for="timings in branch.timings" v-bind:key="'timings-' + timings.id">
                        <template #header>
                            {{timings.weekday_text}}
                        </template>
                        <p class="m-0">
                            {{$helpers.formatTime(timings.starts_at)}}
                            <br />-<br />
                            {{$helpers.formatTime(timings.ends_at)}}
                        </p>
                    </b-card>
                </div>
            </b-card>
        </template>
    </overlay>
</template>
<script>
    import Vue from "vue"
    import VueMask from "v-mask"
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"

    Vue.use(VueMask)

    export default {
        components: {
            Overlay,
            HeadingWithBack
        },
        data: function () {
            return {
                showLoader: true,
                branch: {},
                businessTypes: []
            }
        },
        computed: {
            completeAddress: function () {
                return this.branch.address + ", " + this.branch.state.name + ", " + this.branch.city.name
            },
            mapAddress: function () {
                return encodeURI(this.completeAddress)
            }
        },
        created: async function () {
            const branch = await this.$http.get("branches/" + this.$route.params.id + "?with-state&with-city&with-phone-country&with-timings&with-short-url")
            this.branch = branch.data

            const businessTypes = await this.$http.get("utilities/business-types")
            this.businessTypes = businessTypes.data.filter(businessTypeRow => {
                if ([branch.data.business_type_1, branch.data.business_type_2, branch.data.business_type_3].includes(businessTypeRow.icon)) {
                    return businessTypeRow
                }
            })

            this.showLoader = false
        }
    }
</script>
<style lang="scss" scoped>
    .business-types {
        margin: 0;
        justify-content: center;
        li {
            display: flex;
            flex-direction: column;
            border: 1px solid #d5d7da;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0.5rem;
            position: relative;
            width: 130px;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        span {
            width: 50%;
        }
        img {
            width: auto;
            height: auto;
            max-width: 70px;
            max-height: 50px;
        }
        p {
            margin: 1rem 0 0;
        }
        :hover,
        .active {
            background: #e5f1ff;
        }
        .active {
            &:after {
                content: url('data:image/svg+xml; utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" /></svg>');
                position: absolute;
                top: -8px;
                right: -8px;
                width: 20px;
                height: 20px;
                background: #0C56C9;
                border-radius: 50%;
            }
        }
    }
    .opening-hours {
        display: flex;
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
        .card {
            width: 130px;
            margin:10px;
            .card-header {
                background: #e5f1ff;
                color: #0C56C9;
                font-size: 14px;
                font-weight: 700;
                text-align: center;
            }
            .card-body {
                text-align: center;
            }
        }
    }
</style>