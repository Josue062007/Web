// script.js

// --- 1. Lógica de las Partículas Flotantes ---
function createHeartParticle() {
    const container = document.getElementById('particles');
    const wrapper = document.createElement('div');
    wrapper.classList.add('particle-wrapper');
    const heart = document.createElement('div');
    heart.classList.add('particle-heart');
    wrapper.appendChild(heart);
    
    wrapper.style.left = `${Math.random() * 100}vw`;
    const duration = Math.random() * 5 + 4;
    wrapper.style.animationDuration = `${duration}s`;
    heart.style.transform = `rotate(-45deg) scale(${Math.random() * 0.8 + 0.3})`;
    
    container.appendChild(wrapper);
    setTimeout(() => wrapper.remove(), duration * 1000);
}
setInterval(createHeartParticle, 400);


// --- 2. Lógica de Inteligencia Artificial (Detección de Mano) ---
const videoElement = document.getElementById('input-video');
const secretCard = document.getElementById('secret-card');
const heartEl = document.getElementById('heart');
const mainMsg = document.getElementById('main-message');
const statusText = document.getElementById('status-indicator');

// Utilidad matemática para calcular la distancia entre dos puntos 2D (x,y)
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Lógica humana: Verifica si la mano está abierta evaluando la flexión de los dedos
function isHandOpen(landmarks) {
    const wrist = landmarks[0];
    
    // Índices de MediaPipe para los dedos: Punta del dedo (tip) y nudillo central (pip)
    const tips = [8, 12, 16, 20]; // Índice, Medio, Anular, Meñique
    const pips = [6, 10, 14, 18]; 
    
    let extendedFingers = 0;
    
    for (let i = 0; i < 4; i++) {
        let distTip = getDistance(wrist, landmarks[tips[i]]);
        let distPip = getDistance(wrist, landmarks[pips[i]]);
        
        // Si la punta está más lejos (matemáticamente) de la muñeca que su propio nudillo, está recto.
        if (distTip > distPip) {
            extendedFingers++;
        }
    }
    
    // Consideramos "mano abiertamente abierta" si los 4 dedos se están extendiendo
    return extendedFingers >= 4;
}

// Función principal llamada por la IA de MediaPipe cada vez que procesa el video
function onResults(results) {
    // Si la cámara carga y funciona, ocultamos el texto rojo de estado
    if (!statusText.classList.contains('hide')) {
        statusText.classList.add('hide');
    }

    let handOpenDetected = false;

    // Verificar si hay manos humanas en el encuadre web
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
            if (isHandOpen(landmarks)) {
                handOpenDetected = true;
                break; // Solo necesitamos detectar una palma extendida
            }
        }
    }

    // Efecto dinámico en cadena
    if (handOpenDetected) {
        // Enseñar Mensaje Secreto
        secretCard.classList.add('show');
        heartEl.classList.add('hide');
        mainMsg.classList.add('hide');
    } else {
        // Ocultar Mensaje Secreto (Reiniciar estado natural)
        secretCard.classList.remove('show');
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
    maxNumHands: 2,           // Soporta dos manos
    modelComplexity: 1,       // Equilibrado entre uso de GPU y presición
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        // Cada fotograma de tu webcam se envía al motor AI
        await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});

// Comenzar la lectura de cámara
camera.start().catch((err) => {
    statusText.innerText = "Error: Por favor permite a tu navegador usar la videocámara para la mágia.";
});
