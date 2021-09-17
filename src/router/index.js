import VueRouter from "vue-router"
import Store from "../store"

const routes = [{
    path: "/",
    component: require("../components/layouts/Theme").default,
    meta: { requiresAuth: true },
    beforeEnter: async (to, from, next) => {
        await Store.dispatch("user")
        next()
},
    redirect: {
        name: "calendar"
    },
    children: [{
        "name": "thankyou",
        "path": "thankyou"
    }, {
        "name": "subscription.index",
        "path": "subscription",
        component: require("../components/subscription").default,
        meta: {
            heading: "Subscription Manager"
        }
    }, {
        name: "my-settings",
        path: "my-settings",
        component: require("../components/my-settings").default,
        meta: {
            heading: "My Settings"
        }
    }, {
        name: "calendar",
        path: "calendar",
        component: require("../components/calendar").default,
        meta: {
            heading: "Calendar"
        },
    }, {
        name: "calendar.appointments",
        path: "appointments",
        component: require("../components/calendar/schedule-appointment").default,
        meta: {
            heading: "New Appointment"
        },
        beforeEnter: (to, from, next) => {
            if (to.query.branch_id && to.query.date) {
                next()
            } else {
                next({ name: "calendar" })
            }
        }
    }, {
        name: "calendar.appointments.view",
        path: "appointments/:id",
        component: require("../components/calendar/view-appointment").default,
        meta: {
            heading: "View Appointment"
        }
    }, {
        name: "calendar.appointments.edit",
        path: "appointments/:id/edit",
        component: require("../components/calendar/schedule-appointment").default,
        meta: {
            heading: "Edit Appointment"
        }
    }, {
        name: "sales",
        path: "sales",
        component: require("../components/sales").default,
        meta: {
            heading: "Sales"
        },
        children: [{
            name: "sales.daily-sales",
            path: "daily-sales",
            component: require("../components/sales/daily-sales").default,
        }, {
            name: "sales.appointments",
            path: "appointments",
            component: require("../components/sales/appointments").default,
        }, {
            name: "sales.invoices",
            path: "invoices",
            component: require("../components/sales/invoices").default,
        }]
    },
    {
        name: "checkout",
        path: "checkout",
        component: require("../components/checkout").default,
        meta: {
            heading: "Checkout"
        },
        beforeEnter: (to, from, next) => {
            if (to.query.branch_id) {
                next()
            } else {
                next({ name: "calendar" })
            }
        }
    }, {
        name: "view.invoice",
        path: "invoice/:id",
        component: require("../components/invoices/").default,
        meta: {
            heading: "Invoice"
        }
    }, {
        name: "refund.invoice",
        path: "invoice/refund/:id",
        component: require("../components/invoices/refund").default,
        meta: {
            heading: "Refund"
        }
    }, {
        name: "clients",
        path: "/clients",
        component: require("../components/clients/").default,
        meta: {
            heading: "Clients"
        },
    }, {
        name: "clients.add",
        path: "/clients/add",
        component: require("../components/clients/form").default,
        meta: {
            heading: "Clients - Add"
        }
    }, {
        name: "clients.edit",
        path: "/clients/edit/:id",
        component: require("../components/clients/form").default,
        meta: {
            heading: "Clients - Edit"
        }
    }, {
        name: "clients.view",
        path: "/clients/view/:id",
        meta: {
            heading: "Client Profile"
        },
        component: require("../components/clients/profile").default,
        children: [{
            name: "clients.block",
            path: "block",
            component: require("../components/clients/block").default
        }, {
            name: "clients.unblock",
            path: "unblock",
            component: require("../components/clients/unblock").default
        }],
    }, {
        name: "staff.calendar",
        path: "staff/calendar",
        component: require("../components/staff/calendar/").default,
        meta: {
            heading: "Staff",
            parentComponent: "staff"
        }
    }, {
        name: "staff.closed-dates",
        path: "staff/closed-dates",
        component: require("../components/staff/closed-dates/").default,
        meta: {
            heading: "Staff",
            parentComponent: "staff"
        },
        children: [{
            "name": "staff.closed-dates.add",
            "path": "add",
            component: require("../components/staff/closed-dates/form").default
        }, {
            "name": "staff.closed-dates.edit",
            "path": "edit/:id",
            component: require("../components/staff/closed-dates/form").default,
            beforeEnter: (to, from, next) => {
                if (to.params.data) {
                    next()
                } else {
                    next({ name: "staff.closed-dates" })
                }
            }
        }, {
            "name": "staff.closed-dates.delete",
            "path": "delete/:id",
            component: require("../components/staff/closed-dates/delete").default,
            beforeEnter: (to, from, next) => {
                if (to.params.title) {
                    next()
                } else {
                    next({ name: "staff.closed-dates" })
                }
            }
        }]
    }, {
        name: "staff.employees",
        path: "staff/employees",
        component: require("../components/staff/employees/").default,
        meta: {
            heading: "Staff",
            parentComponent: "staff"
        },
    }, {
        name: "staff.employees.add",
        path: "staff/employees/add",
        component: require("../components/staff/employees/form").default,
        meta: {
            heading: "Staff",
            parentComponent: "staff"
        }
    }, {
        name: "staff.employees.edit",
        path: "staff/employees/edit/:id",
        component: require("../components/staff/employees/form").default,
        meta: {
            heading: "Staff",
            parentComponent: "staff"
        }
    }, {
        name: "staff.permissions",
        path: "staff/permissions",
        component: require("../components/staff/permissions/").default,
        meta: {
            heading: "Staff",
            parentComponent: "staff"
        }
    }, {
        name: "services",
        path: "services",
        component: require("../components/services/").default,
        meta: {
            heading: "Services"
        },
        children: [{
            name: "services.category.add",
            path: "categories/add",
            component: require("../components/services/categories/form").default
        }, {
            name: "services.category.edit",
            path: "categories/edit/:id",
            component: require("../components/services/categories/form").default,
            beforeEnter: (to, from, next) => {
                if (to.params.data) {
                    next()
                } else {
                    next({ name: "services" })
                }
            }
        }, {
            name: "services.category.delete",
            path: "categories/delete/:id",
            component: require("../components/services/categories/delete").default,
            beforeEnter: (to, from, next) => {
                if (to.params.title) {
                    next()
                } else {
                    next({ name: "services" })
                }
            }
        }]
    }, {
        name: "services.service.add",
        path: "services/add",
        component: require("../components/services/service").default,
        meta: {
            heading: "Services"
        }
    }, {
        name: "services.service.edit",
        path: "services/edit/:id",
        component: require("../components/services/service").default,
        meta: {
            heading: "Services"
        }
    }, {
        name: "inventory.products",
        path: "inventory/products",
        component: require("../components/inventory/products").default,
        meta: {
            heading: "Inventory - Products",
            parentComponent: "inventory"
        }
    }, {
        name: "inventory.products.add",
        path: "inventory/products/add",
        component: require("../components/inventory/products/form").default,
        meta: {
            heading: "Inventory - Products",
            parentComponent: "inventory"
        }
    }, {
        name: "inventory.products.edit",
        path: "inventory/products/edit/:id",
        component: require("../components/inventory/products/form").default,
        meta: {
            heading: "Inventory - Products",
            parentComponent: "inventory"
        }
    }, {
        name: "inventory.products.stock-history",
        path: "inventory/products/stock-history/:id",
        component: require("../components/inventory/products/stock-history").default,
        meta: {
            heading: "Inventory - Product Stock History",
            parentComponent: "inventory"
        },
        children: [{
            name: "inventory.stock.increase",
            path: "increase/location",
            component: require("../components/inventory/products/stock_increase").default
        }, {
            name: "inventory.stock.decrease",
            path: "decrease/location",
            component: require("../components/inventory/products/stock_decrease").default
        }]
    }, {
        name: "inventory.brands",
        path: "inventory/brands",
        component: require("../components/inventory/brands").default,
        meta: {
            heading: "Inventory - Brands",
            parentComponent: "inventory"
        },
        children: [{
            name: "inventory.brands.add",
            path: "add",
            component: require("../components/inventory/brands/form").default,
        }, {
            name: "inventory.brands.edit",
            path: "edit/:id",
            component: require("../components/inventory/brands/form").default,
            beforeEnter: (to, from, next) => {
                if (to.params.data) {
                    next()
                } else {
                    next({ name: "inventory.brands" })
                }
            }
        }, {
            name: "inventory.brands.delete",
            path: "delete/:id",
            component: require("../components/inventory/brands/delete").default,
            beforeEnter: (to, from, next) => {
                if (to.params.name) {
                    next()
                } else {
                    next({ name: "inventory.brands" })
                }
            }
        }]
    }, {
        name: "inventory.categories",
        path: "inventory/categories",
        component: require("../components/inventory/categories").default,
        meta: {
            heading: "Inventory - Categories",
            parentComponent: "inventory"
        },
        children: [{
            name: "inventory.categories.add",
            path: "add",
            component: require("../components/inventory/categories/form").default,
        }, {
            name: "inventory.categories.edit",
            path: "edit/:id",
            component: require("../components/inventory/categories/form").default,
            beforeEnter: (to, from, next) => {
                if (to.params.data) {
                    next()
                } else {
                    next({ name: "inventory.categories" })
                }
            }
        }, {
            name: "inventory.categories.delete",
            path: "delete/:id",
            component: require("../components/inventory/categories/delete").default,
            beforeEnter: (to, from, next) => {
                if (to.params.name) {
                    next()
                } else {
                    next({ name: "inventory.categories" })
                }
            }
        }]
    }, {
        name: "inventory.suppliers",
        path: "inventory/suppliers",
        component: require("../components/inventory/suppliers").default,
        meta: {
            heading: "Inventory - Suppliers",
            parentComponent: "inventory"
        }
    }, {
        name: "inventory.suppliers.add",
        path: "inventory/suppliers/add",
        component: require("../components/inventory/suppliers/form").default,
        meta: {
            heading: "Inventory - Suppliers",
            parentComponent: "inventory"
        }
    }, {
        name: "inventory.suppliers.edit",
        path: "inventory/suppliers/edit/:id",
        component: require("../components/inventory/suppliers/form").default,
        meta: {
            heading: "Inventory - Suppliers",
            parentComponent: "inventory"
        }
    }, {
        name: "analytics.index",
        path: "/analytics",
        component: require("../components/analytics/").default,
        meta: {
            heading: "Analytics"
        },
        children: [{
            name: "analytics.finances-summary",
            path: "finances-summary",
            component: require("../components/analytics/finances-summary").default,
        }, {
            name: "analytics.payments-summary",
            path: "payments-summary",
            component: require("../components/analytics/payments-summary").default,
        }, {
            name: "analytics.discounts-summary",
            path: "discounts-summary",
            component: require("../components/analytics/discounts-summary").default,
        }, {
            name: "analytics.taxes-summary",
            path: "taxes-summary",
            component: require("../components/analytics/taxes-summary").default,
        }, {
            name: "analytics.expenses-summary",
            path: "expenses-summary",
            component: require("../components/analytics/expenses-summary").default,
        }, {
            name: "analytics.sms-summary",
            path: "sms-summary",
            component: require("../components/analytics/sms-summary").default,
        }, {
            name: "analytics.sales-by-service",
            path: "sales-by-service",
            component: require("../components/analytics/sales-by-service").default,
        }, {
            name: "analytics.sales-by-product",
            path: "sales-by-product",
            component: require("../components/analytics/sales-by-product").default,
        }, {
            name: "analytics.sales-by-deal",
            path: "sales-by-deal",
            component: require("../components/analytics/sales-by-deal").default,
        }, {
            name: "analytics.sales-by-staff",
            path: "sales-by-staff",
            component: require("../components/analytics/sales-by-staff").default,
        }, {
            name: "analytics.sales-by-location",
            path: "sales-by-location",
            component: require("../components/analytics/sales-by-location").default,
        }, {
            name: "analytics.staff-commission-summary",
            path: "staff-commission-summary",
            component: require("../components/analytics/staff-commission-summary").default,
        }, {
            name: "analytics.staff-commission-detailed",
            path: "staff-commission-detailed",
            component: require("../components/analytics/staff-commission-detailed").default,
        }]
    }, {
        name: "setup.index",
        path: "/setup",
        component: require("../components/setup/").default,
        meta: {
            heading: "Setup"
        },
        children: [{
            name: "setup.account-settings",
            path: "account-settings",
            component: require("../components/setup/account-settings").default
        }, {
            name: "setup.invoice-sequencing",
            path: "invoice-sequencing",
            component: require("../components/setup/invoice-sequencing").default,
            children: [{
                name: "setup.invoice-sequencing.edit",
                path: "sequences/:id",
                component: require("../components/setup/invoice-sequencing/form").default,
                beforeEnter: (to, from, next) => {
                    if (to.params.data) {
                        next()
                    } else {
                        next({ name: "setup.invoice-sequencing" })
                    }
                }
            }]
        }, {
            name: "setup.taxes",
            path: "taxes",
            component: require("../components/setup/taxes").default,
            children: [{
                name: "setup.taxes.tax.add",
                path: "tax/add",
                component: require("../components/setup/taxes/tax").default
            }, {
                name: "setup.taxes.tax.edit",
                path: "tax/edit/:id",
                component: require("../components/setup/taxes/tax").default
            }, {
                name: "setup.taxes.default.edit",
                path: "location-taxes/:id",
                component: require("../components/setup/taxes/location-taxes").default,
                beforeEnter: (to, from, next) => {
                    if (to.params.branch) {
                        next()
                    } else {
                        next({ name: "setup.taxes" })
                    }
                }
            }, {
                name: "setup.taxes.tax-calculations",
                path: "tax-calculations",
                component: require("../components/setup/taxes/tax-calculations").default
            }, {
                name: "setup.taxes.delete",
                path: "tax/delete/:id",
                component: require("../components/setup/taxes/delete").default,
                beforeEnter: (to, from, next) => {
                    if (to.params.title) {
                        next()
                    } else {
                        next({ name: "setup.taxes" })
                    }
                }
            }, {
                name: "setup.taxes.group.add",
                path: "tax-groups/add",
                component: require("../components/setup/taxes/group").default
            }, {
                name: "setup.taxes.group.edit",
                path: "tax-groups/edit/:id",
                component: require("../components/setup/taxes/group").default
            }]
        }, {
            name: "setup.discounts",
            path: "discounts",
            component: require("../components/setup/discounts").default,
            children: [{
                name: "setup.discounts.add",
                path: "add",
                component: require("../components/setup/discounts/form").default
            }, {
                name: "setup.discounts.edit",
                path: "edit/:id",
                component: require("../components/setup/discounts/form").default,
                beforeEnter: (to, from, next) => {
                    if (to.params.data) {
                        next()
                    } else {
                        next({ name: "setup.discounts" })
                    }
                }
            }, {
                name: "setup.discounts.delete",
                path: "delete/:id",
                component: require("../components/setup/discounts/delete").default,
                beforeEnter: (to, from, next) => {
                    if (to.params.title) {
                        next()
                    } else {
                        next({ name: "setup.discounts" })
                    }
                }
            }]
        }, {
            name: "setup.sales-settings",
            path: "sales-settings",
            component: require("../components/setup/sales-settings").default
        }]
    }, {
        name: "setup.locations",
        path: "setup/locations",
        component: require("../components/setup/locations").default,
        meta: {
            heading: "Setup"
        }
    }, {
        name: "setup.locations.add",
        path: "setup/locations/add",
        component: require("../components/setup/locations/form").default,
        meta: {
            heading: "Setup"
        }
    }, {
        name: "setup.locations.edit",
        path: "setup/locations/edit/:id",
        component: require("../components/setup/locations/form").default,
        meta: {
            heading: "Setup"
        }
    }, {
        name: "setup.locations.view",
        path: "setup/locations/view/:id",
        component: require("../components/setup/locations/view").default,
        meta: {
            heading: "Setup"
        }
    }, {
        name: "campaign",
        path: "/campaigns",
        component: require("../components/campaign").default,
        meta: {
            heading: "Campaigns"
        },
        beforeEnter: (to, from, next) => {
            if (Store.getters.user.business.subscription_package === "premium") {
                next()
            } else {
                next({ name: "calendar" })
            }
        }
    }, {
        name: "campaign.edit",
        path: "/campaigns/edit/:id",
        component: require("../components/campaign/form").default,
        meta: {
            heading: "Customise Message"
        },
        redirect: {
            name: "edit.step-1"
        },
        beforeEnter: (to, from, next) => {
            if (Store.getters.user.business.subscription_package === "premium") {
                next()
            } else {
                next({ name: "calendar" })
            }
        },
        children: [{
            name: "edit.step-1",
            path: "step-1",
            component: require("../components/campaign/steps/step1").default
        }, {
            name: "edit.step-2",
            path: "step-2",
            component: require("../components/campaign/steps/step2").default
        }]
    }, 
    {
        name: "campaign.add",
        path: "/campaigns/add",
        component: require("../components/campaign/form").default,
        meta: {
            heading: "Customise Message"
        },
        redirect: {
            name: "step-1"
        },
        children: [
            {
            name: "step-1",
            path: "step-1",
            component: require("../components/campaign/steps/step1").default
            },
            {
            name: "step-2",
            path: "step-2",
            component: require("../components/campaign/steps/step2").default
            },
        ]
    },{
        name: "deals.index",
        path: "/deals",
        component: require("../components/deals/").default,
        meta: {
            heading: "Deals"
        }
    }, {
        name: "deals.add",
        path: "/deals/add",
        component: require("../components/deals/form").default,
        meta: {
            heading: "Deals"
        },
    }, {
        name: "deals.edit",
        path: "/deals/edit/:id",
        component: require("../components/deals/form").default,
        meta: {
            heading: "Deals"
        },
    }, {
        name: "sms-templates.index",
        path: "/setup/sms-templates",
        component: require("../components/setup/sms-templates/").default,
        meta: {
            heading: "SMS Templates"
        },
        children: [{
            name: "sms-templates.form",
            path: "form",
            component: require("../components/setup/sms-templates/form").default,
        }]
    }, {
        name: "sms-manager.index",
        path: "/sms-manager",
        component: require("../components/sms-manager/").default,
        meta: {
            heading: "SMS Manager"
        }
    }, {
        name: "payment-response.index",
        path: "/payment-response",
        meta: {
            heading: "SMS Manager"
        }
    }]
}, {
    path: "/auth",
    component: require("../components/layouts/Auth").default,
    children: [{
        name: "auth.login",
        path: "login",
        component: require("../components/auth/Login").default
    }, {
        name: "auth.forgot-password",
        path: "forgot-password",
        component: require("../components/auth/ForgotPassword").default
    }, {
        name: "auth.reset-password",
        path: "reset-password/:token",
        component: require("../components/auth/ResetPassword").default
    }, {
        name: "auth.signup",
        path: "signup",
        component: require("../components/auth/Signup").default
    }]
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeResolve((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const newDateObj = new Date();
        const utcDateTime = newDateObj.getUTCFullYear() + '-' + ('0' + (newDateObj.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + newDateObj.getUTCDate()).slice(-2) + ' ' + ('0' + newDateObj.getUTCHours()).slice(-2) + ':' + ('0' + newDateObj.getUTCMinutes()).slice(-2) + ':' + ('0' + newDateObj.getUTCSeconds()).slice(-2)
        if (Store.getters.isLoggedIn) {
            if (to.name !== "subscription.index") {
                if (utcDateTime <= Store.state.user.business.subscription_expires_at) {
                    if (to.name !== "setup.locations.add") {
                        if (Store.state.user.business.is_profile_complete) {
                            next()
                        } else {
                            next({ name: "setup.locations.add" })
                        }
                    } else {
                        next()
                    }
                } else {
                    next({ name: "subscription.index" })
                }
            } else {
                next()
            }
        } else {
            next({ name: "auth.login", query: { status: 3 } })
        }
    } else {
        if (Store.getters.isLoggedIn) {
            next("/")
        } else {
            next()
        }
    }
})

export default router