import { createStore } from "vuex"
import axios from 'axios';

export default createStore({
    state: {
        id: 0,
        items: [],
        historyitems: [],
        conversations: [],
        reply: '',
        model: 1,
        emotion_data: {
            user: '',
            chat: [
                { tabel: [] },
                { counter: [{ positive: 0 }, { normal: 0 }, { passive: 0 }] },
                { message: {} }
            ]
        },
    },
    mutations: {
        CreateNewChat(state) {
            state.items = []
            if (state.model === 1) {
                const url = `/fastapi/fastapi_chat/0?prompt=none`;
                axios.get(url).then(res => {
                    state.id = res.data.id
                })
            } else if (state.model == 2) {
                const url = `/fastapi/emotion`;
                const poemData = {
                    "id": 0,
                    "prompt": ""
                };

                axios.post(url, poemData)
                    .then(response => {
                        state.id = response.data.id
                        console.log(state.id)
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }

        },
        chatsend(state, prompt) {
            if (state.model === 1) {
                if (state.id === 0) {
                    const url = `/fastapi/fastapi_chat/0?prompt=none`;
                    axios.get(url).then(res => {
                        state.id = res.data.id
                        const url = `/fastapi/fastapi_chat/${state.id}?prompt=${prompt}`;
                        axios.get(url).then(res => {
                            state.reply = res.data.reply
                            console.log(state.reply)
                            const newRecord = {
                                user: prompt,
                                chat: state.reply
                            };

                            // 将新记录添加到列表中
                            state.items.push(newRecord);
                            console.log(state.items)
                        })
                    })
                } else {
                    const url = `/fastapi/fastapi_chat/${state.id}?prompt=${prompt}`;
                    axios.get(url).then(res => {
                        state.reply = res.data.reply
                        console.log(state.reply)
                        const newRecord = {
                            user: prompt,
                            chat: state.reply
                        };

                        // 将新记录添加到列表中
                        state.items.push(newRecord);
                        console.log(state.items)
                    })
                }
            } else if (state.model === 2) {
                if (state.id === 0) {
                    const url = `/fastapi/emotion`;
                    const poemData = {
                        "id": 0,
                        "prompt": ""
                    };
                    axios.post(url, poemData)
                        .then(response => {
                            state.id = response.data.id
                            console.log(state.id)
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                } else {
                    const url = `/fastapi/emotion`;
                    const emotion_send = {
                        "id": state.id,
                        "prompt": prompt
                    };

                    axios.post(url, emotion_send)
                        .then(response => {
                            const newRecord = {
                                user: prompt,
                                chat: response.data.reply
                            };
                            // 将新记录添加到列表中
                            // console.log(state.items)
                            // console.log(response.data.reply)
                            state.emotion_data = transformData(newRecord);
                            state.items.push(state.emotion_data);
                            // console.log(state.emotion_data);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            }
        },
        QuitChat(state) {
            if (state.model === 1) {
                const url = `/fastapi/fastapi_chat/update/${state.id}`;
                axios.get(url)
            } else if (state.model == 2) {
                const url = `/fastapi/emotion_history/update/${state.id}`;
                axios.get(url)
            }
            state.id = 0
            state.items = []
        },
        SET_CONVERSATIONS(state, conversations) {
            state.conversations = conversations;
        },
        SET_TRANSFORMED_CHAT_DATA(state, payload) {
            state.emotion_data = payload;
        },
        OneHistory(state, id) {
            state.id = id
            state.items = []
            if (state.model === 1) {
                const url = `/fastapi/fastapi_chat/history/${state.id}`;
                axios.get(url).then(res => {
                    state.items = res.data.contents
                    console.log(state.items)
                })
            } else if (state.model == 2) {
                const url = `/fastapi/emotion/history/${state.id}`;
                axios.get(url).then(res => {
                    const dataList = res.data.contents;
                    console.log(dataList)
                    const validJsonStr = makeValidJson(dataList);
                    const arr = JSON.parse(validJsonStr);
                    console.log(arr); // 输出解析后的数组
                    const transformedResults = [];
                    for (const item of arr) {
                        transformedResults.push(transformData(item));
                    }
                    console.log(transformedResults)
                    state.items = transformedResults
                    console.log(state.items)
                })
            }
        }
    },
    actions: {
        async GetHistory({ commit }) {
            if (this.state.model === 1) {
                const url = `/fastapi/fastapi_chat/history`;
                try {
                    const response = await axios.get(url);
                    console.log("发送申请");
                    console.log(response.data); // 打印获取到的数据
                    commit('SET_CONVERSATIONS', response.data.conversations); // 更新状态
                } catch (error) {
                    console.error('Failed to fetch conversations:', error);
                    throw error; // 重新抛出错误以便在组件中捕获
                }
            } else if (this.state.model == 2) {
                const url = `/fastapi/emotion_history/message`;
                try {
                    const response = await axios.get(url);
                    console.log("发送申请");
                    console.log(response.data); // 打印获取到的数据
                    commit('SET_CONVERSATIONS', response.data.conversations); // 更新状态
                } catch (error) {
                    console.error('Failed to fetch conversations:', error);
                    throw error; // 重新抛出错误以便在组件中捕获
                }
            }
        },
        change_model() {
            this.state.id = 0,
            this.state.items = [],
            this.state.historyitems = [],
            this.state.conversations = [],
        
            this.dispatch('GetHistory')
            .then(() => {
                console.log(this.state.conversations);
                this.dispatch('transformConversations') // 确保在数据准备好后调用转换方法
            })
            .catch(error => {
                console.error('Error fetching conversations:', error);
            });
        },
        transformConversations() {
            const grouped = {};
        
            // 首先根据时间对会话进行排序，从最近到最远
            this.state.conversations.sort((a, b) => new Date(b.time) - new Date(a.time));
        
            this.state.conversations.forEach(conversation => {
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
            this.state.historyitems = Object.keys(grouped).map(header => ({
                header,
                contents: grouped[header]
            }));
        
            // console.log(JSON.stringify(this.items, null, 2)); // 打印转换后的数据
        }

    }
})

function transformData(data = { user: '默认用户', chat: {} }) {
    const result = {
        user: data.user || '默认用户',
        chat: [
            { tabel: [] },
            { counter: [{ positive: 0 }, { normal: 0 }, { passive: 0 }] },
            { message: {} } // 确保 message 总是被初始化为一个空对象
        ]
    };

    // 定义评分与描述的映射关系
    const scoreToDesc = {
        2: '积极',
        1: '正常',
        0: '消极'
    };

    // 检查并确保 chat 是一个对象
    if (typeof data.chat !== 'object' || data.chat === null) {
        console.warn('传入的数据中 chat 不是一个有效对象');
        return result;
    }

    // 遍历原始数据中的 chat 属性并填充结果对象
    Object.keys(data.chat).forEach(key => {
        const value = data.chat[key];

        // 确保 value 是一个数字并且存在于 scoreToDesc 中
        if (typeof value === 'number' && scoreToDesc[value] !== undefined) {
            const desc = scoreToDesc[value];
            result.chat[0].tabel.push({ label: key, value: desc });

            // 更新计数器
            if (desc === '积极') {
                result.chat[1].counter[0].positive += 1;
            } else if (desc === '正常') {
                result.chat[1].counter[1].normal += 1;
            } else if (desc === '消极') {
                result.chat[1].counter[2].passive += 1;
            }

            // 更新 message 对象，保持其结构不变，仅替换数值
            result.chat[2].message[key] = desc; // 注意这里的变化
        } else {
            console.warn(`无效的数据条目: ${key}: ${value}`);
        }
    });

    return result;
}

function makeValidJson(str) {
    let cleanedStr = str.replace(/'/g, '"');
    
    // 移除多余的反斜杠并保留必要的转义字符（如 \n）
    cleanedStr = cleanedStr.replace(/\\+/g, match => match.length % 2 === 0 ? match : match.slice(0, -1));

    return cleanedStr;
}

