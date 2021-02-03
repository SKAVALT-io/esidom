interface Automation {
    id: string;
    name: string;
    description?: string;
    trigger: any;
    condition: any;
    action: any;
}