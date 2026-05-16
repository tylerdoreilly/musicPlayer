

<script setup>
  import { computed, toRefs, onMounted } from 'vue';
  import { faCircleMinus, faSearch } from '@fortawesome/free-solid-svg-icons'

  const $emit = defineEmits(["update:modelValue"]);

  const props = defineProps({
    modelValue:{
      type: String,
      docs:{
        validation:'_',
        description:'Input Model Value'
      }
    },
    placeholder:{
      type: String,
      docs:{
        validation:'_',
        description:'Input Placeholder Text'
      }
    },
  });

  const { modelValue, placeholder } = toRefs(props);

  const clearSearch = () => {
    $emit('update:modelValue', '')
  }

  onMounted(() => {
  })

</script>

<template>
    <div class="exai-input">
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
      />
      <font-awesome-icon :icon="faSearch" class="exai-input__search" /> 
      <font-awesome-icon :icon="faCircleMinus" class="exai-input__close" @click="clearSearch" v-if="modelValue"/> 
    </div>
    
</template>

<style lang="scss" scoped>
    .exai-input{
      background: #1F1F1F;
      border:1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.2rem;
      padding:4px 6px 4px 28px;
      position:relative;
      width:250px;

      &__close{
        position:absolute;
        right:6px;
        top:50%;
        transform: translateY(-50%);
        color:#fff;
        cursor:pointer;
      }

      &__search{
        position:absolute;
        left:6px;
        top:50%;
        transform: translateY(-50%);
        color:#fff;
        opacity:0.5;
      }
    }



   .exai-input input {
      all: unset;
      color: #fff; 
      margin-right: 25px;
      width: calc(100% - 25px);
      box-sizing: border-box;
    }

    .exai-input input::placeholder,
    .exai-input input:-ms-input-placeholder,
    .exai-input input::-ms-input-placeholder {
      color: #fff;
      opacity: 0.5;
    }

</style>