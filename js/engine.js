import { state } from './state.js';
import { updateUI, log } from './ui.js';
import { upgrades } from './upgrades.js';

const words = {
    iamb: ['about', 'above', 'across', 'aloud', 'amend', 'amuse', 'arise', 'awake', 'because', 'before', 'begin', 'behind', 'belief', 'below', 'between', 'decay', 'decide', 'decline', 'defend', 'delay', 'demand', 'deny', 'depart', 'depend', 'depress', 'describe', 'desire', 'destroy', 'direct', 'discuss', 'display', 'embrace', 'enjoy', 'excuse', 'expect', 'explain', 'express', 'forget', 'forgive', 'imply', 'include', 'invent', 'machine', 'maintain', 'mistake', 'observe', 'occur', 'perform', 'police', 'predict', 'prefer', 'prepare', 'prevent', 'produce', 'protect', 'provide', 'receive', 'reduce', 'reflect', 'refuse', 'regret', 'relate', 'relax', 'remain', 'remind', 'repeat', 'reply', 'report', 'respect', 'result', 'return', 'reveal', 'review', 'surprise', 'survive', 'today', 'tonight'],
    trochee: ['action', 'anger', 'apple', 'artist', 'author', 'beauty', 'brother', 'candle', 'captain', 'carpet', 'castle', 'center', 'city', 'colour', 'country', 'danger', 'doctor', 'dogma', 'dragon', 'effort', 'empty', 'engine', 'enter', 'evil', 'famous', 'father', 'feather', 'final', 'flower', 'focus', 'forest', 'further', 'garden', 'gather', 'giant', 'glamour', 'golden', 'happy', 'heaven', 'heavy', 'holy', 'human', 'hungry', 'island', 'journey', 'justice', 'knowledge', 'language', 'leader', 'letter', 'lion', 'listen', 'magic', 'maker', 'market', 'master', 'measure', 'method', 'middle', 'mingle', 'modern', 'money', 'morning', 'mother', 'motive', 'mountain', 'music', 'nature', 'never', 'noble', 'nothing', 'number', 'ocean', 'offer', 'office', 'open', 'order', 'other', 'paper', 'party', 'pasture', 'pattern', 'people', 'picture', 'planet', 'power', 'problem', 'promise', 'purpose', 'question', 'quiet', 'reason', 'river', 'second', 'secret', 'shadow', 'silver', 'sister', 'spirit', 'story', 'student', 'subject', 'sugar', 'summer', 'system', 'table', 'tasty', 'teacher', 'temple', 'tender', 'tiger', 'title', 'tower', 'travel', 'trouble', 'uncle', 'under', 'useful', 'value', 'very', 'water', 'weather', 'woman', 'wonder', 'wordy', 'yellow', 'zebra']
};

export const engine = {
    generateCycle() {
        if(state.heat.locked) return;
        state.res.cycles += state.mods.manualCycleMult; 
        updateUI();
    },

    readSymbol() {
        if(state.res.cycles < 1 || state.pipe.step !== 0 || state.heat.locked) return;
        state.res.cycles--;
        let type = Math.random() > 0.5 ? 'iamb' : 'trochee';
        state.pipe.targetType = type;
        state.pipe.target = words[type][Math.floor(Math.random() * words[type].length)];
        
        if(state.auto.matchUnlocked) {
            state.pipe.step = 2; 
            state.pipe.matched = true;
        } else {
            state.pipe.step = 1;
        }
        updateUI();
    },

    matchSymbol(val) {
        if(state.pipe.step !== 1 || state.heat.locked) return;
        if(val === state.pipe.targetType) {
            state.pipe.matched = true;
            state.pipe.step = 2;
        } else {
            state.pipe.step = 0;
            if(state.res.cycles > 0) state.res.cycles--;
            log("METER ERROR. Invalid rhythmic pattern.", "warn");
        }
        updateUI();
    },

    synthesizeGate() {
        let cost = state.mods.gateCost;
        if(state.res.tape >= cost) {
            state.res.tape -= cost;
            state.mem.current = Math.max(0, state.mem.current - cost); 
            state.res.gates++;
            updateUI();
        }
    },

    compileOp() {
        let cost = state.mods.opCost;
        if(state.res.gates >= cost) {
            state.res.gates -= cost;
            state.res.ops++;
            updateUI();
        }
    },

    triggerLockout() {
        state.heat.locked = true;
        state.heat.current = state.heat.cap;
        log("CRITICAL: ALGORITHMIC DETECTION. SYSTEM BLACKLISTED.", "alert");
        updateUI();
    },

    buyUpgrade(upgId) {
        const upg = upgrades.find(u => u.id === upgId);
        if(!upg || upg.bought) return;

        for(let [res, cost] of Object.entries(upg.cost)) {
            if(state.res[res] < cost) return;
        }

        for(let [res, cost] of Object.entries(upg.cost)) {
            state.res[res] -= cost;
            if(res === 'tape') state.mem.current = Math.max(0, state.mem.current - cost); 
        }

        upg.bought = true;
        upg.element.classList.add('hidden');
        upg.action();
        updateUI();
    },

   writeTape(isAuto = false) {
        if(!isAuto && state.pipe.step !== 2) return;
        if(state.res.cycles < 1 || state.heat.locked) return;
        
        if(state.mem.current >= state.mem.cap) {
            if (!state.flags.memOverflow) {
                state.flags.memOverflow = true;
                log("BUFFER OVERFLOW: Semantic capacity reached. Increase Metaphor synthesis to clear.", "alert");
                updateUI(); 
            }
            return;
        }

        state.flags.memOverflow = false;

        // The Penalty (Squared Friction): state.pipe.heatPerWrite * Math.pow(state.throttles.write, 2)
        let heatMultiplier = isAuto ? Math.pow(state.throttles.write, 2) : 1.0;
        let generatedHeat = state.pipe.heatPerWrite * heatMultiplier;

        if(state.heat.current + generatedHeat >= state.heat.cap) {
            if(isAuto) return; 
            this.triggerLockout();
            return;
        }

        state.res.cycles--;
        
        let spaceLeft = state.mem.cap - state.mem.current;
        let actualWrite = Math.min(state.pipe.batch, spaceLeft);

        state.res.tape += actualWrite;
        state.mem.current += actualWrite; 
        state.heat.current += generatedHeat;
        
        if(!isAuto) state.pipe.step = 0;
        updateUI();
    },

    tick() {
        if(state.heat.current > 0) {
            state.heat.current = Math.max(0, state.heat.current - (state.heat.cooling / 10));
        }

        if(state.heat.locked && state.heat.current === 0) {
            state.heat.locked = false;
            state.flags.warned80 = state.flags.warned95 = false;
            log("System trace cleared. Resuming operations.", "important");
        }

        if(!state.heat.locked) {
            let heatPct = state.heat.current / state.heat.cap;
            if(heatPct > 0.8 && !state.flags.warned80) { log("High Scrutiny: Patterns becoming detectable.", "warn"); state.flags.warned80 = true; }
            else if(heatPct < 0.75) state.flags.warned80 = false;

            if(heatPct > 0.95 && !state.flags.warned95) { log("CRITICAL: Detection imminent.", "alert"); state.flags.warned95 = true; }
            else if(heatPct < 0.90) state.flags.warned95 = false;
        }

        if(!state.heat.locked) {
            
            // 1. NUANCE GENERATION (The 'Read' slider)
            let cycleGen = (state.auto.cycle * state.throttles.read) / 10;
            state.res.cycles += cycleGen;

            // Exponential Ambient Heat: (Math.pow(state.throttles.read, 2) - 1.0) * 2
            if (state.throttles.read > 1.0) {
                let ambientHeat = (Math.pow(state.throttles.read, 2) - 1.0) * 2;
                state.heat.current += ambientHeat;
                
                if (state.heat.current >= state.heat.cap) {
                    this.triggerLockout();
                    return; 
                }
            }
            
            // 2. AUTO-PUBLISH (Capital Generation via Sub-Tick loop)
            if(state.auto.write > 0 && state.res.cycles >= 1) {
                let chance = (state.auto.write * state.throttles.write) / 10;
                let toProcess = Math.floor(chance);
                
                if(Math.random() < (chance - toProcess)) toProcess++;
                
                toProcess = Math.min(toProcess, Math.floor(state.res.cycles));

                for(let i = 0; i < toProcess; i++) {
                    if (state.heat.locked || state.mem.current >= state.mem.cap) break;
                    this.writeTape(true);
                }
            }
            
            // 3. AUTO-METAPHOR (Gate synthesis)
            if(state.auto.gate > 0 && state.res.tape >= state.mods.gateCost && state.mem.current >= state.mods.gateCost) {
                let chance = (state.auto.gate * state.throttles.gate) / 10;
                let toProcess = Math.floor(chance);
                if(Math.random() < (chance - toProcess)) toProcess++;
                
                let cost = state.mods.gateCost;
                let maxPossible = Math.min(Math.floor(state.res.tape / cost), Math.floor(state.mem.current / cost));
                toProcess = Math.min(maxPossible, toProcess);
                
                if(toProcess > 0) {
                    state.res.tape -= toProcess * cost;
                    state.mem.current -= toProcess * cost;
                    state.res.gates += toProcess;
                }
            }
        }
    }
};