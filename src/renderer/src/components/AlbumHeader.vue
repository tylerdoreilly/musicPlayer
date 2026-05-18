

<script setup>
  import { ref, computed, toRefs, onMounted } from 'vue'
  import HeaderImage from '@renderer/components/Library/HeaderImage.vue';

 const props = defineProps({
    album:{
      type: Object,
      required: true,
      default: () => ({}),
      docs:{
        validation:'_',
        description:'Section Title'
      }
    },
    artist:{
      type: Object,
      required: true,
      default: () => ({}),
      docs:{
        validation:'_',
        description:'Section Title'
      }
    },
  });

  const { album, artist } = toRefs(props);

  const backgroundColor = ref();

  const trackEntries = computed(() => {
    if (!album.value) return []
    return Object.entries(album.value.tracks || {})
  })

  const trackCount = computed(() => trackEntries.value.length)

  const setBackgroundColor = (color) => {
    backgroundColor.value = color;
  }

  onMounted(() => {
    console.log('selected artist', artist.value)
    console.log('selected album', album.value)
  })

</script>

<template>
    <div class="album-header" :style="{ backgroundColor: backgroundColor }">
      <div class="album-header__details">
        <HeaderImage :images="album.albumImages" @colorSelection="setBackgroundColor"/>
        <div>
          <h2>{{ album.name }}</h2>
            
          <div class="album-meta">
              <span class="album-artist">{{ artist.name }}</span>
              <span>-</span>
              <span>{{ album.year || 'Unknown' }}</span>
              <span>-</span>
              <span>{{ trackCount }} Tracks</span>
          </div>
          <exai-tags :data="album.genres || []" />
            <!-- <p class="album-meta">ID: {{ album.id }}</p>
            <p v-if="album.folderPath" class="album-meta">Folder: {{ album.folderPath }}</p> -->
        </div>
      </div>
     
      <div class="album-header__actions">
       <slot name="albumHeaderActions"></slot>
      </div>
    </div>
</template>

<style lang="scss" scoped>
  .album-header{
    display:flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 1.5rem;
    // margin-bottom: 1rem;
    color:#fff;   
    min-height:180px;
    height:450px;
  }

  .album-header__details{
    gap: 1.5rem;
    color:#fff;
    display:flex;
    flex-direction: row;
    align-items: flex-end;
    min-height:180px;
    height:350px;
    padding: 2rem 2rem 0rem 2rem;
  }

  .album-header__actions{
    display:flex;
    align-items: center;
    justify-content: flex-start;
     padding: 1rem 2rem 1rem 2rem;
     width:100%;
     background:rgba(25, 25, 25, 0.5)
  }

  .album-header h2 {
    margin: 0;
    font-size: 3.75rem;
    color:#fff;
  }

  .album-header .album-meta {
     display:flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    margin:0 0 1rem 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
  }


</style>