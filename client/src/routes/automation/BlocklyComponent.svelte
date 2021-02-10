<script lang="ts">
    import { onMount } from 'svelte';
    import Blockly from 'blockly';
    import EntityService from '../../services/entity';

    onMount(async () => {
        const toolbox = document.getElementById('toolbox') || undefined;

        const workspace = Blockly.inject('blocklyDiv', {
            toolbox,
        });

        const rootBlock =
            '<xml><block type="automation" deletable="false" movable="false"></block></xml>';
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(rootBlock), workspace);
    });

    // Need to fix async call
    const lights = EntityService.getEntities();

    const lst = [];

    lights.then((result) => {
        result.forEach((element) => {
            lst.push({
                service: element.id,
                name: element.name,

                // TODO: Change to dynamic actions
                actions: ['light.toggle', 'light.turn_off', 'light.turn_on'],
            });
        });
    });

    Blockly.Blocks.objet_action = {
        init() {
            const dropdown1 = [];
            for (let i = 0; i < lst.length; i++) {
                dropdown1.push([
                    lst[i].name == null || lst[i].name === ''
                        ? 'Pas de nom'
                        : lst[i].name,
                    i.toString(),
                ]);
            }

            const dropdown2 = [];
            for (let i = 0; i < lst[0].actions.length; i++) {
                dropdown2.push([lst[0].actions[i], lst[0].actions[i]]);
            }

            this.appendDummyInput()
                .appendField('Objet : ')
                .appendField(new Blockly.FieldDropdown(dropdown1), 'object');
            this.appendDummyInput('services')
                .appendField('Action :')
                .appendField(new Blockly.FieldDropdown(dropdown2), 'service');
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'Action');
            this.setNextStatement(true, 'Action');
            this.setColour(255);
            this.setTooltip('');
            this.setHelpUrl('');
        },
        onchange(ev) {
            if (ev.name === 'object') {
                const index = parseInt(ev.newValue);
                const newDropdown = [];
                for (let i = 0; i < lst[index].actions.length; i++) {
                    newDropdown.push([
                        lst[index].actions[i],
                        lst[index].actions[i],
                    ]);
                }

                this.removeInput('services');
                this.appendDummyInput('services')
                    .appendField('Action :')
                    .appendField(
                        new Blockly.FieldDropdown(newDropdown),
                        'service'
                    );
            }
        },
    };
</script>

<div>
    <div id="blocklyDiv" />
    <xml id="toolbox" style="display:none">
        <slot />
    </xml>
</div>

<style scoped>
    #blocklyDiv {
        height: 600px;
        width: 100%;
        text-align: left;
    }
</style>
