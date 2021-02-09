import Blockly from 'blockly';

console.log(Blockly.Blocks)

Blockly.Blocks['automation'] = {
    init: function () {
        this.appendStatementInput("Trigger")
            .setCheck("Trigger")
            .appendField("Quels sont les déclencheurs ?");
        this.appendStatementInput("Condition")
            .setCheck("Condition")
            .appendField("Sous quelles conditions ?");
        this.appendStatementInput("Action")
            .setCheck("Action")
            .appendField("Que faire ?");
        this.appendDummyInput()
            .appendField("Avec quel mode ?")
            .appendField(new Blockly.FieldDropdown([["single", "single"], ["restart", "restart"], ["queued", "queued"], ["parallel", "parallel"]]), "Mode");
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['time'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0, 0, 23), "Hour")
            .appendField("h");
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Minute")
            .appendField("m");
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Second")
            .appendField("s");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "Trigger");
        this.setNextStatement(true, "Trigger");
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['action'] = {
    init: function () {
        this.appendValueInput("Service")
            .setCheck("Service")
            .appendField("Faire : ");
        this.appendValueInput("Entity")
            .setCheck(null)
            .appendField("Sur : ");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "Action");
        this.setNextStatement(true, "Action");
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['time_condition'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Début :")
            .appendField(new Blockly.FieldNumber(0, 0, 23), "Hour_debut")
            .appendField("h")
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Minute_debut")
            .appendField("m")
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Second_debut")
            .appendField("s");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Fin :")
            .appendField(new Blockly.FieldNumber(0, 0, 23), "Hour_end")
            .appendField("h")
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Minute_end")
            .appendField("m")
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Second_end")
            .appendField("s");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "mon")
            .appendField("lundi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "tue")
            .appendField("mardi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "wed")
            .appendField("mercredi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "thu")
            .appendField("jeudi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "fri")
            .appendField("vendredi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "sat")
            .appendField("samedi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "sun")
            .appendField("dimanche");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "Condition");
        this.setNextStatement(true, "Condition");
        this.setColour(255);
        this.setTooltip("Si l'heure est laissée par défaut, la condition s'appliquera durant toute la journée");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['sun_condition'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Lorsque le soleil se")
            .appendField(new Blockly.FieldDropdown([["lève", "above_horizon"], ["couche", "below_horizon"]]), "sun.sun");
        this.setPreviousStatement(true, "Condition");
        this.setNextStatement(true, "Condition");
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['binary_trigger'] = {
    init: function () {
        this.appendValueInput("Service")
            .setCheck("Binary_sensor")
            .appendField("Quand capteur binaire");
        this.appendDummyInput()
            .appendField("passe à")
            .appendField(new Blockly.FieldDropdown([["ON", "on"], ["OFF", "off"]]), "state");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "Trigger");
        this.setNextStatement(true, "Trigger");
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['binary_condition'] = {
    init: function () {
        this.appendValueInput("Service")
            .setCheck("Binary_sensor")
            .appendField("Si capteur binaire");
        this.appendDummyInput()
            .appendField("est")
            .appendField(new Blockly.FieldDropdown([["ON", "on"], ["OFF", "off"]]), "state");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "Condition");
        this.setNextStatement(true, "Condition");
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['color_picker'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Couleur :")
            .appendField(new Blockly.FieldColour("#000000"), "color");
        this.setOutput(true, "Service");
        this.setColour(75);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['color_rgb'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Couleur personnalisée :");
        this.appendDummyInput()
            .appendField("rouge ")
            .appendField(new Blockly.FieldNumber(0, 0, 255), "red")
            .appendField("vert ")
            .appendField(new Blockly.FieldNumber(0, 0, 255), "green")
            .appendField("bleu ")
            .appendField(new Blockly.FieldNumber(0, 0, 255), "blue");
        this.setOutput(true, "Service");
        this.setColour(75);
        this.setTooltip("Les valeurs doivent être comprise entre 0 et 255");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['time_condition_hour'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Début :")
            .appendField(new Blockly.FieldNumber(0, 0, 23), "Hour_debut")
            .appendField("h")
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Minute_debut")
            .appendField("m")
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Second_debut")
            .appendField("s");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Fin :")
            .appendField(new Blockly.FieldNumber(0, 0, 23), "Hour_end")
            .appendField("h")
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Minute_end")
            .appendField("m")
            .appendField(new Blockly.FieldNumber(0, 0, 59), "Second_end")
            .appendField("s");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "Condition");
        this.setNextStatement(true, "Condition");
        this.setColour(255);
        this.setTooltip("Si laissé seul, la condition s'appliquera tous les jours");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['time_condition_week'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "mon")
            .appendField("lundi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "tue")
            .appendField("mardi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "wed")
            .appendField("mercredi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "thu")
            .appendField("jeudi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "fri")
            .appendField("vendredi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "sat")
            .appendField("samedi");
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "sun")
            .appendField("dimanche");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "Condition");
        this.setNextStatement(true, "Condition");
        this.setColour(255);
        this.setTooltip("Si laissé seul, la condition s'appliquera à n'importe quel moment de la journée");
        this.setHelpUrl("");
    }
};