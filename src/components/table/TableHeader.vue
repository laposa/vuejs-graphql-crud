<template>
    <thead>
        <th v-for="(field, key) in fields" :key="key">
            {{field.name}}
        </th>
        <th></th>
    </thead>
</template>

<script>
    export default {
        name: "TableHeader",

        props: {
            fields: {type: Array, required: true}
        },
    }
</script>

<style scoped>

</style>
