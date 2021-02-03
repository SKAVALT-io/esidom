interface Room {
    room_id:string;
    name: string;
    devices: Array<Device>;
    automations: Array<Automation>;
}