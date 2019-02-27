import pluralize  from "pluralize";
import _ from "lodash";
import GraphqlType from "@/entities/GraphqlType";

export default class GraphqlQuery {
    constructor(queryInfo, schema) {
        Object.assign(this, {...queryInfo});
        this.singularName = pluralize.singular(queryInfo.name);

        // TO-DO: mutations & types should be parsed from schema
        this.typeName = _.upperFirst(this.singularName);
        this.typeEntity = new GraphqlType(schema.types.find(type => type.name === this.typeName));

        this.mutations = {
            create: `create${this.typeName}`,
            update: `update${this.typeName}ById`,
            delete: `delete${this.typeName}ById`,
        };

        this.types = {
            query: this.typeName,
            update: `${this.typeName}Patch`,
            create: `${this.typeName}Input`,
        }
    }
}
