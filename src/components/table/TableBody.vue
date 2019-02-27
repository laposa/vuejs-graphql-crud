<template>
    <tbody>
        <tr v-for="(row, rowKey) in rows" :key="rowKey">
            <td v-for="(field, key) in fields" :key="key">
                <TableValue
                        :value="row[field.name]"
                        :field="field"
                        :is-edited="editedValue.row === row && editedValue.field === field"
                        @click="evt => editValue(evt, row, field)"
                        @updated="value => valueUpdated(row.id, field.name, value, rowKey)"
                        @finishEditing="editedValue = {row: null, field: null}"
                />
            </td>

            <td>
                <span v-if="!row.id">
                    <button @click.prevent="$emit('create', row)">&checkmark;</button>
                    <button @click.prevent="$emit('removeTempRow', rowKey)">&times;</button>
                </span>

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
                lastClick: null,
            }
        },

        methods: {
            editValue(evt, row, field) {
                if (field.name === 'id') {
                    this.$emit('edit', row);
                    return;
                }

                this.editedValue = {row, field};
                this.lastClick = evt;
            },

            valueUpdated(id, attribute, value, rowKey) {
                if (!id) {
                    this.$emit('tempRowUpdate', rowKey, attribute, value);
                    return;
                }

                this.$emit('update', id, attribute, value);
            }
        },

        created() {
            document.addEventListener('click', (e) => {
                if (e !== this.lastClick) {
                    this.editedValue = {row: null, field: null};
                }
            });
        }
    }
</script>

<style scoped>

</style>
