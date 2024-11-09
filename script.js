let mediaRecorder;
let audioChunks = [];

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = []; // Limpiar el buffer
            
            // Llamar a la función para transcribir el audio
            const transcription = await transcribeAudio(audioBlob);
            
            // Mostrar la transcripción en la ventana de chat
            addMessageToChat('user', transcription);
        };
        
        mediaRecorder.start();
        console.log('Grabando...');
        
        // Detener la grabación después de 5 segundos
        setTimeout(() => {
            mediaRecorder.stop();
            console.log('Grabación detenida');
        }, 5000);
        
    } catch (error) {
        console.error('Error al acceder al micrófono:', error);
        alert('No se pudo acceder al micrófono. Verifique los permisos.');
    }
}

async function transcribeAudio(audioBlob) {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');
        formData.append('model', 'whisper-1');
        
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

function addMessageToChat(sender, message) {
    const chatWindow = document.getElementById('chatWindow');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Desplazar hacia abajo
}