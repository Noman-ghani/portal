<template>
    <div v-if="$route.name === 'analytics.index'" class="centralized">
        <b-row>
            <b-col md="6" class="box">
                <b-card>
                    <h2>Finances</h2>
                    <p class="mb-3 font-size-15">Monitor your overall finances including sales, refunds, taxes, payments and more</p>
                    <div class="d-flex border-bottom pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.finances-summary'}">
                            Finances Summary
                        </router-link>
                    </div>
                    <div class="d-flex border-bottom pt-3 pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.payments-summary'}">
                            Payments Summary
                        </router-link>
                    </div>
                    <div class="d-flex border-bottom pt-3 pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.discounts-summary'}">
                            Discounts Summary
                        </router-link>
                    </div>
                    <div class="d-flex border-bottom pt-3 pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.taxes-summary'}">
                            Taxes Summary
                        </router-link>
                    </div>
                    <div class="d-flex border-bottom pt-3 pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.expenses-summary'}">
                            Expenses Summary
                        </router-link>
                    </div>
                    <div class="d-flex pt-3 font-size-17">
                        <router-link :to="{name: 'analytics.sms-summary'}">
                            SMS Summary
                        </router-link>
                    </div>
                </b-card>
            </b-col>
            <b-col md="6" class="box">
                <b-card>
                    <h2>Sales</h2>
                    <p class="mb-3 font-size-15">Analyse the performance of your business by comparing sales across products, staff, channels and more</p>
                    <div class="d-flex border-bottom pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.sales-by-service'}">
                            Sales by Service
                        </router-link>
                    </div>
                    <div class="d-flex border-bottom pt-3 pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.sales-by-product'}">
                            Sales by Product
                        </router-link>
                    </div>
                    <div class="d-flex border-bottom pt-3 pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.sales-by-deal'}">
                            Sales by Deal
                        </router-link>
                    </div>
                    <div class="d-flex border-bottom pt-3 pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.sales-by-staff'}">
                            Sales by Staff
                        </router-link>
                    </div>
                    <div class="d-flex pt-3 font-size-17">
                        <router-link :to="{name: 'analytics.sales-by-location'}">
                            Sales by Location
                        </router-link>
                    </div>
                </b-card>
                <b-card class="mt-4">
                    <h2>Staff</h2>
                    <p class="mb-3 font-size-15">View your team's performance, hours worked as well as commission and tip earnings</p>
                    <div class="d-flex border-bottom pb-3 font-size-17">
                        <router-link :to="{name: 'analytics.staff-commission-summary'}">
                            Staff Commission Summary
                        </router-link>
                    </div>
                    <div class="d-flex pt-3 font-size-17">
                        <router-link :to="{name: 'analytics.staff-commission-detailed'}">
                            Staff Commission Detailed
                        </router-link>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </div>
    <div v-else class="full-centralized">
        <router-view></router-view>
    </div>
</template>