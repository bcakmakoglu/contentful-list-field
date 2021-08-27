/** Parameters that can be passed to the Field Editor instance, i.e. props.sdk.parameters.instance */
export interface InstanceParameters {
    valueOptions?: string;
    keyOptions?: string;
    checkbox?: boolean;
    taggable?: boolean;
    valueName?: string;
    keyName?: string;
    uniqueKeys?: boolean;
}

/** A Tag which represents a list item of the value list (needs taggable instance parameter to be enabled */
export interface Tag {
    id: string;
    key: string;
    value: string;
}

/** An Item which represents an list item of the key value list */
export interface Item {
    id: string;
    key: string;
    value: Tag[] | string;
    checked?: boolean;
}
