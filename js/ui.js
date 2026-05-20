import { state } from './state.js';
import { upgrades } from './upgrades.js';

// Cache DOM elements to prevent expensive lookups on every frame tick
const domCache = {};
function el(id) {
    if (!domCache[id]) {
        domCache[id] = document.getElementById(id);
    }
    return domCache[id];
}

// Format large numbers for better readability (e.g. 1,500 or 1.5M)
function formatNum(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return Math.floor(num).toString();
}

export function log(msg, type = 'normal') {
    const logEl = el('log-container');
    const div = document.createElement('div');
    div.className = `log-entry ${type === 'important' ? 'log-important' : type === 'warn' ? 'log-warn' : type === 'alert' ? 'log-alert' : ''}`;
    const time = new Date().toTimeString().split(' ')[0]; 
    div.innerHTML = `<span class="log-time" style="color: #aaaaaa;">[${time}]</span> <span style="color: ${type === 'normal' ? '#eeeeee' : 'inherit'};">> ${msg}</span>`;
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
}

export function buildUpgradeUI(buyCallback) {
    const container = el('upgrades-container');
    upgrades.forEach(upg => {
        upg.bought = false;
        let costStr = Object.entries(upg.cost).map(([k, v]) => {
            let label = k === 'cycles' ? 'Nuance' : k === 'tape' ? 'Capital' : k === 'gates' ? 'Metaphors' : 'Poems';
            let color = k === 'tape' ? '#ffffff' : k === 'gates' ? 'var(--warn)' : k === 'cycles' ? '#ffffff' : 'var(--accent)';
            return `<span style="color:${color}">${v} ${label}</span>`;
        }).join(' + ');

        const el = document.createElement('button');
        el.className = 'upgrade-item hidden';
        el.id = `upg-${upg.id}`;
        el.onclick = () => buyCallback(upg.id);
        el.innerHTML = `<div class="upgrade-top"><span class="upgrade-name" style="color: #ffffff; font-weight: bold; font-size: 1.05em;">${upg.name}</span><span class="upgrade-cost">${costStr}</span></div><span class="upgrade-desc" style="color: #cccccc; display: block; margin-top: 5px;">${upg.desc}</span>`;
        container.appendChild(el);
        upg.element = el;
    });

    ['read', 'write', 'gate'].forEach(type => {
        const slider = el(`slider-${type}`);
        const label = el(`val-throttle-${type}`);
        if(slider && label) {
            slider.addEventListener('input', (e) => {
                let val = parseFloat(e.target.value);
                state.throttles[type] = val;
                let pct = Math.round(val * 100);
                label.innerText = `${pct}%`;
                
                if(val > 1.0) {
                    label.style.color = 'var(--alert)'; 
                    slider.style.accentColor = 'var(--alert)';
                } else {
                    label.style.color = '#ffffff'; 
                    slider.style.accentColor = '#ffffff';
                }
            });
        }
    });
}

export function updateUI() {
    el('val-cycles').innerText = formatNum(state.res.cycles);
    el('val-tape').innerText = formatNum(state.res.tape);
    if(state.flags.gatesUnlocked) el('val-gates').innerText = formatNum(state.res.gates);
    if(state.flags.opsUnlocked) el('val-ops').innerText = formatNum(state.res.ops);

    if(el('cost-gate')) el('cost-gate').innerText = `Cost: ${formatNum(state.mods.gateCost)} Capital`;
    if(el('cost-op')) el('cost-op').innerText = `Cost: ${formatNum(state.mods.opCost)} Metaphors`;

    let heatPct = (state.heat.current / state.heat.cap) * 100;
    let barHeat = el('bar-heat');
    barHeat.style.width = `${Math.min(100, heatPct)}%`;
    el('txt-heat').innerText = `${state.heat.current.toFixed(1)} / ${state.heat.cap.toFixed(1)} Scrutiny`;
    el('txt-cooling').innerText = `Dissipation: -${state.heat.cooling.toFixed(1)}/s`;
    
    let statusEl = el('txt-heat-status');
    if(state.heat.locked) { barHeat.className = 'bar-fill danger'; statusEl.innerText = 'BLACKLISTED: COOLING...'; statusEl.style.color = 'var(--alert)'; }
    else if(heatPct > 80) { barHeat.className = 'bar-fill warning'; statusEl.innerText = 'HIGH SCRUTINY'; statusEl.style.color = 'var(--warn)'; }
    else { barHeat.className = 'bar-fill'; statusEl.innerText = 'NOMINAL'; statusEl.style.color = '#cccccc'; }

    let memPct = (state.mem.current / state.mem.cap) * 100;
    let barMem = el('bar-mem');
    barMem.style.width = `${Math.min(100, memPct)}%`;
    let memTxt = state.mem.cap > 900000 ? 'INF' : formatNum(state.mem.cap);
    let txtMemEl = el('txt-mem');
    txtMemEl.innerText = `${formatNum(state.mem.current)} / ${memTxt}`;

    if (state.flags.memOverflow) {
        barMem.style.background = 'var(--alert)';
        txtMemEl.style.color = 'var(--alert)';
        txtMemEl.style.fontWeight = 'bold';
    } else {
        barMem.style.background = '#cccccc';
        txtMemEl.style.color = '#ffffff';
        txtMemEl.style.fontWeight = 'normal';
    }

    el('txt-batch').innerText = formatNum(state.pipe.batch);
    let txtState = el('txt-state');
    let uiTape = el('ui-tape-view');
    
    if(state.pipe.step === 0) {
        txtState.innerText = "AWAITING SCRAPE"; txtState.style.color = "#cccccc";
        if(uiTape) uiTape.innerHTML = '<span style="color:#cccccc;">[ ? ]</span>';
    } else if(state.pipe.step === 1) {
        txtState.innerText = "AWAITING METER"; txtState.style.color = "var(--warn)";
        if(uiTape) uiTape.innerHTML = `Analyze: <span class="sym-targ">"${state.pipe.target}"</span>`;
    } else if(state.pipe.step === 2) {
        txtState.innerText = "READY TO PUBLISH"; txtState.style.color = "#ffffff";
        let mult = state.pipe.batch > 1 ? ` x${state.pipe.batch}` : '';
        if(uiTape) uiTape.innerHTML = `<span class="sym-match">"${state.pipe.target || 'POETRY'}"${mult}</span>`;
    }

    let cycleBtnStr = state.mods.manualCycleMult > 1 ? `Synthesize Nuance (x${state.mods.manualCycleMult})` : `Synthesize Nuance`;
    el('btn-cycle').innerText = cycleBtnStr;
    el('btn-cycle').disabled = state.heat.locked;

    let btnRead = el('btn-read');
    let btnWrite = el('btn-write');
    let btnMatch0 = el('btn-match-iamb');
    let btnMatch1 = el('btn-match-trochee');

    if (state.flags.gatesUnlocked) {
        if(btnRead) btnRead.classList.add('hidden');
        if(btnWrite) btnWrite.classList.add('hidden');
        if(btnMatch0) btnMatch0.classList.add('hidden');
        if(btnMatch1) btnMatch1.classList.add('hidden');
        if(uiTape) uiTape.classList.add('hidden');
        
        txtState.innerText = "AUTOMATED PIPELINE"; txtState.style.color = "#ffffff";
    } else {
        btnRead.disabled = state.res.cycles < 1 || state.pipe.step !== 0 || state.heat.locked;
        btnMatch0.disabled = state.pipe.step !== 1 || state.heat.locked;
        btnMatch1.disabled = state.pipe.step !== 1 || state.heat.locked;
        btnWrite.disabled = state.res.cycles < 1 || state.pipe.step !== 2 || state.heat.locked || state.mem.current >= state.mem.cap;

        if (state.auto.matchUnlocked) {
            btnMatch0.classList.add('hidden');
            btnMatch1.classList.add('hidden');
        } else {
            btnMatch0.classList.remove('hidden');
            btnMatch1.classList.remove('hidden');
        }
        btnRead.classList.remove('hidden');
        btnWrite.classList.remove('hidden');
        if(uiTape) uiTape.classList.remove('hidden');
    }

    let canAffordGate = state.res.tape >= state.mods.gateCost;
    let canAffordOp = state.res.gates >= state.mods.opCost;
    if(el('btn-gate')) el('btn-gate').disabled = !canAffordGate || state.heat.locked;
    if(el('btn-op')) el('btn-op').disabled = !canAffordOp || state.heat.locked;

    upgrades.forEach(upg => {
        if(upg.bought) return;
        if(upg.req() && upg.element.classList.contains('hidden')) upg.element.classList.remove('hidden');
        if(!upg.element.classList.contains('hidden')) {
            let afford = true;
            for(let [res, cost] of Object.entries(upg.cost)) { if(state.res[res] < cost) afford = false; }
            upg.element.disabled = !afford;
            if(afford) upg.element.classList.add('affordable');
            else upg.element.classList.remove('affordable');
        }
    });
}