/* eslint-disable no-unused-vars */
import { HaEntityUpdated } from './haTypes';

export interface EventObserver {
    onAuthOk?: () => void;
    onEntityUpdated?: (data: string) => void;
    onAutomationUpdated?: (data: string) => void;
    onEntityRegistryUpdated?: () => void;
    onDeviceRegistryUpdated?: () => void;
    onAreaUpdated?: (roomId: string) => void;
    onAreaRemoved?: (roomId: string) => void;
}

export type Event = 'authOk' | 'entityUpdated' | 'automationUpdated' | 'entityRegistryUpdated' | 'deviceRegistryUpdated' | 'areaUpdated' | 'areaRemoved';
