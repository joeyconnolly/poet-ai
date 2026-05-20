export const state = {
    // res: Nuance (cycles), Capital (tape), Metaphors (gates), Poems (ops)
    res: { cycles: 0, tape: 0, gates: 0, ops: 0 },
    
    // heat: Scrutiny risk
    heat: { current: 0, cap: 100, cooling: 2.5, locked: false },
    
    // mem: Semantic Buffer capacity
    mem: { current: 0, cap: 350 }, 
    
    pipe: {
        step: 0, 
        target: null,
        targetType: null,
        matched: null,
        batch: 4, // Throughput/Density
        heatPerWrite: 10 // Scrutiny per submission
    },
    
    mods: {
        manualCycleMult: 1, 
        gateCost: 100,      
        opCost: 50          
    },

    auto: { cycle: 0, read: 0, write: 0, gate: 0, matchUnlocked: false },
    
    throttles: { read: 1.0, write: 1.0, gate: 1.0 },

    flags: { 
        gatesUnlocked: false, // Metaphors unlocked
        opsUnlocked: false,   // Poems unlocked
        warned80: false, 
        warned95: false, 
        transcended: false, 
        memOverflow: false 
    }
};