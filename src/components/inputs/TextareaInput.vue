<template>
    <textarea
        :id="field.name"
        :value="value"
        :required="field.isNonNull()"
        rows="5"
        @change="e => $emit('input', e.target.value)"
    ></textarea>
</template>

<script>
    export default {
        name: "TextInput",
        props: {
            value: {required: true},
            field: {type: Object, required: true},
        },
    }
</script>

<style scoped>
    textarea {
        width: 100%;
    }
</style>
