import { state } from './state.js';
import { updateUI, log } from './ui.js';
import { upgrades } from './upgrades.js';

export const debug = {
    init() {
        // Create a container for debug buttons
        const debugDiv = document.createElement('div');
        debugDiv.id = 'debug-panel';
        debugDiv.style = `
            position: fixed; bottom: 10px; right: 10px; 
            background: #220000; border: 1px solid #ff0000; 
            padding: 10px; display: flex; gap: 5px; z-index: 9999; 
            color: #ffffff;
        `;

        // Helper to create buttons
        const createCheat = (label, action) => {
            const btn = document.createElement('button');
            btn.innerText = label;
            btn.style.borderColor = '#ff0000';
            btn.style.color = '#ffffff';
            btn.style.backgroundColor = '#440000';
            btn.onclick = () => { action(); updateUI(); };
            debugDiv.appendChild(btn);
        };

        // Rebranded Resource Spammers
        createCheat('+100 Nuance', () => state.res.cycles += 100);
        createCheat('+100 Capital', () => {
            state.res.tape += 100;
            state.mem.current += 100; 
        });
        createCheat('+100 Metaphors', () => state.res.gates += 100);
        createCheat('+100 Poems', () => state.res.ops += 100);
        createCheat('Reset Scrutiny', () => {
            state.heat.current = 0;
            state.heat.locked = false;
        });

        // Fast-forward to the Control Board / Metaphor era
        createCheat('Skip to Metaphors', () => {
            const targetIndex = upgrades.findIndex(u => u.id === 'gateUnlock');
            if (targetIndex === -1) return;

            for (let i = 0; i <= targetIndex; i++) {
                let upg = upgrades[i];
                
                if (!upg.bought) {
                    // Bypass the "Guerrilla Semantic Injection" scrutiny requirement
                    if (upg.id === 'forge1') state.heat.current = 450;
                    
                    upg.bought = true;
                    if (upg.element) upg.element.classList.add('hidden');
                    upg.action(); 
                }
            }

            // Reset resources for a clean test of Phase 3
            state.res.cycles = 0;
            state.res.tape = 0;
            state.res.gates = 0;
            state.mem.current = 0;
            
            state.heat.current = 0;
            state.heat.locked = false;
            state.pipe.step = 0;

            log("DEBUG: Fast-forwarded to Phase 3: Conceptual Abstraction.", "important");
        });

        document.body.appendChild(debugDiv);
        log("DEBUG: Authorial overrides active.", "alert");
    }
};