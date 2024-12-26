<template>
  <div class="audio-transcriber">
    <button 
      @click="toggleRecording"
      :class="{ 
        'recording': isRecording,
        'processing': isTranscribing
      }"
      :disabled="isTranscribing"
    >
      <i class="fas fa-microphone"></i>
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'AudioTranscriber',
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue', 'transcription-complete'],
  
  data() {
    return {
      mediaRecorder: null,
      isRecording: false,
      isTranscribing: false,
      audioChunks: [],
      currentText: '',
      transcriptionInterval: null,
      pendingChunks: [],
      transcriptionQueue: [],
      isProcessingQueue: false
    }
  },

  computed: {
    buttonText() {
      if (this.isTranscribing) return 'Procesando...'
      if (this.isRecording) return 'Detener'
      return 'Grabar'
    }
  },

  methods: {
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording()
      } else {
        this.startRecording()
      }
    },

    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });
        this.isRecording = true;
        this.currentText = this.modelValue || '';
        this.audioChunks = [];
        
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        // Solo transcribimos cuando se detiene la grabación
        this.mediaRecorder.onstop = () => {
          if (this.audioChunks.length > 0) {
            this.transcribeChunks(this.audioChunks);
          }
        };

        this.mediaRecorder.start();
      } catch (error) {
        console.error('Error al iniciar la grabación:', error);
      }
    },

    async stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    },

    async transcribeChunks(chunks) {
      if (!chunks || chunks.length === 0) return;

      try {
        this.isTranscribing = true;
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');

        const response = await axios.post('/crm/transcribe-audio/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.text) {
          this.currentText += ' ' + response.data.text;
          this.$emit('update:modelValue', this.currentText.trim());
          this.$emit('transcription-complete', this.currentText.trim());
        }
        
      } catch (error) {
        console.error('Error en la transcripción:', error);
      } finally {
        this.isTranscribing = false;
        this.audioChunks = []; // Limpiar chunks después de transcribir
      }
    },

    // Función auxiliar para convertir AudioBuffer a WAV
    audioBufferToWav(buffer) {
      const numOfChan = buffer.numberOfChannels;
      const length = buffer.length * numOfChan * 2;
      const result = new Int16Array(length);
      const channelData = [];
      let offset = 0;

      // Extraer datos de cada canal
      for (let i = 0; i < numOfChan; i++) {
        channelData.push(buffer.getChannelData(i));
      }

      // Entrelazar los canales y convertir a 16-bit
      for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numOfChan; channel++) {
          const audioSample = channelData[channel][i];
          result[offset++] = audioSample < 0 ? audioSample * 0x8000 : audioSample * 0x7FFF;
        }
      }

      // Crear el WAV
      const wav = new ArrayBuffer(44 + result.length * 2);
      const view = new DataView(wav);

      // Escribir el encabezado WAV
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + result.length * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numOfChan, true);
      view.setUint32(24, buffer.sampleRate, true);
      view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true);
      view.setUint16(32, numOfChan * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, result.length * 2, true);

      // Escribir los datos de audio
      const audioData = new Int16Array(wav, 44);
      audioData.set(result);

      return new Blob([wav], { type: 'audio/wav' });
    },

    async processTranscriptionQueue() {
      if (this.isProcessingQueue || this.transcriptionQueue.length === 0) return;
      
      this.isProcessingQueue = true;
      try {
        const chunks = this.transcriptionQueue.shift();
        await this.transcribeChunks(chunks);
        
        // Añadir un pequeño retraso entre transcripciones
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('Error en processTranscriptionQueue:', error);
      } finally {
        this.isProcessingQueue = false;
        if (this.transcriptionQueue.length > 0) {
          this.processTranscriptionQueue();
        }
      }
    }
  },

  beforeUnmount() {
    if (this.transcriptionInterval) {
      clearInterval(this.transcriptionInterval);
    }
    if (this.mediaRecorder && this.isRecording) {
      this.stopRecording();
    }
  }
}
</script>

<style scoped>
.audio-transcriber button {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.audio-transcriber button.recording {
  background: #dc3545;
  animation: pulse 1.5s infinite;
}

.audio-transcriber button.processing {
  background: #ffc107;
  cursor: not-allowed;
}

.audio-transcriber button:disabled {
  opacity: 0.7;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style> 