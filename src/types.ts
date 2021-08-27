export interface InstanceParameters {
    options?: string;
    checkbox?: boolean;
    taggable?: boolean;
    valueName?: string;
}

export interface Tag {
    id: string;
    key: string;
    value: string;
}

/** An Item which represents an list item of the repeater app */
export interface Item {
    id: string;
    key: string;
    value: Tag[] | string;
    checked?: boolean;
}
