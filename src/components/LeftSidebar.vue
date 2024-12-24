<template>
  <div class="left-container">
    <!-- 头部 -->
    <header class="section header">
      <a-button type="primary" shape="round" @click="newChat">
        <template #icon>
          <icon-plus />
        </template>
        <template #default>新建聊天</template>
      </a-button>
    </header>
    <!-- 主体 -->
    <HistoryMessage @custom-event="transformConversations" />
    <!-- 底部 -->
    <footer class="section footer">
      <a-button type="primary" shape="round" @click="chatout">
        <template #icon>
          <icon-export />
        </template>
        <template #default>退出聊天</template>
      </a-button>
    </footer>
  </div>
</template>

<script>
import HistoryMessage from './HistoryMessage.vue';
import axios from 'axios';
export default {
  name: 'LeftSidebar',
  components: {
    HistoryMessage
  },
  methods: {
    chatout() {
      this.$store.commit('QuitChat')
      this.$store.dispatch('GetHistory')
        .then(() => {
          this.transformConversations();
          this.$notification.success('保存成功')
        })
        .catch(error => {
          console.error('Error fetching conversations:', error);
        });

    },
    newChat() {
      if (this.$store.state.id !== 0 && this.$store.state.items.length === 0) {
        console.log("重复创建会话")  
        console.log(this.$store.state.id,this.$store.state.items.length)
        this.$message.warning({
          content: '会话已创建，请勿重复创建！',
          closable: true
        })
      } else {
        console.log("创建新会话")
        console.log(this.$store.state.id,this.$store.state.items.length)
        this.$message.success({
          content: '会话创建成功',
          closable: true
        })
        this.chatout()
        this.$store.commit('CreateNewChat')
      }

    },
    transformConversations() {
      const grouped = {};

      // 首先根据时间对会话进行排序，从最近到最远
      this.$store.state.conversations.sort((a, b) => new Date(b.time) - new Date(a.time));

      this.$store.state.conversations.forEach(conversation => {
        const date = new Date(conversation.time);
        const today = new Date();
        const oneWeekAgo = new Date(new Date().setDate(today.getDate() - 7));
        const oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));

        let header;
        if (date.toDateString() === today.toDateString()) {
          header = '当天';
        } else if (date >= oneWeekAgo) {
          header = '前 7 天';
        } else if (date >= oneMonthAgo) {
          header = '前 30 天';
        } else {
          header = date.toLocaleString('default', { month: 'long' });
        }

        addToGroup(header, conversation);

        function addToGroup(header, item) {
          if (!grouped[header]) {
            grouped[header] = [];
          }
          grouped[header].push({
            content: item.content,
            id: item.id // 使用原始ID
          });
        }
      });
      // 将分组后的对象转换为数组
      this.$store.state.historyitems = Object.keys(grouped).map(header => ({
        header,
        contents: grouped[header]
      }));
      console.log(JSON.stringify(this.$store.state.historyitems, null, 2)); // 打印转换后的数据
    }
  }
};
</script>





<style scoped>
.left-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F2F3F5;
}

.section {
  padding: 20px;
  color: #F2F3F5;
}

.header {
  background-color: #F2F3F5;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  background-color: #F2F3F5;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exit-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}
</style>