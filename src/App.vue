<template>
  <div id="app">
    <VueGraphqlCrud graphql-endpoint="http://localhost:5001/graphql" />
  </div>
</template>

<script>
import VueGraphqlCrud from "@/components/VueGraphqlCrud";
import {createProvider} from "@/vue-apollo";

export default {
  name: 'app',
  apolloProvider: createProvider({httpEndpoint: "http://localhost:5001/graphql"}),
  components: {
    VueGraphqlCrud,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 75%;
  margin: 60px auto 0;
}
</style>
