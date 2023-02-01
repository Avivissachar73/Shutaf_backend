const validateType = require('./typeValidation.function');
const generateItemFromInterface = require('./generateItem.function');
const { Enumerator, Range, MultiType, BaseTypeClass, UseType, Any } = require('./class');

module.exports = {
    validateType,
    generateItemFromInterface,

    Enumerator: (...posibleVals) => new Enumerator(...posibleVals),
    Range: (min = -infinity, max = Infinity) => new Range(min, max),
    MultiType: (...types) => new MultiType(...types),
    Any: () => new Any(),
    BaseTypeClass,
    UseType
};