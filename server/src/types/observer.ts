/* eslint-disable no-unused-vars */

export interface EventObserver {
    onAuthOk?: () => void;
    onEntityUpdated?: (data: string) => void;
    onAutomationUpdated?: (data: string) => void;
    onEntityRegistryUpdated?: () => void;
    onDeviceRegistryUpdated?: (data: string) => void;
    onAreaUpdated?: (roomId: string) => void;
    onAreaRemoved?: (roomId: string) => void;
}

export type Event = 'authOk' | 'entityUpdated' | 'automationUpdated' | 'entityRegistryUpdated' | 'deviceRegistryUpdated' | 'areaUpdated' | 'areaRemoved';
