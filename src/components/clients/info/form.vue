<template>
    <div class="centralized">
        <b-card>
            <template #header>
                <b-row class="heading-with-back p-0">
                    <b-col md="12">
                        <div class="title">
                            <h1 class="d-flex justify-content-center">
                                <router-link :to="{name: $route.params.id ? 'clients.view' : 'clients', params: {id: $route.params.id}}" class="go-back">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                    </svg>
                                </router-link>
                                <span v-if="$route.params.id">Edit Client</span>
                                <span v-else>Add Client</span>
                            </h1>
                        </div>
                    </b-col>
                </b-row>
                <ul class="submenus">
                    <li v-bind:class="{active: $route.name === 'clients.add.info' || $route.name === 'clients.edit.info'}">
                        <router-link v-if="$route.params.id" :to="{name: 'clients.edit.info', params: {id: $route.params.id}}">Personal Info</router-link>
                        <router-link v-else :to="{name: 'clients.add.info'}">Personal Info</router-link>
                    </li>
                    <li v-bind:class="{active: $route.name === 'clients.add.address' || $route.name === 'clients.edit.address'}" :disabled=true>
                        <router-link v-if="$route.params.id" :to="{name: 'clients.edit.address', params: {id: $route.params.id}}">Address</router-link>
                        <b-link v-else>Address</b-link>
                    </li>
                </ul>
            </template>
            <router-view></router-view>
        </b-card>
    </div>
</template>
<style lang="scss" scoped>
    .card {
        border-radius: 0;
        .card-header {
            padding-bottom: 0;
        }
}
</style>