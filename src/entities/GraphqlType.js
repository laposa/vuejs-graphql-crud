import GraphqlField from "@/entities/GraphqlField";

export default class GraphqlType {
    constructor(typeInfo) {
        Object.assign(this, {...typeInfo});
        this.fieldEntities = [];

        for (const field of this.fields) {
            const graphqlField = new GraphqlField(field);

            if (graphqlField.isScalar()) {
                this.fieldEntities.push(graphqlField);
            }
        }
    }

    getFieldByName(name) {
        return this.fieldEntities.find(field => field.name === name);
    }
}
