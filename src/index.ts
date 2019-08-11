import * as _ from 'lodash';

import {
  Schema,
  ValidationError,
  Validator
} from 'jsonschema';



let __loadedConfigOptions: any = null;



export interface IOptions {
  configOptionsSchema: Schema;
  fullPathToConfigFile?: string;
  configOptionsObject?: any;
}

let __options: IOptions;



export function init(options: IOptions) {
  if (!options.fullPathToConfigFile && !options.configOptionsObject) {
    throw new Error("Either fullPathToConfigFile or configObject must be specified.");
  }
  __options = _.cloneDeep(options);
}



export function getConfig<TConfigOptions>(): TConfigOptions {
  if (!__loadedConfigOptions) {
    if (__options.fullPathToConfigFile) {
      __loadedConfigOptions = require(__options.fullPathToConfigFile);
    } else if (__options.configOptionsObject) {
      __loadedConfigOptions = __options.configOptionsObject;
    }
  }

  const errors: ValidationError[] = [];
  if (!__validateEnvConfigOptions(__loadedConfigOptions as TConfigOptions, errors)) {
    console.error(_.repeat('*', 80));
    console.error("ENVIRONMENT CONFIG FILE CONTENTS ARE INVALID!");
    console.error(_.repeat('*', 80));

    console.table(_.reduce(errors, (accumulator, error) => {
      accumulator[error.property] = error.message;
      return accumulator;
    }, {} as Record<string, string>));

    console.error(_.repeat('*', 80));
    throw new Error('INVALID_CONFIG_FILE');
  }

  return __loadedConfigOptions;
}



function __checkAgainstSchema(value: any, schema: Schema, errors: ValidationError[]) {
  const v = new Validator();
  const result = v.validate(value, schema);

  if (result.errors.length > 0) {
    _.forEach(result.errors, err => errors.push(err));
    return false;
  }

  return true;
}



function __validateEnvConfigOptions<TConfigOptions>(envConfigOptions: TConfigOptions, errors: ValidationError[]) {
  return __checkAgainstSchema(envConfigOptions, __options.configOptionsSchema, errors);
}



export function getEnvName(): string {
  if (process.env && process.env.ENV_NAME) {
    return process.env.ENV_NAME;
  
  } else if (process.argv.length >= 3) {
    return process.argv[2];

  } else {
    return '';
  }
}
