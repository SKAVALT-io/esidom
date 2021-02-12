import Blockly from 'blockly';

const esidomGenerator = new Blockly.Generator('ESIDOM');

esidomGenerator.PRECEDENCE = 0;

esidomGenerator['automation'] = function (block) {
    let statements_trigger = esidomGenerator.statementToCode(block, 'Trigger');
    let statements_condition = esidomGenerator.statementToCode(block, 'Condition');
    let statements_action = esidomGenerator.statementToCode(block, 'Action');
    let dropdown_mode = block.getFieldValue('Mode');

    let json = {}

    console.log(statements_trigger)
    console.log(statements_condition)
    console.log(statements_action)
    console.log(dropdown_mode)

    if (statements_trigger != "") {
        let triggers = '[' + statements_trigger + ']'
        json["trigger"] = JSON.parse(triggers)
    }

    if (statements_condition != "") {
        let conditions = '[' + statements_condition + ']'
        json["condition"] = JSON.parse(conditions)
    }

    if (statements_action != "") {
        let actions = '[' + statements_action + ']'
        json["action"] = JSON.parse(actions)
    }

    return JSON.stringify(json);
};

esidomGenerator['time'] = function (block) {
    let number_hour = block.getFieldValue('Hour');
    let number_minute = block.getFieldValue('Minute');
    let number_second = block.getFieldValue('Second');

    let json = {}

    json["platform"] = "time";
    json["at"] = number_hour + ':' + number_minute + ':' + number_second

    return JSON.stringify(json);
};

esidomGenerator['action'] = function (block) {
    let value_service = esidomGenerator.valueToCode(block, 'Service', esidomGenerator.PRECEDENCE);
    let value_entity = esidomGenerator.valueToCode(block, 'Entity', esidomGenerator.PRECEDENCE);

    let json = {}

    json["service"] = value_service;
    json["entity_id"] = value_entity

    return JSON.stringify(json);
};

esidomGenerator['time_condition'] = function (block) {
    let number_hour_debut = block.getFieldValue('Hour_debut');
    let number_minute_debut = block.getFieldValue('Minute_debut');
    let number_second_debut = block.getFieldValue('Second_debut');
    let number_hour_end = block.getFieldValue('Hour_end');
    let number_minute_end = block.getFieldValue('Minute_end');
    let number_second_end = block.getFieldValue('Second_end');
    let checkbox_mon = block.getFieldValue('mon') == 'TRUE';
    let checkbox_tue = block.getFieldValue('tue') == 'TRUE';
    let checkbox_wed = block.getFieldValue('wed') == 'TRUE';
    let checkbox_thu = block.getFieldValue('thu') == 'TRUE';
    let checkbox_fri = block.getFieldValue('fri') == 'TRUE';
    let checkbox_sat = block.getFieldValue('sat') == 'TRUE';
    let checkbox_sun = block.getFieldValue('sun') == 'TRUE';

    let json = {}

    let weekday = []
    if (checkbox_mon) { weekday = weekday.concat(['mon']) }
    if (checkbox_tue) { weekday = weekday.concat(['tue']) }
    if (checkbox_wed) { weekday = weekday.concat(['wed']) }
    if (checkbox_thu) { weekday = weekday.concat(['thu']) }
    if (checkbox_fri) { weekday = weekday.concat(['fri']) }
    if (checkbox_sat) { weekday = weekday.concat(['sat']) }
    if (checkbox_sun) { weekday = weekday.concat(['sun']) }

    json["condition"] = "time"
    json["after"] = number_hour_debut + ':' + number_minute_debut + ':' + number_second_debut
    json["before"] = number_hour_end + ':' + number_minute_end + ':' + number_second_end
    json["weekday"] = weekday

    return JSON.stringify(json);
};

esidomGenerator['binary_trigger'] = function (block) {
    let value_service = esidomGenerator.valueToCode(block, 'Service', esidomGenerator.PRECEDENCE);
    let dropdown_state = block.getFieldValue('state');

    let json = {}

    json["platform"] = "state";
    json["entity_id"] = value_service;

    if (dropdown_state == "off") {
        json["from"] = "on";
        json["to"] = "off";
    } else if (dropdown_state == "on") {
        json["from"] = "off";
        json["to"] = "on";
    }

    return JSON.stringify(json);
};

esidomGenerator['sun_condition'] = function (block) {
    let dropdown_sun_sun = block.getFieldValue('sun.sun');

    let json = {}
    json["condition"] = "state"
    json["entity_id"] = "sun.sun"
    json["state"] = dropdown_sun_sun

    return JSON.stringify(json);
};

esidomGenerator['binary_condition'] = function (block) {
    let value_service = esidomGenerator.valueToCode(block, 'Service', esidomGenerator.PRECEDENCE);
    let dropdown_state = block.getFieldValue('state');

    let json = {}

    json["condition"] = "state";
    json["entity_id"] = value_service;
    json["state"] = dropdown_state;

    return JSON.stringify(json);
};

esidomGenerator['color_picker'] = function (block) {
    let color_value = block.getFieldValue('color');

    console.log(color_value)

    let json = {}

    json["rgb_color"] = color_value

    return JSON.stringify(json);
};

esidomGenerator['color_rgb'] = function (block) {
    let number_red = block.getFieldValue('red');
    let number_green = block.getFieldValue('green');
    let number_blue = block.getFieldValue('blue');
    let color_value = '#' + number_red.toString(16).padStart(2, '0') + '' + number_green.toString(16).padStart(2, '0') + '' + number_blue.toString(16).padStart(2, '0')
    let json = {}

    json["rgb_color"] = color_value

    return JSON.stringify(json);
};

esidomGenerator['time_condition_hour'] = function (block) {
    let number_hour_debut = block.getFieldValue('Hour_debut');
    let number_minute_debut = block.getFieldValue('Minute_debut');
    let number_second_debut = block.getFieldValue('Second_debut');
    let number_hour_end = block.getFieldValue('Hour_end');
    let number_minute_end = block.getFieldValue('Minute_end');
    let number_second_end = block.getFieldValue('Second_end');

    let json = {}
    json["condition"] = "time"
    json["after"] = number_hour_debut + ':' + number_minute_debut + ':' + number_second_debut
    json["before"] = number_hour_end + ':' + number_minute_end + ':' + number_second_end

    return JSON.stringify(json);
};

esidomGenerator['time_condition_week'] = function (block) {
    let checkbox_mon = block.getFieldValue('mon') == 'TRUE';
    let checkbox_tue = block.getFieldValue('tue') == 'TRUE';
    let checkbox_wed = block.getFieldValue('wed') == 'TRUE';
    let checkbox_thu = block.getFieldValue('thu') == 'TRUE';
    let checkbox_fri = block.getFieldValue('fri') == 'TRUE';
    let checkbox_sat = block.getFieldValue('sat') == 'TRUE';
    let checkbox_sun = block.getFieldValue('sun') == 'TRUE';
    let json = {}

    let weekday = []
    if (checkbox_mon) { weekday = weekday.concat(['mon']) }
    if (checkbox_tue) { weekday = weekday.concat(['tue']) }
    if (checkbox_wed) { weekday = weekday.concat(['wed']) }
    if (checkbox_thu) { weekday = weekday.concat(['thu']) }
    if (checkbox_fri) { weekday = weekday.concat(['fri']) }
    if (checkbox_sat) { weekday = weekday.concat(['sat']) }
    if (checkbox_sun) { weekday = weekday.concat(['sun']) }

    json["condition"] = "time"
    json["weekday"] = weekday

    return JSON.stringify(json);;
};

// Scrub for combining two same blocks
esidomGenerator.scrub_ = function (block, code, opt_thisOnly) {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    const nextCode =
        opt_thisOnly ? '' : esidomGenerator.blockToCode(nextBlock);

    if (nextCode == "") {
        return code;
    }

    return code + ",\n" + nextCode;
};