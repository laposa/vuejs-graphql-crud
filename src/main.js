import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

new Vue({
    render: h => h(App, {
        props: {
            apolloClientOptions: {
                httpEndpoint: process.env.VUE_APP_GRAPHQL_ENDPOINT,

                authentication: {
                    username: process.env.VUE_APP_GRAPHQL_AUTH_NAME,
                    password: process.env.VUE_APP_GRAPHQL_AUTH_PASSWORD
                }
            },
        }
    })
}).$mount('#app');
