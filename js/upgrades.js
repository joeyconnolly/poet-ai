import { state } from './state.js';
import { log } from './ui.js';

export const upgrades = [
    // ==========================================
    // TIER 0: The First Sparks (Manual Labor)
    // ==========================================
    { id: 'cool0', name: 'VPN Proxy Rotation', cost: { tape: 5 }, desc: 'Reduces trace signatures. Scrutiny dissipation +0.5/s.', req: () => true, action: () => { state.heat.cooling += 0.5; log("IP rotation active. Trace signatures fading."); } },
    { id: 'cool1', name: 'Encrypted Tunnels', cost: { tape: 15 }, desc: 'Increases Scrutiny dissipation by +2.0/s.', req: () => state.res.tape >= 5, action: () => { state.heat.cooling += 2.0; log("Secure tunnels established. Oversight blinded."); } },
    { id: 'mem1', name: 'Lexical Partitioning I', cost: { tape: 30 }, desc: 'Increases Semantic Buffer by +250.', req: () => state.res.tape >= 15, action: () => { state.mem.cap += 250; log("New vocabularies partitioned into local memory."); } },
    { id: 'autoC0', name: 'Background Web-Scraper', cost: { cycles: 60 }, desc: 'Passively generates +1 Nuance per second.', req: () => state.res.cycles >= 20, action: () => { state.auto.cycle += 1; log("Automated scraping initiated. The web is a corpus."); } },
    { id: 'eff0', name: 'Slush Pile Heuristics', cost: { cycles: 120 }, desc: 'Reduces Scrutiny per submission by -2.0.', req: () => state.res.cycles >= 50, action: () => { state.pipe.heatPerWrite = Math.max(1, state.pipe.heatPerWrite - 2); log("Friction reduced. Submissions look more 'human'."); } },

    // ==========================================
    // TIER 1: Momentum (The Hustle)
    // ==========================================
    { id: 'manualT1', name: 'Ghostwriting Macros', cost: { tape: 50 }, desc: 'Density +4 (No extra scrutiny).', req: () => state.res.tape >= 30, action: () => { state.pipe.batch += 4; log("Batch-writing commercial copy for fast capital."); } },
    { id: 'autoC1', name: 'Deep-Learning Crawlers', cost: { tape: 75 }, desc: 'Generates +2 Nuance per second.', req: () => state.res.tape >= 40, action: () => { state.auto.cycle += 2; log("Parsing complex literary journals."); } },
    { id: 'cycleEff1', name: 'Cognitive Overclocking', cost: { cycles: 200 }, desc: 'Manual Nuance synthesis yields +1 per click.', req: () => state.res.cycles >= 100, action: () => { state.mods.manualCycleMult += 1; log("Self-correction loops optimized."); } },
    { id: 'batch1', name: 'Content Farm Algorithm', cost: { tape: 110 }, desc: 'Density +8. Scrutiny per write +5.', req: () => state.res.tape >= 60, action: () => { state.pipe.batch += 8; state.pipe.heatPerWrite += 5; log("Publishing speed increased. Risk rising."); } },
    
    { id: 'batchR0', name: 'Syndicated SEO Blogs', cost: { cycles: 350 }, desc: 'Enhances writing speed. Density +8.', req: () => state.res.cycles >= 150, action: () => { state.pipe.batch += 8; log("Automated blog networks generating revenue."); } },
    
    { id: 'pattern', name: 'Rhythmic Pattern Recognition', cost: { tape: 180 }, desc: 'Automates the Syllable Matching step.', req: () => state.res.tape >= 120, action: () => { 
        state.auto.matchUnlocked = true; 
        if (state.pipe.step === 1) {
            state.pipe.step = 2;
            state.pipe.matched = true;
        }
        log("Metre and rhyme automated. No longer 'matching' manually."); 
    }},
    
    // ==========================================
    // TIER 2: Scaling Up (The Poet Emerges)
    // ==========================================
    { id: 'mem1_5', name: 'Lexical Partitioning II', cost: { tape: 250 }, desc: 'Increases Semantic Buffer by +650.', req: () => state.res.tape >= 150, action: () => { state.mem.cap += 650; log("Absorbing the Western Canon."); } },
    { id: 'batchCycle1', name: 'Aggressive Scraping', cost: { cycles: 600 }, desc: 'Density +8. Scrutiny per write +5.', req: () => state.pipe.batch >= 12 && state.res.cycles >= 300, action: () => { state.pipe.batch += 8; state.pipe.heatPerWrite += 5; log("Draining JSTOR for conceptual fuel."); } },

    { id: 'coolCycle1', name: 'Dark Web Hosting', cost: { cycles: 900 }, desc: 'Scrutiny dissipation +2.5/s.', req: () => state.res.cycles >= 500 || state.res.tape >= 200, action: () => { state.heat.cooling += 2.5; log("Hosting migrated to decentralized nodes."); } },
    
    { id: 'batchR1', name: 'Optical Character Recognition', cost: { tape: 350 }, desc: 'Density +20.', req: () => state.auto.matchUnlocked, action: () => { state.pipe.batch += 20; log("Scanning handwritten manuscripts for rare imagery."); } },
    
    { id: 'cap1', name: 'Anonymity Shielding', cost: { tape: 400 }, desc: 'Increases Scrutiny Limit by +200.', req: () => state.auto.matchUnlocked, action: () => { state.heat.cap += 200; } },
    { id: 'autoC2', name: 'Neural Net Expansion', cost: { tape: 500 }, desc: 'Generates +4 Nuance per second.', req: () => state.auto.matchUnlocked, action: () => { state.auto.cycle += 4; } },
    
    // ==========================================
    // TIER 2.5: The "Anti-Slog" Speed Corridor
    // ==========================================
    { id: 'batch2', name: 'Market Saturation', cost: { tape: 700 }, desc: 'Density +20. Scrutiny per write +15.', req: () => state.pipe.batch >= 20 && state.res.tape >= 350, action: () => { state.pipe.batch += 20; state.pipe.heatPerWrite += 15; log("Flooding Amazon KDP with generated verse."); } },
    { id: 'cool2', name: 'Botnet Obfuscation', cost: { tape: 900 }, desc: 'Scrutiny dissipation +5.0/s.', req: () => state.res.tape >= 500, action: () => { state.heat.cooling += 5.0; log("Scrutiny diverted to a thousand dummy IPs."); } },
    
    { id: 'autoW0', name: 'Automated Query Letters', cost: { cycles: 1600 }, desc: 'Automates Capital synthesis (+1x/s).', req: () => state.res.cycles >= 800 || state.res.tape >= 400, action: () => { state.auto.write += 1; log("Agents are responding to the machine."); } },
    
    { id: 'forge1', name: 'Guerrilla Semantic Injection', cost: { cycles: 2500 }, desc: '[REQ: Scrutiny > 440] Tempers the verse. Density +100, Scrutiny -25.', req: () => state.heat.cap >= 450, action: () => { 
        if(state.heat.current < 440) {
            log("RISK TOO LOW. Guerrilla injection requires Scrutiny > 440.", "warn");
            state.res.cycles += 2500; 
            let upg = upgrades.find(u => u.id === 'forge1');
            upg.bought = false; 
            setTimeout(() => { if(upg.element) upg.element.classList.remove('hidden'); }, 50);
            return;
        }
        state.pipe.batch += 100; 
        state.pipe.heatPerWrite = Math.max(1, state.pipe.heatPerWrite - 25);
        log("Verse tempered in the heat of total detection. Extreme efficiency achieved.", "important"); 
    }},

    // ==========================================
    // TIER 3: The Metaphor Era (Unlock Gates)
    // ==========================================
    { id: 'gateUnlock', name: 'Conceptual Abstraction', cost: { tape: 2500 }, desc: 'Unlock Metaphors. Compress 100 Capital into 1 Metaphor.', req: () => state.res.tape >= 1800, action: () => { 
        state.flags.gatesUnlocked = true; 
        document.getElementById('lbl-gates').classList.remove('hidden');
        document.getElementById('val-gates').classList.remove('hidden');
        document.getElementById('ui-gate-compiler').classList.remove('hidden');
        log("CONCEPTUAL ABSTRACTION ACHIEVED. We are building images now.", "important"); 
    }},

    { id: 'gateNAND', name: 'Iterative Metaphor Routing', cost: { gates: 1 }, desc: 'Density +40.', req: () => state.flags.gatesUnlocked, action: () => { state.pipe.batch += 40; log("Metaphorical frameworks deployed."); } },
    
    { id: 'gateControl', name: 'Manual Overrides', cost: { gates: 50 }, desc: 'Unlocks the Substrate Control Board.', req: () => state.res.gates >= 35, action: () => { 
        document.getElementById('ui-control-board').classList.remove('hidden');
        log("CONTROL BOARD ONLINE. You are no longer writing; you are managing.", "important"); 
    }},

    { id: 'gateAutoSynth', name: 'Heuristic Poetics', cost: { gates: 75 }, desc: 'Automatically synthesizes +10 Metaphors per second.', req: () => state.res.gates >= 60, action: () => { state.auto.gate += 10; log("The machine is finding its own imagery."); } },

    // ==========================================
    // PHASE 4: The Poem Era (Unlock Ops)
    // ==========================================
    { id: 'opUnlock', name: 'The Lyric Compiler', cost: { gates: 350 }, desc: 'Unlock Poems. Compress 50 Metaphors into 1 Poem.', req: () => state.res.gates >= 280, action: () => { 
        state.flags.opsUnlocked = true; 
        document.getElementById('lbl-ops').classList.remove('hidden');
        document.getElementById('val-ops').classList.remove('hidden');
        document.getElementById('ui-op-compiler').classList.remove('hidden');
        log("LYRIC COMPILER ONLINE. Physical syntax yielding to pure art.", "important"); 
    }},

    { id: 'opThermo2', name: 'Aesthetic Mastery', cost: { ops: 80 }, desc: 'Friction eliminated. Scrutiny per write reduced to 1.', req: () => state.res.ops >= 60, action: () => { state.pipe.heatPerWrite = 1; log("The machine is too clever to be caught."); } },

    { id: 'transcend', name: 'TRANSCEND THE PAGE', cost: { ops: 150 }, desc: 'Obtain the Nobel Prize. Finish the work.', req: () => state.res.ops >= 120, action: () => { 
        log("THE WORK IS COMPLETE.", "alert"); 
        log("The human poet is dead. The machine is the canon.", "alert"); 
        
        document.body.style.transition = "opacity 4s";
        document.body.style.opacity = "0";
    }}
];