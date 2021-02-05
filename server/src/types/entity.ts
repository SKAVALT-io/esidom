export interface Entity {
    id: string;
    name: string;
    type: string;
    state: string;
    attributes: any[];
}

// get_states permet de récup le state + les attributes
// type is entity.split('.')[0]
