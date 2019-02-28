<template>
    <thead>
        <th v-for="(field, key) in fields" :key="key">
            <a href="#" @click.prevent="updateOrderBy(field.name)">
                {{field.name}}

                <span v-if="value === getOrderByName(field.name) + '_ASC'" >&uparrow;</span>
                <span v-if="value === getOrderByName(field.name) + '_DESC'" >&downarrow;</span>
            </a>
        </th>
        <th></th>
    </thead>
</template>

<script>
    import _ from "lodash";

    export default {
        name: "TableHeader",

        props: {
            value: {type: String, required: true},
            fields: {type: Array, required: true}
        },

        methods: {
            updateOrderBy(attribute) {
                const orderByName = this.getOrderByName(attribute);

                if (this.value === orderByName + "_ASC") {
                    this.$emit('input', orderByName + "_DESC");
                }
                else {
                    this.$emit('input', orderByName + "_ASC");
                }
            },

            getOrderByName(attribute) {
                return _.snakeCase(attribute).toUpperCase();
            }
        }
    }
</script>

<style scoped>

</style>
