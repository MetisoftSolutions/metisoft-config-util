import { Schema } from 'jsonschema';
export interface IOptions {
    configOptionsSchema: Schema;
    fullPathToConfigFile?: string;
    configOptionsObject?: any;
}
export declare function init(options: IOptions): void;
export declare function getConfig<TConfigOptions>(): TConfigOptions;
export declare function getEnvName(): string;
//# sourceMappingURL=index.d.ts.map