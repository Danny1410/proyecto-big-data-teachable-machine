# proyecto-big-data-teachable-machine
Proyecto de clasificación de imágenes usando Teachable Machine

🌸 Identificador y Recomendador de Rostros con Inteligencia Artificial

🌟 Resumen del Proyecto

Este proyecto es una aplicación web interactiva desarrollada para el curso de [!!! REEMPLAZAR: Nombre de tu Curso/Materia, ej: Big Data y Modelado Estadístico !!!]. Utiliza un modelo de Machine Learning entrenado con Teachable Machine (TensorFlow.js) para clasificar el tipo de rostro de una persona en tiempo real a través de la webcam.

Una vez identificado, el sistema proporciona recomendaciones personalizadas de belleza (peinado y maquillaje) para armonizar y potenciar los rasgos específicos del usuario, cumpliendo con la fase de aplicación de datos (Big Data).

🌐 Demo en Vivo

Puedes acceder y probar la aplicación directamente aquí:
https://teachablemachine.withgoogle.com/models/ZKmGtyOhI/

💻 Instalación y Ejecución Local

Para ejecutar el proyecto en tu máquina local (sin necesidad de desplegarlo en GitHub Pages), sigue estos pasos:

1. Clonar el Repositorio

Abre la terminal de comandos y clona el proyecto:

git clone https://teachablemachine.withgoogle.com/models/ZKmGtyOhI/
cd proyecto-big-data-teachable-machine

2. Ejecutar con Servidor Local (Recomendado)

Debido a las restricciones de seguridad de los navegadores (CORS), la cámara web y la carga del modelo pueden fallar si simplemente abres el archivo index.html con doble clic. Es necesario usar un servidor local:

Opción A: Extensión "Live Server" (VS Code)

Si usas Visual Studio Code, instala la extensión "Live Server".

Haz clic derecho sobre index.html y selecciona Open with Live Server.

Opción B: Servidor HTTP de Python

Asegúrate de tener Python instalado.

Ejecuta este comando en la carpeta raíz del proyecto:

python3 -m http.server


Abre tu navegador y navega a http://localhost:8000.

📄 Documentación del Código (script.js)

El archivo script.js maneja la lógica central, la comunicación con el modelo y la presentación de los resultados.

init()

Inicialización Central. Carga el modelo (model.json y metadata.json) de Teachable Machine. Solicita y configura la webcam (webcam.setup()). Incluye manejo de errores (try/catch) para notificar al usuario si la cámara no puede iniciarse.

loop()

Bucle de Predicción. Es la función recursiva que llama constantemente a webcam.update() para capturar un nuevo frame y a predict() para analizar ese frame.

predict()

Inferencia del Modelo. Ejecuta el modelo (model.predict()) sobre el canvas de la webcam. Identifica la clase con la probabilidad más alta (highestProb) y actualiza el contenedor de la etiqueta (labelContainer). Finalmente, llama a la función de recomendaciones.

showRecommendations(faceType)

Aplicación de Datos. Esta función contiene la lógica de negocio. Utiliza una estructura switch para comparar el faceType detectado (ej: 'Rostro Ovalado') con los tipos entrenados e inyecta las recomendaciones detalladas de peinado y maquillaje en el contenedor HTML (recommendations-container).

🧠 Modelo de IA (Fuente de Datos)

El modelo de clasificación fue exportado desde la siguiente URL de Teachable Machine:
https://teachablemachine.withgoogle.com/models/ZKmGtyOhI/
