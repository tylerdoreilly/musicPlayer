<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useGradientBackground } from './composables/useGradientBackground';

useGradientBackground();
const selectedFolder = ref('')
const audioFiles = ref([])
const selectedFilePath = ref('')

const ipcRenderer = window.electron.ipcRenderer

async function loadAudioFiles(folderPath) {
  try {
    const files = await ipcRenderer.invoke('get-audio-files', folderPath)
    console.log('Loaded audio files:', files)
    audioFiles.value = files.map((file) => ({
      name: file.name,
      path: file.path,
      url: file.url,
      displayName: file.name.replace(/\.[^.]+$/, '')
    }))

    if (audioFiles.value.length > 0) {
      selectedFilePath.value = audioFiles.value[0].path
    } else {
      selectedFilePath.value = ''
    }
  } catch (error) {
    console.error('Error loading audio files:', error)
    audioFiles.value = []
    selectedFilePath.value = ''
  }
}

async function onFolderSelected(folderPath) {
  selectedFolder.value = folderPath
  await loadAudioFiles(folderPath)
}

</script>

<style scoped>
.main-content {
  display: flex;
  flex: 1;
   background: #181818
}

.content {
  flex: 1;
  padding-bottom: 120px;
}
</style>

<template>
  <div class="app-container">
    <app-titlebar />
    <RouterView /> 
    <audio-player :audioFiles="audioFiles" :selectedPath="selectedFilePath" />
  </div>
</template>

