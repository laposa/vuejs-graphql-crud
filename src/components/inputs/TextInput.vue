<template>
    <input
        :id="field.name"
        :type="inputType"
        :value="value"
        :step="field.isFloat() ? '0.01' : '1'"
        :required="field.isNonNull()"
        @change="validateValue"
    >
</template>

<script>
    export default {
        name: "TextInput",
        props: {
            value: {required: true},
            field: {type: Object, required: true},
        },

        computed: {
            inputType() {
                if (this.field.isDatetime()) {
                    return "datetime-local";
                }

                if (this.field.isNumber()) {
                    return "number";
                }

                return "text";
            }
        },

        methods: {
            validateValue(e) {
                let value = e.target.value;

                if (this.field.isInt()) {
                    value = parseInt(value);
                }

                if (this.field.isFloat()) {
                    value = parseFloat(value);
                }

                this.$emit('input', value);
            }
        }
    }
</script>

<style scoped>
    input {
        width: 90%;
    }
</style>
