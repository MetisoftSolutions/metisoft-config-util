"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var jsonschema_1 = require("jsonschema");
var __loadedConfigOptions = null;
var __options;
function init(options) {
    if (!options.fullPathToConfigFile && !options.configOptionsObject) {
        throw new Error("Either fullPathToConfigFile or configObject must be specified.");
    }
    __options = _.cloneDeep(options);
}
exports.init = init;
function getConfig() {
    if (!__loadedConfigOptions) {
        if (__options.fullPathToConfigFile) {
            __loadedConfigOptions = require(__options.fullPathToConfigFile);
        }
        else if (__options.configOptionsObject) {
            __loadedConfigOptions = __options.configOptionsObject;
        }
    }
    var errors = [];
    if (!__validateEnvConfigOptions(__loadedConfigOptions, errors)) {
        console.error(_.repeat('*', 80));
        console.error("ENVIRONMENT CONFIG FILE CONTENTS ARE INVALID!");
        console.error(_.repeat('*', 80));
        console.table(_.reduce(errors, function (accumulator, error) {
            accumulator[error.property] = error.message;
            return accumulator;
        }, {}));
        console.error(_.repeat('*', 80));
        throw new Error('INVALID_CONFIG_FILE');
    }
    return __loadedConfigOptions;
}
exports.getConfig = getConfig;
function __checkAgainstSchema(value, schema, errors) {
    var v = new jsonschema_1.Validator();
    var result = v.validate(value, schema);
    if (result.errors.length > 0) {
        _.forEach(result.errors, function (err) { return errors.push(err); });
        return false;
    }
    return true;
}
function __validateEnvConfigOptions(envConfigOptions, errors) {
    return __checkAgainstSchema(envConfigOptions, __options.configOptionsSchema, errors);
}
function getEnvName() {
    if (process.env && process.env.ENV_NAME) {
        return process.env.ENV_NAME;
    }
    else if (process.argv.length >= 3) {
        return process.argv[2];
    }
    else {
        return '';
    }
}
exports.getEnvName = getEnvName;
