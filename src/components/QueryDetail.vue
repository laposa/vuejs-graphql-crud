<template>
    <div>
        <h1>
            <span v-if="mode === 'list'">{{query.name}} list</span>
            <span v-if="mode === 'edit'">edit {{query.singularName}}</span>
            <span v-if="mode === 'create'">create new {{query.singularName}}</span>
        </h1>

        <MessagesContainer />

        <div v-if="mode === 'list'" id="tableContainer">

            <button @click.prevent="createRow" id="createRow">&plus; Create {{query.singularName}}</button>

            <table>
                <TableHeader :fields="query.typeEntity.fieldEntities" v-model="orderBy" />
                <TableBody
                        :fields="query.typeEntity.fieldEntities"
                        :rows="rows"
                        @tempRowUpdate="(rowKey, attribute, value) => $set(rows[rowKey], attribute, value)"
                        @removeTempRow="rowKey => rows.splice(rowKey, 1)"
                        @update="patch"
                        @create="create"
                        @remove="remove"
                        @edit="editRow"
                />
                <tfoot>
                    <tr>
                        <td :colspan="query.typeEntity.fieldEntities.length">
                            <TablePagination
                                    v-if="numberOfPages > 1"
                                    v-model="page"
                                    :num-of-pages="numberOfPages" />

                            <button @click.prevent="inlineAddRow">&plus; Add {{query.singularName}}</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div v-else>
            <CreateUpdateMutation
                    :cols="query.typeEntity.fieldEntities"
                    :mode="mode"
                    :item="mode === 'edit' ? selectedRow : {}"
                    @displayListing="displayListing"
                    @create="create"
                    @update="update"
            />
        </div>
    </div>
</template>

<script>
    import TableHeader from "@/components/table/TableHeader";
    import TableBody from "@/components/table/TableBody";
    import queryBuilder from "@/helpers/QueryBuilder";
    import validator from "@/helpers/Validator";
    import TablePagination from "@/components/table/TablePagination";
    import CreateUpdateMutation from "@/components/CreateUpdateMutation";
    import MessagesContainer from "@/components/other/MessagesContainer";
    import messagesStore from "@/stores/MessagesStore.js"

    export default {
        name: "QueryDetail",
        components: {MessagesContainer, CreateUpdateMutation, TablePagination, TableBody, TableHeader},
        props: {
            query: {type: Object, required: true},
        },

        apollo: {
            __rows: {
                query() {
                    return this.paginationQuery
                },
                variables() {
                    return {
                        first: this.resultsPerPage,
                        offset: (this.page-1) * this.resultsPerPage,
                        orderBy: this.orderBy !== '' ? [this.orderBy] : [],
                    }
                },
                manual: true,
                result({loading, data}) {
                    if (!loading) {
                        this.rows = data[this.query.name].nodes;
                        this.totalCount = data[this.query.name].totalCount;

                    }
                }
            }
        },

        computed: {
            numberOfPages() {
                return Math.ceil(this.totalCount / this.resultsPerPage);
            },

            paginationQuery() {
                return queryBuilder.paginationQuery(this.query);
            }
        },

        data() {
            return {
                rows: [],
                orderBy: '',
                totalCount: 0,
                page: 1,
                resultsPerPage: 25,
                mode: "list",
                selectedRow: null,
            }
        },

        watch: {
            query() {
                this.mode = "list";
                this.selectedRow = null;
            }
        },

        methods: {
            async create(row) {
                try {
                    validator.validateItem(row, this.query.typeEntity.fieldEntities);

                    await this.$apollo.mutate({
                        mutation: queryBuilder.createMutation(this.query),
                        variables: {
                            input: queryBuilder.getInputVariableForMutations(this.query.typeEntity.fieldEntities, row)
                        },
                    });

                    this.$apollo.queries.__rows.refetch();
                    messagesStore.addSuccess(this.query.singularName + " was successfully created");
                    this.mode = "list";
                } catch (error) {
                    messagesStore.addError(error.message, `Could not create new ${this.query.singularName}, please fix error(s) bellow:`);
                }
            },

            update(row) {
                try {
                    validator.validateItem(row, this.query.typeEntity.fieldEntities);

                    this.$apollo.mutate({
                        mutation: queryBuilder.updateMutation(this.query),
                        variables: {
                            id: row.id,
                            patch: queryBuilder.getInputVariableForMutations(this.query.typeEntity.fieldEntities, row)
                        },
                    });

                    messagesStore.addSuccess(this.query.singularName + " was successfully updated");
                    this.mode = "list";
                } catch (error) {
                    messagesStore.addError(error.message, `Could not update ${this.query.singularName}, please fix error(s) bellow:`);
                }
            },

            patch(rowKey, attribute, value) {
                try {
                    validator.validateAttribute(value, this.query.typeEntity.getFieldByName(attribute));

                    this.$apollo.mutate({
                        mutation: queryBuilder.patchMutation(this.query, attribute),
                        variables: {
                            id: this.rows[rowKey].id,
                            patch: {[attribute]: value}
                        },
                    });

                    this.$set(this.rows[rowKey], attribute, value);
                } catch (error) {
                    messagesStore.addError(error.message, `Could not update ${attribute} on ${this.query.singularName}, please fix error(s) bellow:`);
                }
            },

            async remove(id) {
                try {
                    await this.$apollo.mutate({
                        mutation: queryBuilder.deleteMutation(this.query),
                        variables: {
                            id: id
                        }
                    });

                    messagesStore.addSuccess(this.query.singularName + " was successfully removed");
                    this.$apollo.queries.__rows.refetch();
                } catch (error) {
                    messagesStore.addError(error.message);
                }
            },

            createRow() {
                this.mode = "create";
                this.selectedRow = null;
            },

            editRow(row) {
                this.mode = "edit";
                this.selectedRow = row;
            },

            inlineAddRow() {
                const newRow = {};
                for (const col of this.query.typeEntity.fieldEntities) {
                    if (col.name === 'id') continue;

                    newRow[col.name] = null;
                }

                this.rows.push(newRow);
            },

            displayListing() {
                this.mode = "list";
                this.selectedRow = null;
            }
        }
    }
</script>

<style scoped>
    #tableContainer {
        overflow-x: scroll;
        padding: 2rem 0rem;
    }

    table tfoot {
        text-align: center;
    }

    table tfoot tr td {
        padding: 1rem;
    }

    #createRow {
        margin-bottom: 2rem;
    }
</style>
