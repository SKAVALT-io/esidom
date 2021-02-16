export interface ArgumentObject {
    type: string;
    name: string;
    options: string[][];
}

export interface ObjectBlock {
    type: string;
    message0: string;
    args0: ArgumentObject[];
    output: string;
    colour: string;
    tooltip: string;
    helpUrl: string;
}
