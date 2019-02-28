<template>
    <a href="#" v-if="field.name === 'id'" @click.prevent="evt => $emit('click', evt)">
        <strong>{{displayValue}}</strong>
    </a>
    <div v-else>
        <div v-if="!isEdited" v-html="displayValue" @click.prevent.stop="$emit('click')"></div>
        <div v-if="isEdited">
            <ValueInput
                ref="input"
                :value="internalValue"
                :field="field"
                @input="updateInternalValue"
                @click="$emit('click')"
            />
        </div>
    </div>
</template>

<script>
    import ValueInput from "@/components/inputs/ValueInput";
    export default {
        name: "TableValue",
        components: {ValueInput},
        props: {
            value: {required: true},
            field: {type: Object, required: true},
            isEdited: {type: Boolean, required: true}
        },

        computed: {
            displayValue() {
                if (this.value === null) {
                    return "<i>NULL</i>";
                }

                if (this.value === "") {
                    return "<i>(empty string)</i>";
                }

                return this.value;
            }
        },

        data() {
            return {
                internalValue: this.value
            }
        },

        watch: {
            isEdited(willBeEdited) {
                if (willBeEdited) {
                    this.$nextTick(() => this.$refs.input.focus());
                    return;
                }

                if (!willBeEdited && this.internalValue !== this.value) {
                    this.$emit('updated', this.internalValue);
                }
            }
        },

        methods: {
            updateInternalValue(value) {
                this.internalValue = value;

                if (value === null) {
                    this.$emit('updated', null);
                    this.$emit('finishEditing');
                }
            }
        }
    }
</script>

<style scoped>

</style>
