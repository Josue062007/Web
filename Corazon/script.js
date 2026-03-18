// script.js

// --- 1. Lógica de las Partículas Flotantes (Más lentas y oscuras) ---
function createHeartParticle() {
    const container = document.getElementById('particles');
    const wrapper = document.createElement('div');
    wrapper.classList.add('particle-wrapper');
    const heart = document.createElement('div');
    heart.classList.add('particle-heart');
    wrapper.appendChild(heart);
    
    wrapper.style.left = `${Math.random() * 100}vw`;
    const duration = Math.random() * 8 + 6; // Flotan más lento
    wrapper.style.animationDuration = `${duration}s`;
    heart.style.transform = `rotate(-45deg) scale(${Math.random() * 0.8 + 0.3})`;
    
    container.appendChild(wrapper);
    setTimeout(() => wrapper.remove(), duration * 1000);
}
setInterval(createHeartParticle, 600); // Aparecen menos frecuentemente


// --- 2. Lógica de Inteligencia Artificial (Detección de Mano Izquierda/Derecha) ---
const videoElement = document.getElementById('input-video');
const secretCardLeft = document.getElementById('secret-card-left');
const secretCardRight = document.getElementById('secret-card-right');
const heartEl = document.getElementById('heart');
const mainMsg = document.getElementById('main-message');
const statusText = document.getElementById('status-indicator');


// Función principal llamada por la IA de MediaPipe cada vez que procesa el video
function onResults(results) {
    if (!statusText.classList.contains('hide')) {
        statusText.classList.add('hide');
    }

    let handPosition = "center"; // center, left, right

    // Verificar si hay manos humanas en el encuadre web y obtener su posición
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Tomamos la primera mano detectada
        const landmarks = results.multiHandLandmarks[0];
        const wristX = landmarks[0].x; // X va de 0.0 a 1.0 
        
        // MediaPipe x=0 es el borde izquierdo de la imagen capturada. 
        // Vamos a decir: x > 0.65 es moverse a la derecha de la pantalla (el lado derecho visual)
        // Y x < 0.35 es moverse a la izquierda de la pantalla.
        if (wristX > 0.65) {
            handPosition = "left"; 
        } else if (wristX < 0.35) {
            handPosition = "right";  
        }
    }

    // Mostrar el mensaje correspondiente dependiendo hacia dónde movió la mano
    if (handPosition === "left") {
        secretCardLeft.classList.add('show');
        secretCardRight.classList.remove('show');
        heartEl.classList.add('hide');
        mainMsg.classList.add('hide');
    } else if (handPosition === "right") {
        secretCardRight.classList.add('show');
        secretCardLeft.classList.remove('show');
        heartEl.classList.add('hide');
        mainMsg.classList.add('hide');
    } else {
        // En el centro o sin manos: Todo vuelve a la normalidad
        secretCardLeft.classList.remove('show');
        secretCardRight.classList.remove('show');
        heartEl.classList.remove('hide');
        mainMsg.classList.remove('hide');
    }
}

// --- 3. Inicialización del Motor de IA ---
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1,           // Solo nos importa 1 mano por ahora
    modelComplexity: 1,       
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});

camera.start().catch((err) => {
    statusText.innerText = "Error: Permite el acceso a la cámara para el conjuro místico.";
});
