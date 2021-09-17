<template>
    <div>
        <div v-if="$route.name == 'setup.index'" class="centralized">
            <b-row>
                <b-col md="6" class="box">
                    <b-card>
                        <h2>Account Setup</h2>
                        <router-link :to="{name: 'setup.account-settings'}" class="card-row">
                            <span class="title">Account Settings</span>
                            <span class="description">Manage settings such as your business name and time zone</span>
                        </router-link>
                        <router-link :to="{name: 'setup.locations'}" class="card-row">
                            <span class="title">Locations</span>
                            <span class="description">Manage multiple outlets for your business</span>
                        </router-link>
                    </b-card>
                    <b-card class="mt-4">
                        <h2>SMS Settings</h2>
                        <router-link :to="{name: 'sms-templates.index'}" class="card-row">
                            <span class="title">SMS Templates</span>
                            <span class="description">Set sms templates for your customers</span>
                        </router-link>
                    </b-card>
                </b-col>
                <b-col md="6" class="box">
                    <b-card>
                        <h2>Point of Sale</h2>
                        <router-link :to="{name: 'setup.invoice-sequencing'}" class="card-row">
                            <span class="title">Invoice Sequencing</span>
                            <span class="description">Set custom prefixes and number sequence for invoices</span>
                        </router-link>
                        <router-link :to="{name: 'setup.taxes'}" class="card-row">
                            <span class="title">Taxes</span>
                            <span class="description">Manage tax rates that apply to items sold at checkout</span>
                        </router-link>
                        <router-link :to="{name: 'setup.discounts'}" class="card-row">
                            <span class="title">Discounts</span>
                            <span class="description">Setup manual discounts for use during checkout</span>
                        </router-link>
                        <router-link :to="{name: 'setup.sales-settings'}" class="card-row">
                            <span class="title">Sales Settings</span>
                            <span class="description">Manage sales settings such as staff commissions</span>
                        </router-link>
                    </b-card>
                </b-col>
            </b-row>
        </div>
        <router-view v-else />
    </div>
</template>
<style lang="scss" scoped>
    h2 {
        margin-bottom: 1.5rem;
    }
    .card {
        .card-row {
            display: block;
            margin: 1rem 0;
            padding-bottom: 1rem;
            border-bottom: 1px solid #DEE3E7;

            span {
                display: block;
            }

            &:first-child,
            &:last-child {
                margin-top: 0.5rem;
            }
            &:last-child {
                border: 0;
                padding: 0;
                margin-bottom: 0.5rem;
            }
        }
    }
    @media only screen and (max-width: 768px) {
        .box {
            margin-bottom: 5rem;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>