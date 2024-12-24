<template>
  <div class="right-container">
    <!-- 头部 -->
    <header class="section header">
      <a-dropdown>
        <a-button type="text">
          <p style="color: black;font-size: 24px;font-family: Arial, sans-serif;margin-left: 12px;">{{ model_kind }}</p>
        </a-button>
        <template #content>
          <a-doption @click="ModelChange1">
            <template #icon>
              <icon-bookmark />
            </template>
            <template #default>古诗生成</template>
          </a-doption>
          <a-doption @click="ModelChange2">
            <template #icon>
              <icon-sun-fill />
            </template>
            <template #default>情感分析</template>
          </a-doption>
        </template>
      </a-dropdown>
    </header>
    <!-- 主体 -->
    <ChatModuleBody />
    <!-- 底部 -->
    <ChatModule />
  </div>
</template>

<script>
// 导入 ChatModule 和 ChatModuleBody 组件
import ChatModule from './ChatModuleFooter.vue';
import ChatModuleBody from './ChatModuleBody.vue';

export default {
  name: 'RightSection',
  components: {
    ChatModule,
    ChatModuleBody
  },
  data() {
    return {
      model_kind :'古诗生成',
    };
  },
  methods: {
    ModelChange1(){
      this.$store.state.model = 1,
      this.model_kind = '古诗生成'
      this.$store.dispatch('change_model')

    },
    ModelChange2(){
      this.$store.state.model = 2,
      this.model_kind = '情感分析'
      this.$store.dispatch('change_model')
    }
  }
};
</script>

<style scoped>
.right-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  /* 确保占满父容器高度 */
}

.section {
  padding: 20px;
  color: white;
}

.header {
  background-color: white;
  height: 32px;
}
</style>