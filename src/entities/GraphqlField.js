export default class GraphqlField {
    constructor(fieldInfo) {
        Object.assign(this, {...fieldInfo});
        this.types = [];
        this.parseType(fieldInfo.type);

        this.typeName = this.types.find(type => type.name !== null).name || null;
    }

    parseType(type) {
        this.types.push({kind: type.kind, name: type.name});

        if (type.ofType) {
            this.parseType(type.ofType);
        }
    }

    isScalar() {
        return this.types.find(type => type.kind === "SCALAR") != null;
    }

    isNonNull() {
        return this.types.find(type => type.kind === "NON_NULL") != null;
    }

    isObject() {
        return this.types.find(type => type.kind === "OBJECT") != null;
    }

    isList() {
        return this.types.find(type => type.kind === "LIST") != null;
    }

    isString() {
        return this.types.find(type => type.name === "String") != null;
    }

    isText() {
        return this.isString() && this.description === "textarea";
    }

    isInt() {
        return this.types.find(type => type.name === "Int") != null;
    }

    isFloat() {
        return this.types.find(type => type.name === "Float") != null;
    }

    isNumber() {
        return this.isInt() || this.isFloat();
    }

    isDatetime() {
        return this.types.find(type => type.name === "Datetime") != null;
    }
}
