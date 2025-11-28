const URL = "https://teachablemachine.withgoogle.com/models/ZKmGtyOhI/"; // Asegúrate de que esta ruta sea correcta
let model, webcam, labelContainer, maxPredictions;

// 1. FUNCIÓN DE INICIO (llama a todo)
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Carga el modelo y los metadatos
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Inicializa la webcam
    const flip = true; // Voltea la cámara para que parezca un espejo
    webcam = new tmImage.Webcam(200, 200, flip); // Tamaño de la cámara
    await webcam.setup(); // Solicita acceso a la cámara
    await webcam.play();
    window.requestAnimationFrame(loop); // Inicia el bucle de detección

    // Añade la cámara al HTML
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
}

// 2. BUCLE DE PREDICCIÓN (se ejecuta constantemente)
async function loop() {
    webcam.update(); // Actualiza el frame
    await predict();
    window.requestAnimationFrame(loop);
}

// 3. FUNCIÓN DE PREDICCIÓN Y RESULTADOS
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let highestProb = 0;
    let resultClass = "No Detectado";
    let resultHTML = "";

    // Encontrar la clase con mayor probabilidad
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        // Mostrar todas las probabilidades (opcional)
        resultHTML += `<div>${classPrediction}</div>`;

        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            resultClass = prediction[i].className;
        }
    }

    // Muestra el resultado principal y las recomendaciones
    labelContainer.innerHTML = `<strong>${resultClass} (${(highestProb * 100).toFixed(0)}%)</strong>`;

    // **AQUÍ VA LA LÓGICA DE RECOMENDACIONES:**
    showRecommendations(resultClass);
}

// 4. FUNCIÓN PARA MOSTRAR RECOMENDACIONES (necesitas escribir el contenido)
function showRecommendations(faceType) {
    const recContainer = document.getElementById("recommendations-container");
    let advice = "";

    switch(faceType) {
        case 'Rostro Ovalado':
            advice = "El rostro ovalado es el ideal. **Peinado:** Casi cualquier corte o peinado te queda bien. **Maquillaje:** Enfócate en destacar tus ojos o labios, con un contorno suave.";
            break;
        case 'Rostro Redondo':
            advice = "Busca alargar tu rostro. **Peinado:** Capas largas o volumen en la coronilla. Evita flequillos rectos. **Maquillaje:** Contorno en los laterales del rostro (oreja hacia boca) para crear profundidad.";
            break;
        // ... (Añade todos los 6 tipos de rostro aquí)
        default:
            advice = "Acerque su rostro a la cámara para una mejor detección.";
    }
    recContainer.innerHTML = advice;

}
