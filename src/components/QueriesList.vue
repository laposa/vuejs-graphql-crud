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
                return this.queriesList.filter(query => query.type.name && query.type.name.includes("Connection"));
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
