// URL del modelo de Teachable Machine (la que nos proporcionaste)
const URL = "https://teachablemachine.withgoogle.com/models/ZKmGtyOhI/"; 
let model, webcam, labelContainer, maxPredictions;

// 1. FUNCIÓN DE INICIO (llama a todo)
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Ocultar el botón para evitar doble clic o reinicio
    document.querySelector('button').disabled = true;
    document.querySelector('button').textContent = 'Cargando Modelo...';

    try {
        // Carga el modelo y los metadatos desde Teachable Machine
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        // Configuración e inicialización de la webcam
        const flip = true; // Voltea la cámara para que parezca un espejo
        // Usamos las dimensiones de 200x200 especificadas en el CSS
        webcam = new tmImage.Webcam(200, 200, flip); 
        
        // Intentar configurar la cámara y solicitar permisos
        await webcam.setup(); 
        
        // Una vez que la cámara está lista, reproducir y empezar el bucle
        await webcam.play();
        window.requestAnimationFrame(loop); 

        // Añade la cámara (canvas) al contenedor HTML
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");

        // Actualizar el estado del botón
        document.querySelector('button').textContent = 'Análisis en Curso...';

    } catch (e) {
        // Manejo de errores de la cámara o carga del modelo
        const errorMsg = `ERROR: No se pudo iniciar la cámara o cargar el modelo.
        Asegúrate de:
        1. Tener el permiso de la cámara activado.
        2. Estar usando el protocolo HTTPS (GitHub Pages lo hace automáticamente).
        Mensaje de Error: ${e.message}`;
        
        document.getElementById("label-container").innerHTML = `<strong style="color: red;">${errorMsg}</strong>`;
        document.querySelector('button').textContent = 'Reintentar Análisis';
        document.querySelector('button').disabled = false;
        console.error(e);
        
        // Si la webcam se inició parcialmente, detenerla para liberar recursos
        if (webcam) {
             webcam.stop();
        }
    }
}

// 2. BUCLE DE PREDICCIÓN (se ejecuta constantemente)
async function loop() {
    webcam.update(); // Actualiza el frame
    await predict();
    window.requestAnimationFrame(loop);
}

// 3. FUNCIÓN DE PREDICCIÓN Y RESULTADOS
async function predict() {
    // Si el modelo no está cargado, salir de la función
    if (!model) return; 
    
    const prediction = await model.predict(webcam.canvas);
    let highestProb = 0;
    let resultClass = "No Detectado";
    
    // Encontrar la clase con mayor probabilidad
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            resultClass = prediction[i].className;
        }
    }

    // Muestra el resultado principal (ej: Rostro Diamante (85%))
    labelContainer.innerHTML = `<strong>${resultClass} (${(highestProb * 100).toFixed(0)}%)</strong>`;
    
    // Llama a la función de recomendaciones con el tipo de rostro más probable
    showRecommendations(resultClass);
}


// 4. FUNCIÓN PARA MOSTRAR RECOMENDACIONES (Contenido Detallado)
function showRecommendations(faceType) {
    const recContainer = document.getElementById("recommendations-container");
    let advice = "";
    
    // Normalizar el nombre de la clase para asegurar la coincidencia exacta
    const normalizedFaceType = faceType.trim(); 
    
    // Usamos HTML para un formato limpio
    switch(normalizedFaceType) {
        case 'Rostro Corazón':
            advice = `
                <p>Tu rostro es tipo **Corazón** o triángulo invertido. Se caracteriza por una frente ancha y una barbilla estrecha.</p>
                <p><strong>✨ Peinado:</strong> Busca suavizar la frente y dar volumen en la parte inferior. Flequillos de lado (cortina), cortes a la altura de la clavícula (Lob), y capas que empiecen debajo de la mandíbula.</p>
                <p><strong>💄 Maquillaje:</strong> Contorno suave en las sienes para reducir la anchura. Iluminador o rubor en la barbilla y la parte inferior de las mejillas para balancear la forma.</p>
            `;
            break;
        case 'Rostro Cuadrado':
            advice = `
                <p>Tu rostro es **Cuadrado**. Se caracteriza por una frente ancha y una línea de mandíbula fuerte y angular.</p>
                <p><strong>✨ Peinado:</strong> Busca alargar y suavizar los ángulos. Ondas suaves o rizos, cortes largos con capas que caigan por debajo de la mandíbula, y peinados con volumen en la coronilla.</p>
                <p><strong>💄 Maquillaje:</strong> Contorno en las esquinas de la frente y en los ángulos de la mandíbula para suavizar las líneas. Utiliza rubor ligeramente más arriba de los pómulos para alargar.</p>
            `;
            break;
        case 'Rostro Diamante':
            advice = `
                <p>Tu rostro es **Diamante**. Se caracteriza por pómulos anchos y prominentes, con frente y mandíbula estrechas.</p>
                <p><strong>✨ Peinado:</strong> Busca dar volumen a la frente y mandíbula para equilibrar los pómulos. Flequillos largos y ligeros, o cortes Bob que acaben justo a la altura de la mandíbula.</p>
                <p><strong>💄 Maquillaje:</strong> Contorno suave debajo de los pómulos para definirlos sin exagerar. Iluminador en el centro de la frente y barbilla para ensanchar ligeramente esas áreas.</p>
            `;
            break;
        case 'Rostro Ovalado':
            advice = `
                <p>Tu rostro es **Ovalado**. Considerado la forma ideal, es proporcional y suavemente redondeado.</p>
                <p><strong>✨ Peinado:</strong> ¡Casi cualquier corte o estilo te queda bien! Es la forma más versátil para experimentar. Evita flequillos muy pesados que cubran toda la frente.</p>
                <p><strong>💄 Maquillaje:</strong> Enfócate en destacar tus mejores rasgos (ojos o labios). El contorno debe ser mínimo, solo para añadir definición sutil si lo deseas.</p>
            `;
            break;
        case 'Rostro Redondo':
            advice = `
                <p>Tu rostro es **Redondo**. Se caracteriza por ser casi tan largo como ancho, sin ángulos prominentes.</p>
                <p><strong>✨ Peinado:</strong> Busca alargar el rostro. Cortes rectos y largos (más allá de la barbilla), o volumen en la coronilla. Flequillos de lado para crear una línea diagonal.</p>
                <p><strong>💄 Maquillaje:</strong> Contorno a los lados del rostro (desde las orejas hacia la boca) para crear profundidad y alargar la forma. Evita el rubor muy redondeado.</p>
            `;
            break;
        case 'Rostro Triangular':
            advice = `
                <p>Tu rostro es **Triangular** (o Pera). Se caracteriza por una mandíbula ancha y una frente estrecha.</p>
                <p><strong>✨ Peinado:</strong> Busca dar volumen en la parte superior del rostro. Cortes Bob o Lob a la altura del cuello, y capas que creen anchura a la altura de las sienes y los pómulos.</p>
                <p><strong>💄 Maquillaje:</strong> Iluminador en la frente para ensancharla visualmente. Contorno en la línea de la mandíbula para suavizar y reducir el ancho.</p>
            `;
            break;
        default:
            // Este es el mensaje genérico que sale si la probabilidad es baja o si el nombre no coincide.
            advice = `
                <p><strong>Ajuste no detectado:</strong> Acerque su rostro a la cámara y asegúrese de que esté bien iluminado. Si el problema persiste, verifique los permisos de la cámara en su navegador.</p>
            `;
    }
    recContainer.innerHTML = advice;
}
