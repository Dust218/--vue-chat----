<template>
    <footer class="section footer">

    <div style="display: flex; width: 80%; flex-wrap: nowrap;">
      <div style="width: 80%;">
        <a-textarea v-model="inputValue" placeholder="Please enter something" :auto-size="{minRows:2,maxRows:5}" style="margin-top: 20px;border-radius: 24px;"/>
      </div>
    <div style="margin-top: 24px;margin-left:60px;background-color: rgb(var(--primary-6));border-radius:80%;height: 45px;width: 45px;">
      <div style="margin-top: 7px;margin-left:7px;">
        <icon-send :style="{fontSize:'32px'}" @click="handleClick"/>
      </div>
    </div>
</div>
    </footer>
    <p style="font-size: 8px;text-align: center;color:gainsboro;">服务生成的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，不代表我们的态度或观点</p>
  </template>
  
  <script>
  export default {
    name: 'ChatModule',
    data() {
      return {
        inputValue: '', // 绑定到输入框的值
      };
    },
    methods: {
      handleClick() {
        const prompt = this.inputValue;
        console.log('Textarea prompt:', prompt);
        this.$store.commit('chatsend', prompt)
        this.inputValue = '';
      }
    }
  };     



  </script>
  
  <style scoped>
  .section {
    padding: 20px;
    color: white;
  }
  
  .footer {
    background-color: white;
    display: flex;
    align-items: center; 
    justify-content: center; 
    height: 64px;
  }
  
  </style>