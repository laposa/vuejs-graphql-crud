<template>
    <div class="value-container">
        <div class="input-container" @click.stop="$emit('click')">
            <TextInput
                :value="value"
                :field="field"
                @input="newVal => $emit('input', newVal)"
                ref="input"
            />
        </div>

        <div>
            <button @click.prevent="$emit('input', null)" v-if="!field.isNonNull() && value !== null">&times;</button>
        </div>
    </div>
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
    .value-container {
        display: flex;
    }

    .input-container {
        flex-grow: 1;
    }
</style>
