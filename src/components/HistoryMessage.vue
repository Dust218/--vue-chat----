<template>
    <a-scrollbar style="height:500px;overflow: auto;">
        <main class="section body">
            <div class="timeline">
                <div v-for="(item, index) in $store.state.historyitems" :key="index" class="timeline-item">
                    <div class="timeline-header" v-if="item.header">
                        <span class="timeline-header-text">{{ item.header }}</span>
                    </div>
                    <div class="timeline-content">
                        <div v-for="(contentItem, idx) in item.contents" :key="contentItem.id">
                            <a-popover>
                                <a-button style="border-radius: 20px;" @click="handleClick(contentItem.id)">{{
                                    contentItem.content
                                }}</a-button>
                                <template #content>
                                    {{ contentItem.content }}
                                </template>
                            </a-popover>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </a-scrollbar>
</template>

<script>
export default {
    name: 'LeftSidebar',
    data() {
        return {
        }
    },
    methods: {
        handleClick(content) {
            this.selectedContent = content;
            console.log('Selected Content:', this.selectedContent);
            // console.log(this.$store.state.items)
            this.$store.commit('OneHistory', content);
            // this.$emit('custom-event');
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

            // console.log(JSON.stringify(this.items, null, 2)); // 打印转换后的数据
        }
    },
    mounted() {
        this.$store.dispatch('GetHistory')
            .then(() => {
                console.log(this.$store.state.conversations);
                // this.conversations = this.$store.state.conversations
                this.transformConversations(); // 确保在数据准备好后调用转换方法
            })
            .catch(error => {
                console.error('Error fetching conversations:', error);
            });
    },
}
</script>

<style scoped>
.section {
    padding: 20px;
    color: #F2F3F5;
}

.body {
    background-color: #F2F3F5;
    flex: 10;
    overflow-y: auto;
}


.timeline {
    padding: 16px;
    font-family: Arial, sans-serif;
}

.timeline-item {
    margin-bottom: 16px;
}

.timeline-header {
    margin-bottom: 8px;
    color: #666;
}

.timeline-header-text {
    font-weight: bold;
    font-size: 18px;
}

.timeline-content {
    display: flex;
    flex-direction: column;
}
</style>