import openai

openai.api_key = "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"
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

# Ruta del archivo de audio (usa formato de ruta correcto)
ruta_audio = r"C:\Users\emily\OneDrive\Escritorio\Audios_Whisper\cata_audio.ogg" # Añade extensión correcta

# Llamamos a la función y obtenemos el texto transcrito
texto_transcrito = transcribir_audio(ruta_audio)

# Imprimimos el resultado
print("Transcripción del audio:", texto_transcrito)
