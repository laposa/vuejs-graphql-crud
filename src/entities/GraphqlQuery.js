import pluralize  from "pluralize";
import _ from "lodash";
import GraphqlType from "@/entities/GraphqlType";
import GraphqlField from "@/entities/GraphqlField";

export default class GraphqlQuery {
    constructor(queryInfo, schema) {
        Object.assign(this, {...queryInfo});

        // Parse input arguments
        this.orderByArg = new GraphqlField(queryInfo.args.find(arg => arg.name === "orderBy"));
        this.filterArg =  new GraphqlField(queryInfo.args.find(arg => arg.name === "filter"));

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
