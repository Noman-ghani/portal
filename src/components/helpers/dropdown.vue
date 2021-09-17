<template>
    <b-dropdown ref="dropdown" v-bind="$attrs">
        <template v-if="!$attrs.text" #button-content>
            <slot v-if="'button-content' in $slots" name="button-content"></slot>
            <b-icon-list v-else></b-icon-list>
        </template>
        <slot />
    </b-dropdown>
</template>
<style scoped lang="scss">
    ::v-deep .dropdown-menu {
        box-shadow: 0 2px 5px 0 rgb(164 173 186 / 25%);
        border: 1px solid #eef0f2;
        border-radius: 3px;
        margin: 0;
        padding: 0;
        li {
            border-bottom: 1px solid #dfdfdf;
            text-align: center;
            a {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                background-color: transparent;
                border-bottom: 1px solid #dee3e7;
                transform: translateY(0);
                transition: 0.3s ease all;
                color: #101928;
                &:last-child {
                    border-bottom: 0;
                }
                &:hover {
                    transform: translateY(-1px);
                    transition: 0.3s ease all;
                }
            }
        }
    }
</style>