<template>
    <div>
        <h3>Filters</h3>

        <div v-for="(group, groupKey) in value" :key="groupKey" class="filter-group">
            <h4 v-if="groupKey > 0">
                OR
            </h4>

            <div v-for="(filter, filterKey) in group" :key="filterKey" class="filter">
                <select @change="e => updateFilter(groupKey, filterKey, 'field', fields[e.target.value])" class="field">
                    <option
                        v-for="(field, key) in fields"
                        :value="key"
                        :key="key"
                        :selected="filter.field === field"
                    >
                        {{field.name}}
                    </option>
                </select>

                <select @change="e => updateFilter(groupKey, filterKey, 'operator', e.target.value)" class="operator">
                    <option
                        v-for="(operator, key) in getOperatorsByField(filter.field)"
                        :value="operator.name"
                        :key="key"
                        :selected="filter.operator === operator.name"
                    >
                        {{operator.label}}
                    </option>
                </select>

                <TextInput
                    :value="filter.value"
                    :field="filter.field"
                    @input="val => updateFilter(groupKey, filterKey, 'value', val)"
                />

                <button @click="removeFilter(groupKey, filterKey)">&minus;</button>
            </div>

            <button @click="addFilter(groupKey)">&plus; Add Filter</button>
        </div>

        <button @click="addFilterGroup">&plus; Add Filter Group</button>
    </div>
</template>

<script>
    import TextInput from "@/components/inputs/TextInput"

    export default {
        name: "Filters",
        components: {TextInput},
        props: {
            value: {required: true, type: Array},
            fields: {required: true, type: Array}
        },

        methods: {
            addFilterGroup() {
                const newValue = [... this.value];
                newValue.push([{
                    field: this.fields[0],
                    operator: 'equalTo',
                    value: this.fields[0].isNumber() ? 1 : ''
                }]);
                this.$emit('input', newValue);
            },

            addFilter(groupKey) {
                const newValue = [... this.value];
                newValue[groupKey].push({
                    field: this.fields[0],
                    operator: 'equalTo',
                    value: this.fields[0].isNumber() ? 1 : ''
                });

                this.$emit('input', newValue);
            },

            removeFilter(groupKey, filterKey) {
                const newValue = [... this.value];
                newValue[groupKey].splice(filterKey, 1);

                if (newValue[groupKey].length === 0) {
                    newValue.splice(groupKey, 1);
                }

                this.$emit('input', newValue);
            },

            getOperatorsByField(field) {
                let operators = [
                    {name: 'equalTo', label: '='},
                    {name: 'notEqualTo', label: '!='},
                    {name: 'in', label: 'IN (comma separated)'},
                    {name: 'notIn', label: 'NOT IN (comma separated)'},
                ];

                if (field.isString() || field.isText()) {
                    operators = operators.concat( [
                        {name: 'includes', label: 'LIKE %...%'},
                        {name: 'notIncludes', label: 'NOT LIKE %...%'},
                    ]);
                }

                if (field.isNumber() || field.isDatetime()) {
                    operators = operators.concat( [
                        {name: 'lessThan', label: '<'},
                        {name: 'lessThanOrEqualTo', label: '<='},
                        {name: 'greaterThan', label: '>'},
                        {name: 'greaterThanOrEqualTo', label: '>='},
                    ]);
                }

                return operators;
            },

            updateFilter(groupKey, filterKey, propertyName, value) {
                const newValue = [... this.value];
                newValue[groupKey][filterKey][propertyName] = value;
                this.$emit('input', newValue);
            },

        }
    }
</script>

<style scoped>
    h4 {
        margin: 1rem 0;
    }

    .filter-group {
        margin-bottom: 1rem;
    }

    .filter {
        display: flex;
        margin: 0.5rem 0;
    }

    .filter .field {
        flex-grow: 2;
        margin-right: 1rem;
    }

    .filter .operator {
        flex-grow: 1;
        margin-right: 1rem;
    }

    .filter input {
        flex-grow: 4;
        margin-right: 1rem;
    }
</style>
