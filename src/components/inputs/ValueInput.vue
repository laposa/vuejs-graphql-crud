<template>
    <span>
        <TextInput
            :value="value"
            :field="field"
            @input="newVal => $emit('input', newVal)"
            ref="input"
        />

        <button @click.prevent="$emit('input', null)" v-if="!field.isNonNull() && value !== null">&times;</button>
    </span>
</template>

<script>
    import TextInput from "@/components/inputs/TextInput";
    export default {
        name: "ValueInput",
        components: {TextInput},
        props: {
            value: {required: true},
            field: {type: Object, required: true},
        },

        methods: {
            focus() {
                this.$refs.input.$el.focus();
            }
        }
    }
</script>

<style scoped>

</style>
