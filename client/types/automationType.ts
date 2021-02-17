export interface AutomationPreview {
    id: string;
    alias: string;
    state: 'on' | 'off' | 'ready' | string;
}

export interface Automation extends AutomationPreview {
    mode: 'single' | 'restart' | 'queued' | 'parallel';
    description: string;
    trigger: any[];
    condition: any[];
    action: any[];
}
