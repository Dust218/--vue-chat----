<template>
  <div class="container">
    <!-- 左边盒子 -->
    <div :style="{ display: leftBoxDisplay }">
      <LeftSidebar />
    </div>
    <div style="width: 1px;">
      <div style="position: fixed; top: 50%; z-index: 1000;">
        <icon-left @click="ClickHandle" :style="{ fontSize: '24px', display: lefticonDisplay }" />
        <icon-right @click="ClickHandle" :style="{ fontSize: '24px', display: righticonDisplay }" />
      </div>
    </div>
    <!-- 右边盒子 -->
    <RightSection />

  </div>
</template>

<script>
// 导入右边部分组件
import RightSection from './components/RightSection.vue';
import LeftSidebar from './components/LeftSidebar.vue';
export default {
  name: 'TwoBoxesComponent',
  data() {
    return {
      leftBoxDisplay: 'block',
      lefticonDisplay: 'block',
      righticonDisplay: 'none',
    }
  },
  components: {
    LeftSidebar,
    RightSection
  },
  methods: {
    ClickHandle() {
      console.log(1)
      this.leftBoxDisplay = this.leftBoxDisplay === 'block' ? 'none' : 'block';
      this.righticonDisplay = this.righticonDisplay === 'block' ? 'none' : 'block';
      this.lefticonDisplay = this.lefticonDisplay === 'block' ? 'none' : 'block';
    }
  }

};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  /* 让容器占满整个视口高度 */
}

/* 根据需要调整左右两侧的比例 */  
.left-container {
  width: 250px;
  flex: 20;
}

.right-container {
  flex: 80;
}
</style>