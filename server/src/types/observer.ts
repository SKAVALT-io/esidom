/* eslint-disable no-unused-vars */

export interface EventObserver {
    onAuthOk?: () => void;
    onEntityUpdated?: (id: string) => void;
    onAutomationUpdated?: (id: string) => void;
    onAutomationRemoved?: (id: string) => void;
    onAutomationCreated?: (id: string) => void;
    onEntityRegistryUpdated?: () => void;
    onDeviceRegistryUpdated?: (data: string) => void;
    onAreaUpdated?: (roomId: string) => void;
    onAreaRemoved?: (roomId: string) => void;
}

export type Event = 'authOk' | 'entityUpdated' | 'automationUpdated' | 'automationCreated' | 'automationRemoved' | 'entityRegistryUpdated' | 'deviceRegistryUpdated' | 'areaUpdated' | 'areaRemoved';
