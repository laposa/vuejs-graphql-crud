<template>
    <div>
        <ul>
            <li v-for="(query, key) in filteredQueries" :key="key" :class="{selected: query.name === value.name}">
                <a href="#" @click.prevent="$emit('input', query)">
                    {{query.name}}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "QueriesList",

        props: {
            value: {type: Object, required: true},
            queriesList: {type: Array, required: true}
        },

        computed: {
            filteredQueries() {
                // Display only queries with arguments for listing
                return this.queriesList.filter(query =>
                    query.args.filter(arg => ["first", "offset", "orderBy", "condition"].includes(arg.name)).length >= 4
                );
            }
        }
    }
</script>

<style scoped>
    ul {
        list-style: none;
        margin: 25px 0 0 0;
        padding: 0;
    }

    li.selected {
        font-weight: bold;
    }
</style>
