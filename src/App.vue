<template>
    <div id="app">
        <VueGraphqlCrud />
    </div>
</template>

<script>
    import VueGraphqlCrud from "@/components/VueGraphqlCrud";
    import {createProvider} from "@/vue-apollo";

    export default {
        name: 'app',
        components: {
            VueGraphqlCrud,
        },

        props: {
            apolloClientOptions: {type: Object},
            apolloProvider: {type: Object},
        },

        created() {
            if (this.apolloProvider !== undefined) {
                this.$apolloProvider = this.apolloProvider;
                return;
            }

            this.$apolloProvider = createProvider(this.apolloClientOptions);
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        max-width: 95%;
        margin: 0 auto;
    }
</style>
