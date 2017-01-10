import { Sdkzer } from "../howerest.sdkzer";
export declare class Item extends Sdkzer {
    baseEndpoint(): string;
    defaults(): {
        name: string;
        items: number[];
    };
    parseOne(data: any): {
        id: any;
        name: any;
        items: any;
    };
    parse(data: any): any[];
}
export declare function buildSdkzerModelEntity(): typeof Item;
