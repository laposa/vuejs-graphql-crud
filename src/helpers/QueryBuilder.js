import gql from 'graphql-tag';

const queryBuilder = {

    paginationQuery(query) {
        const fields = this.getFieldsForQuery(query.typeEntity);

        return gql`query listingQuery($first: Int!, $offset: Int!, $orderBy: [${query.orderByArg.typeName}!]) {
            ${query.name}(first: $first, offset: $offset, orderBy: $orderBy) {
                nodes { ${fields} }
                totalCount
            }
        }`;
    },

    createMutation(query) {
        const fields = this.getFieldsForQuery(query.typeEntity);

        return gql`mutation createMutation($input: ${query.types.create}!) {
            ${query.mutations.create}(input: {${query.singularName}: $input}) {
                ${query.singularName} { ${fields} }
            }
        }`;
    },

    patchMutation(query, attribute) {
        return gql`mutation patchMutation($id: Int!, $patch: ${query.types.update}!) {
            ${query.mutations.update}(input: {patch: $patch, id: $id}) {
                ${query.singularName} { id, ${attribute} }
            }
        }`;
    },

    updateMutation(query) {
        const fields = this.getFieldsForQuery(query.typeEntity);

        return gql`mutation updateMutation($id: Int!, $patch: ${query.types.update}!) {
            ${query.mutations.update}(input: {patch: $patch, id: $id}) {
                ${query.singularName} { ${fields} }
            }
        }`;
    },

    deleteMutation(query) {
        return gql`mutation deleteMutation($id: Int!) {
            ${query.mutations.delete}(input: {id: $id}) {
                ${query.singularName} { id }
            }
        }`;
    },

    getFieldsForQuery(queryType) {
        let result = [];
        for (const field of queryType.fieldEntities) {
            if (field.isScalar()) {
                result.push(field.name);
            }
            else {
                // TO-DO: Implement relations
                // result.push(`${field.name} { nodes {id} }`);
            }
        }

        return result.join(',');
    },

    getInputVariableForMutations(fields, row) {
        const input = {};

        for (const field of fields) {
            input[field.name] = row[field.name];
        }

        return input;
    }
};

export default queryBuilder;
