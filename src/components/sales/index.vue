<template>
    <router-view></router-view>
</template>
<script>
    export default {
        watch: {
            $route: {
                handler: function (route) {
                    if (route.name === "sales") {
                        this.$router.push({name: "sales.daily-sales"})
                    }
                },
                immediate: true
            }
        }
    }
</script>