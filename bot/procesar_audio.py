import openai
import sys  # Para recibir argumentos desde el bot de Automation Anywhere

# Establecer la API key de OpenAI
openai.api_key = "API_KEY"

# Función para transcribir el audio usando Whisper
def transcribir_audio(audio_path):
    try:
        # Abrir el archivo de audio y enviarlo a OpenAI Whisper
        with open(audio_path, 'rb') as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
        # Retornar la transcripción
        return transcript['text']
    except Exception as e:
        return f"Error al transcribir el audio: {e}"

# Recibir la ruta del audio como argumento desde Automation Anywhere
if __name__ == "__main__":
    if len(sys.argv) > 1:
        ruta_audio = sys.argv[1]  # Primer argumento es la ruta del audio
        texto_transcrito = transcribir_audio(ruta_audio)
        print(texto_transcrito)  # Imprimir la transcripción para que Automation Anywhere la capture
    else:
        print("Error: no se ha proporcionado ninguna ruta de archivo de audio.")
