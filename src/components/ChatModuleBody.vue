<template>
  <a-scrollbar style="height:500px;overflow: auto;">
    <main class="section body">
      <ChatMessage />
    </main>
  </a-scrollbar>
</template>

<script>
import ChatMessage from './ChatMessage.vue'

export default {
  name: 'ChatModuleBody',
  components: {
    ChatMessage
  },
  
};
</script>

<style scoped>
.section {
  margin-left: 10%;
  margin-right: 18%;

}

.body {
  background-color: white;
  height: auto;
  /* 让主体部分比头部和底部大 */
}
</style>