// Paso 1: Configurar la función de grabación de audio en el navegador
let mediaRecorder;
let audioChunks = [];

async function startRecording() {
    try {
        // Solicitar permiso para usar el micrófono
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Crear un MediaRecorder con el flujo de audio
        mediaRecorder = new MediaRecorder(stream);
        
        // Manejar la grabación de datos
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        // Cuando se detiene la grabación
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = []; // Limpiar el buffer
            
            // Llamar a Whisper API para transcribir el audio
            const transcription = await transcribeAudio(audioBlob);
            
            // Mostrar la transcripción en la página
            document.getElementById('botResponse').innerText = transcription;
        };
        
        // Iniciar la grabación
        mediaRecorder.start();
        console.log('Grabando...');
        
        // Detener la grabación después de 5 segundos por ejemplo
        setTimeout(() => {
            mediaRecorder.stop();
            console.log('Grabación detenida');
        }, 5000); // Puedes cambiar la duración si lo necesitas

    } catch (error) {
        console.error('Error al acceder al micrófono:', error);
        alert('No se pudo acceder al micrófono. Verifique los permisos.');
    }
}

// Paso 2: Crear la función para enviar el audio a Whisper de OpenAI
async function transcribeAudio(audioBlob) {
    try {
        // Crear un FormData para enviar el archivo de audio
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');
        formData.append('model', 'whisper-1'); // Cambiar al modelo adecuado de OpenAI si es necesario

        // Enviar una solicitud a tu backend o directamente a la API de OpenAI
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `API_KEY`, // Reemplaza con tu clave de API de OpenAI
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error en la transcripción de audio');
        }

        const result = await response.json();
        return result.text;
    } catch (error) {
        console.error('Error al transcribir audio:', error);
        return 'Hubo un error al transcribir el audio.';
    }
}
