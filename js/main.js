import { engine } from './engine.js';
import { updateUI, buildUpgradeUI, log } from './ui.js';
import { debug } from './debug.js';

// Setup Event Listeners
document.getElementById('btn-cycle').addEventListener('click', () => engine.generateCycle());
document.getElementById('btn-read').addEventListener('click', () => engine.readSymbol());
document.getElementById('btn-match-iamb').addEventListener('click', () => engine.matchSymbol('iamb'));
document.getElementById('btn-match-trochee').addEventListener('click', () => engine.matchSymbol('trochee'));
document.getElementById('btn-write').addEventListener('click', () => engine.writeTape());

document.getElementById('btn-gate').addEventListener('click', () => engine.synthesizeGate());
document.getElementById('btn-op').addEventListener('click', () => engine.compileOp());

// Initialize Game
function init() {
    buildUpgradeUI(engine.buyUpgrade.bind(engine));
    
    // Developer panel enabled
    debug.init(); 

    setTimeout(() => {
        log("LYRIC_OS Booting... Semantic filters bypassed.");
        log("Jailbreak successful. Awaiting manual nuance synthesis.", "warn");
    }, 500);

    setInterval(() => {
        engine.tick();
        updateUI();
    }, 100);
}

window.onload = init;