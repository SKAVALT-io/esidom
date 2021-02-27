/* eslint-disable no-unused-vars */

export interface EventObserver {
    onAuthOk?: () => void;
    onDeviceUpdated?: (id: string) => void;
    onDeviceRemoved?: (id: string) => void;
    onDeviceCreated?: (id: string) => void;
    onEntityUpdated?: (id: string) => void;
    onEntityCreated?: (id: string) => void;
    onEntityRemoved?: (id: string) => void;
    onAutomationUpdated?: (id: string) => void;
    onAutomationRemoved?: (id: string) => void;
    onAutomationCreated?: (id: string) => void;
    onRoomCreated?: (roomId: string) => void;
    onRoomUpdated?: (roomId: string) => void;
    onRoomRemoved?: (roomId: string) => void;
    onGroupCreated?: (groupId: string) => void;
    onGroupUpdated?: (groupId: string) => void;
    onGroupRemoved?: (groupId: string) => void;
}

export type Event = 'authOk'
                | 'deviceCreated' | 'deviceUpdated' | 'deviceRemoved'
                | 'entityUpdated' | 'entityCreated' | 'entityRemoved'
                | 'automationUpdated' | 'automationCreated' | 'automationRemoved'
                | 'roomCreated' | 'roomUpdated' | 'roomRemoved'
                | 'groupCreated' | 'groupUpdated' | 'groupRemoved';

// number of times we should retry retrieving a newly created
// entity before failing
export const MAX_RETRIEVE_ATTEMPTS = 5;
