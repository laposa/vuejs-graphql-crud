<template>
    <div>
        <h1>
            <span v-if="mode === 'list'">{{query.name}} list</span>
            <span v-if="mode === 'edit'">edit {{query.singularName}}</span>
            <span v-if="mode === 'create'">create new {{query.singularName}}</span>
        </h1>

        <MessagesContainer/>

        <div v-if="mode === 'list'">
            <button @click.prevent="createRow" id="createRow">&plus; Create {{query.singularName}}</button>

            <div class="filter">
                <Filters v-model="filters" :fields="query.typeEntity.fieldEntities" />
            </div>

            <div class="pagination">
                <TablePagination
                        v-if="numberOfPages > 1"
                        v-model="page"
                        :num-of-pages="numberOfPages"
                />
            </div>

            <div id="tableContainer">
                <table>
                    <TableHeader :fields="query.typeEntity.fieldEntities" v-model="orderBy"/>
                    <TableBody
                            :fields="query.typeEntity.fieldEntities"
                            :rows="rows"
                            @update="patch"
                            @create="create"
                            @remove="remove"
                            @edit="editRow"
                    />
                </table>
            </div>

            <div class="pagination">
                <TablePagination
                        v-if="numberOfPages > 1"
                        v-model="page"
                        :num-of-pages="numberOfPages"
                />
            </div>
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
    import Filters from "@/components/filter/Filters";
    import messagesStore from "@/stores/MessagesStore.js"

    export default {
        name: "QueryDetail",
        components: {MessagesContainer, CreateUpdateMutation, TablePagination, TableBody, TableHeader, Filters},
        props: {
            query: {type: Object, required: true},
        },

        apollo: {
            __rows: {
                query() {
                    return this.listingQuery
                },
                variables() {
                    return {
                        first: this.resultsPerPage,
                        offset: (this.page - 1) * this.resultsPerPage,
                        orderBy: this.orderBy !== '' ? [this.orderBy] : [],
                        filter: this.queryFilter
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

            listingQuery() {
                return queryBuilder.listingQuery(this.query, this.filters);
            },

            queryFilter() {
                const queryFilter = { or: [] };

                for (const filterGroup of this.filters) {
                    const groupQueryFilter = { and: [] };

                    for (const filter of filterGroup) {
                        groupQueryFilter.and.push({[filter.field.name]: {[filter.operator]: filter.value}});
                    }

                    queryFilter.or.push(groupQueryFilter);
                }

                return queryFilter;
            }
        },

        data() {
            return {
                rows: [],
                orderBy: '',
                filters: [],
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
                this.page = 1;
                this.orderBy = "";
                this.rows = [];
                this.filters = [];
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
    }

    table tfoot {
        text-align: center;
    }

    table tfoot tr td {
        padding: 1rem;
    }

    #createRow {
        margin-bottom: 1rem;
    }

    #addRow {
        margin-top: 1rem;
    }

    .pagination:after {
        content: "";
        display: table;
        clear: both;
    }

    .filter {
        margin-bottom: 1rem;
    }
</style>
