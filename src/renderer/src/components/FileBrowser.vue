<script setup>
import { computed } from 'vue'

const props = defineProps({
  audioFiles: {
    type: Array,
    default: () => []
  },
  selectedPath: {
    type: String,
    default: ''
  },
  folderPath: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['fileSelected'])

const hasFiles = computed(() => props.audioFiles.length > 0)
const selectedIndex = computed(() => props.audioFiles.findIndex((file) => file.path === props.selectedPath))

function selectFile(file) {
  emit('fileSelected', file)
}
</script>

<template>
  <div class="file-browser">
    <div class="browser-header">
      <div>
        <h2>Folder files</h2>
        <p v-if="folderPath" class="folder-path">{{ folderPath }}</p>
      </div>
      <span class="file-count" v-if="hasFiles">{{ audioFiles.length }} files</span>
    </div>

    <div class="browser-body">
      <p v-if="!folderPath" class="info-text">Select a folder to view audio files here.</p>
      <p v-else-if="!hasFiles" class="info-text">No audio files found in this folder.</p>
      <ul v-else class="file-list">
        <li
          v-for="(file, index) in audioFiles"
          :key="file.path"
          :class="{ selected: file.path === selectedPath }"
        >
          <button class="file-button" type="button" @click="selectFile(file)">
            <span class="file-name">{{ file.displayName }}</span>
            <span class="file-ext">{{ file.name.slice(file.displayName.length) }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.file-browser {
  background: #121827;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  color: white;
  margin: 16px 24px;
  padding: 16px;
}

.browser-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
}

.browser-header h2 {
  margin: 0;
  font-size: 16px;
}

.folder-path {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin: 4px 0 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.browser-body {
  min-height: 80px;
}

.info-text {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
}

.file-list li {
  border-radius: 12px;
  overflow: hidden;
}

.file-list li.selected {
  background: rgba(255, 255, 255, 0.08);
}

.file-button {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: inherit;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.file-button:hover {
  background: rgba(255, 255, 255, 0.06);
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12px;
}

.file-ext {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  flex-shrink: 0;
}
</style>
