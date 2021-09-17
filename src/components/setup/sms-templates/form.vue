<template>
    <b-modal visible no-close-on-esc no-close-on-backdrop>
        <b-form-group label="Sms" label-for="sms">
            <div contenteditable="true" class="border p-2 border-rounded">
                Thank you for visiting <span class="badge badge-info">Business Name</span>
            </div>
        </b-form-group>
        <div>
            <span class="badge badge-info mr-2 mb-2" v-for="badge, idx in badges" v-bind:key="'badge-' + idx">{{badge.text}}</span>
        </div>
    </b-modal>
</template>
<script>
    export default {
        data: function () {
            return {
                badges: [
                    { characters: 1, value: "business_name", text: "Business Name" },
                    { characters: 1, value: "branch_name", text: "Branch Name" },
                    { characters: 1, value: "date", text: "Date" },
                    { characters: 1, value: "time", text: "Time" },
                    { characters: 1, value: "client_first_name", text: "Client First Name" },
                    { characters: 1, value: "client_last_name", text: "Client Last Name" }
                ]
            }
        }
    }
</script>