<template>
    <tbody>
        <tr v-for="(row, rowKey) in rows" :key="rowKey">
            <td v-for="(field, key) in fields" :key="key">
                <TableValue
                        :value="row[field.name]"
                        :field="field"
                        :is-edited="editedValue.row === row && editedValue.field === field"
                        @click="editValue(row, field)"
                        @updated="value => valueUpdated(row.id, field.name, value, rowKey)"
                        @finishEditing="editedValue = {row: null, field: null}"
                />
            </td>

            <td>
                <button v-if="row.id" @click.prevent="$emit('remove', row.id)">&#128465;</button>
            </td>
        </tr>
    </tbody>
</template>

<script>

    import TableValue from "@/components/table/TableValue";
    export default {
        name: "TableBody",
        components: {TableValue},
        props: {
            fields: {type: Array, required: true},
            rows: {type: Array, required: true}
        },

        data() {
            return {
                editedValue: {row: null, field: null},
            }
        },

        methods: {
            editValue(row, field) {
                if (field.name === 'id') {
                    this.$emit('edit', row);
                    return;
                }

                this.editedValue = {row, field};
            },

            valueUpdated(id, attribute, value, rowKey) {
                this.$emit('update', rowKey, attribute, value);
            },

            create(row) {
                this.editedValue = {row: null, field: null};

                this.$nextTick(() => {
                    this.$emit('create', row);
                });
            }
        },

        created() {
            document.addEventListener('click', () => {
                this.editedValue = {row: null, field: null};
            });
        }
    }
</script>

<style scoped>

</style>
