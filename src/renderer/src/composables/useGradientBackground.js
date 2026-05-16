import { watch, onMounted, onUnmounted, toValue } from 'vue';

export function useGradientBackground(gradientRef, defaultGradient = 'linear-gradient(to right, #4facfe, #00f2fe)') {
  
  const updateBackground = (newGradient) => {
    document.body.style.backgroundImage = newGradient || defaultGradient;
    document.body.style.minHeight = '100vh'; // Ensure body covers viewport
    document.body.style.margin = '0';
  };

  // Watch for changes in the reactive ref
  watch(
    () => toValue(gradientRef),
    (newVal) => {
      updateBackground(newVal);
    },
    { immediate: true } // Apply immediately on setup
  );

  onUnmounted(() => {
    // Optional: Reset background when component unmounts
    document.body.style.backgroundImage = '';
  });
}