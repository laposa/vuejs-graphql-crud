<template>
    <div id="container">
        <div id="loader" v-if="$apollo.queries.__schema.loading">
            Loading...
        </div>

        <div v-else>
            <div id="tableList">
                <QueriesList :queries-list="queriesList" v-model="selectedQuery"/>
            </div>

            <div id="tableContent" v-if="selectedQuery.name">
                <QueryDetail :query="selectedQueryEntity"/>
            </div>
        </div>
    </div>
</template>

<script>
    import QueriesList from "@/components/QueriesList";
    import {introspectionQuery} from 'graphql/utilities';
    import gql from "graphql-tag";

    import QueryDetail from "@/components/QueryDetail";
    import GraphqlQuery from "@/entities/GraphqlQuery";

    export default {
        name: "VueGraphqlCrud",
        components: {QueryDetail, QueriesList},

        apollo: {
            __schema: {
                query: gql(introspectionQuery)
            },
        },

        computed: {
            queriesList() {
                if (!this.__schema) return [];

                return this.__schema.types.find(type => type.name === this.__schema.queryType.name).fields;
            },

            selectedQueryEntity() {
                if (!this.selectedQuery.name) return {};

                return new GraphqlQuery(this.selectedQuery, this.__schema);
            },
        },

        data() {
            return {
                selectedQuery: {},
            }
        },

        created() {

        }
    }
</script>

<style scoped>
    #container {
        clear: both;
    }

    #tableList {
        float: left;
        width: 18%;
        margin-right: 2%;
        overflow-x: scroll;
    }

    #tableContent {
        float: left;
        width: 80%;
    }
</style>
