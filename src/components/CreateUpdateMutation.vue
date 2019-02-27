<template>
    <div>
        <a href="#" @click.prevent="$emit('displayListing')">&leftarrow; back to list</a>

        <div v-for="(col, key) in cols" :key="key">
            <label :for="col.name">{{col.name}}</label>

            <ValueInput
                    ref="input"
                    :value="item[col.name]"
                    :field="col"
                    @input="value => $set(internalItem, col.name, value)"
            />
        </div>

        <button v-if="mode === 'edit'" @click.prevent="$emit('update', item)">&#9998; Update</button>
        <button v-if="mode === 'create'" @click.prevent="$emit('create', item)">&plus; Create</button>
    </div>
</template>

<script>
    import ValueInput from "@/components/inputs/ValueInput";

    export default {
        name: "CreateUpdateMutation",
        components: {ValueInput},
        props: {
            mode: {type: String, required: true},
            cols: {type: Array, required: true},
            item: {type: Object},
        },

        data() {
            return {
                internalItem: this.item
            }
        }
    }
</script>

<style scoped>
    label {
        display: block;
        margin: 1rem 0 0.5rem 0;
    }

    button {
        margin-top: 2.5rem;
    }
</style>
