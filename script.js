function element(id) {
    return document.getElementById(id);
}

const audioContext = new AudioContext();
const destination = audioContext.destination;
const carrier = audioContext.createOscillator();
const modulationDepth = audioContext.createGain();
const modulator = audioContext.createOscillator();
const carrierSource = audioContext.createConstantSource();

function toggleOnOff(event) {
    audioContext.resume();
    if (event.currentTarget.value == "Play") {
        carrier.connect(destination);
        event.currentTarget.value = "Pause";
    } else {
        event.currentTarget.value = "Play";
        carrier.disconnect(destination);
    }
}

function updateLabels() {
    element("modulatorLabel").innerText = `Modulator Ratio = 1:${element("modulator").value}`;
    element("carrierLabel").innerText = `Carrier Frequency = ${element("carrier").value}`;
    element("depthLabel").innerText = `FM Index: ${Number(element("depth").value).toFixed(2)}`;
}

function setCarrierFrequency(e) {
    carrierSource.offset.value = e.currentTarget.value;
    updateModulatorFrequency();
}

function updateModulatorFrequency() {
    modulator.frequency.setValueAtTime(element("modulator").value * element("carrier").value, audioContext.currentTime);
    updateFmIndex();
}

function updateFmIndex() {
    modulationDepth.gain.value = element("depth").value * modulator.frequency.value;
    updateLabels();
}

addEventListener("DOMContentLoaded", () => {
    updateLabels();
    element("carrier").addEventListener("input", setCarrierFrequency);
    element("on_off").addEventListener("click", toggleOnOff);
    element("modulator").addEventListener("input", updateModulatorFrequency);
    element("depth").addEventListener("input", updateFmIndex);

    carrierSource.start();
    modulator.start();
    carrier.start();

    carrierSource.connect(carrier.frequency);
    modulator.connect(modulationDepth);
    modulationDepth.connect(carrier.frequency);
});
