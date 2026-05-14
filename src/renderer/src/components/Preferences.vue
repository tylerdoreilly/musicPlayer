<script setup>
import { ref, onMounted } from 'vue'

const musicPath = ref('')
const isAnalyzing = ref(false)

defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const selectMusicPath = async () => {
  try {
    const result = await window.electron.ipcRenderer.invoke('select-audio-folder')
    if (result.canceled || !result.filePath) return
    musicPath.value = result.filePath
  } catch (error) {
    console.error('Error selecting music path:', error)
  }
}

const savePreferences = () => {
  localStorage.setItem('musicPath', musicPath.value)
  emit('close')
}

const analyzeMusic = async () => {
  if (!musicPath.value) return
  isAnalyzing.value = true
  try {
    const result = await window.electron.ipcRenderer.invoke('analyze-music-library', musicPath.value)
    localStorage.setItem('musicLibrary', JSON.stringify(result))
    console.log('Music library analysis result:', result)
    alert('Music library analysis complete! ' + Object.keys(result.artists).length + ' artists found.')
  } catch (error) {
    console.error('Error analyzing music library:', error)
    alert('Error analyzing music library: ' + error.message)
  } finally {
    isAnalyzing.value = false
  }
}

onMounted(() => {
  const savedPath = localStorage.getItem('musicPath')
  if (savedPath) {
    musicPath.value = savedPath
  }
})
</script>

<template>
 

      <h2 class="modal-title">Preferences</h2>

      <div class="content">
        <label class="label">
          Music Files Path:
          <div class="input-group">
            <input
              v-model="musicPath"
              type="text"
              class="input"
              placeholder="Enter or select path to music files"
              readonly
            />
            <button @click="selectMusicPath" class="browse-button">
              Browse...
            </button>
          </div>
        </label>
      </div>

      <div v-if="!isAnalyzing" class="analysis-section">
        <h3 class="section-title">Analyze Library</h3>
        <p class="section-description">Organize your music by scanning all folders and extracting metadata.</p>
        <button 
          @click="analyzeMusic" 
          class="analyze-button"
          :disabled="!musicPath"
        >
          <i class="fas fa-magnifying-glass"></i>
          Analyze Music Library
        </button>
        <p v-if="!musicPath" class="warning">
          <i class="fas fa-exclamation-circle"></i>
          Please set a music path first
        </p>
      </div>

      <div v-else class="loader-container">
        <div class="spinner"></div>
        <p class="loader-title">Analyzing your music library...</p>
        <p class="loader-text">This may take a few moments</p>
      </div>

      <div class="modal-buttons">
        <button @click="$emit('close')" class="cancel-button">
          Cancel
        </button>
        <button @click="savePreferences" class="save-button" :disabled="isAnalyzing">
          Save
        </button>
        <button 
          @click="analyzeMusic" 
          class="analyze-button"
          :disabled="!musicPath"
        >
          <i class="fas fa-magnifying-glass"></i>
          Analyze Music Library
        </button>   
      </div>


</template>

<style scoped>
.preferences-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.preferences-modal {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 32rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.content {
  margin-bottom: 2rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-top: 0.25rem;
}

.browse-button {
  padding: 0.75rem 1rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 0.25rem;
  font-weight: 500;
}

.browse-button:hover {
  background-color: #4b5563;
}

.analysis-section {
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
}

.section-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1rem;
}

.section-description {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.analyze-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.analyze-button:hover:not(:disabled) {
  opacity: 0.9;
}

.analyze-button:disabled {
  background: linear-gradient(135deg, #ccc 0%, #bbb 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

.analyze-button i {
  margin-right: 0.5rem;
}

.warning {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
  margin-bottom: 0;
}

.warning i {
  margin-right: 0.5rem;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: 150px;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-title {
  text-align: center;
  color: #333;
  font-weight: 500;
  margin: 0.5rem 0;
}

.loader-text {
  text-align: center;
  color: #999;
  font-size: 0.875rem;
  margin: 0;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.cancel-button {
  padding: 0.5rem 1.5rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.save-button {
  padding: 0.5rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.save-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.save-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>


<style scoped>
.preferences {
  padding: 1rem;
}
</style>