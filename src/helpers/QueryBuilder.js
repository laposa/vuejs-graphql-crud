import gql from 'graphql-tag';

const queryBuilder = {};

queryBuilder.paginationQuery = function paginationQuery(query) {
    const fields = queryBuilder.getFieldsForQuery(query.typeEntity);

    return gql`query listingQuery($first: Int!, $offset: Int!, $orderBy: [${query.orderByArg.typeName}!]) {
        ${query.name}(first: $first, offset: $offset, orderBy: $orderBy) {
            nodes { ${fields} }
            totalCount
        }
    }`;
};

queryBuilder.createMutation = function createMutation(query) {
    const fields = queryBuilder.getFieldsForQuery(query.typeEntity);

    return gql`mutation createMutation($input: ${query.types.create}!) {
        ${query.mutations.create}(input: {${query.singularName}: $input}) {
            ${query.singularName} { ${fields} }
        }
    }`;
};

queryBuilder.patchMutation = function patchMutation(query, attribute) {
    return gql`mutation patchMutation($id: Int!, $patch: ${query.types.update}!) {
        ${query.mutations.update}(input: {patch: $patch, id: $id}) {
            ${query.singularName} { id, ${attribute} }
        }
    }`;
};

queryBuilder.updateMutation = function patchMutation(query) {
    const fields = queryBuilder.getFieldsForQuery(query.typeEntity);

    return gql`mutation updateMutation($id: Int!, $patch: ${query.types.update}!) {
        ${query.mutations.update}(input: {patch: $patch, id: $id}) {
            ${query.singularName} { ${fields} }
        }
    }`;
};
queryBuilder.deleteMutation = function deleteMutation(query) {
    return gql`mutation deleteMutation($id: Int!) {
        ${query.mutations.delete}(input: {id: $id}) {
            ${query.singularName} { id }
        }
    }`;
};

queryBuilder.getFieldsForQuery = function getListOfFields(queryType) {
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
};

queryBuilder.getInputVariableForMutations = function getInputVariableForMutations(fields, row) {
    const input = {};

    for (const field of fields) {
        input[field.name] = row[field.name];
    }

    return input;
};

export default queryBuilder;
