<template>
    <div class="centralized">
        <p class="m-0">Setup which sections are accessible to each user permission level. All logged in staff can access the calendar, and owner accounts have full system access.</p>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="40%">BOOKINGS &AMP; CLIENTS</th>
                    <th width="15%" class="text-center">BASIC</th>
                    <th width="15%" class="text-center">LOW</th>
                    <th width="15%" class="text-center">MEDIUM</th>
                    <th width="15%" class="text-center">HIGH</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Access own calendar</td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                </tr>
                <tr>
                    <td>Access other staff calendars</td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                </tr>
                <tr>
                    <td>Can book appointments</td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                </tr>
                <tr>
                    <td>Home</td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                </tr>
                <tr>
                    <td>Clients</td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                </tr>
                <tr>
                    <td>Can see client contact info</td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                    <td class="text-center">
                        <b-form-checkbox></b-form-checkbox>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    export default {
        components: {
            
        }
    }
</script>