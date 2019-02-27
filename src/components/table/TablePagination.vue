<template>
    <ul>
        <li v-for="page in numOfPages" :key="page" :class="{selected: page === value}">
            <a href="#" @click.prevent="$emit('input', page)">
                {{page}}
            </a>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "TablePagination",

        props: {
            value: {required: true},
            numOfPages: {type: Number, required: true}
        },
    }
</script>

<style scoped>
    ul {
        list-style: none;
        margin: 25px 0 0 0;
        padding: 0;
    }

    li {
        float: left;
        margin-right: 15px;
    }

    li.selected {
        font-weight: bold;
    }
</style>
