<template>
    <b-row :class="{'heading-with-back': true, 'with-padding': true}">
        <b-col :md="'right' in $slots ? 6 : 12">
            <div class="title">
                <h1>
                    <router-link v-if="backLinkTo" :to="backLinkTo" class="go-back">
                        <b-icon-arrow-left />
                    </router-link>
                    <slot v-if="'title' in $slots" name="title"></slot>
                    <template v-else>{{title}}</template>
                </h1>
                <p v-if="description">{{description}}</p>
                <p v-if="'description' in $slots">
                    <slot name="description"></slot>
                </p>
                <slot name="left"></slot>
            </div>
        </b-col>
        <b-col v-if="'right' in $slots" md="6" class="text-right">
            <slot name="right"></slot>
        </b-col>
    </b-row>
</template>
<script>
    export default {
        props: {
            backLinkTo: {
                type: Object
            },
            title: {
                type: String,
                default: ""
            },
            description: {
                type: String,
                default: ""
            }
        }
    }
</script>
<style scoped lang="scss">
    .heading-with-back {
        &.with-padding {
            padding-bottom: 24px;
        }
        align-items: center;
        h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 0;
            .go-back {
                color: #000000;
                svg {
                    width: 25px;
                    height: 25px;
                    margin-right: 16px;
                    float: left;
                    margin-top: 1px;
                }
            }
        }
        p {
            margin-top: 0.5rem;
            margin-bottom: 0;
            color: #7b7b7c;
            font-size: 15px;
        }
        .buttons-area {
            display: grid;
            grid-auto-flow: row;
            grid-template-columns: repeat(2, auto);
            grid-row-gap: 24px;
            grid-column-gap: 16px;
            align-items: flex-start;
            .download-dropdown,
            .btn {
                min-width: 120px;
                max-width: 120px;
            }
        }
    }
    @media only screen and (max-width: 768px) {
        .heading-with-back {
            .go-back {
                display: none;
            }
            p {
                margin-left: 0;
            }
        }
    }
</style>