function transformData(data = { user: '默认用户', chat: {} }) {
    console.log('Transforming data:', data); // 添加日志输出

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

// 测试代码
const mockApiResponse = {
    "Transportation": 1,
    "Downtown": 1,
    "Easy_to_find": 1,
    "Queue": 1,
    "Hospitality": 1,
    "Parking": 0,
    "Timely": 1,
    "Level": 2
};

const newRecord = {
    user: "qwe",
    chat: mockApiResponse
};

const transformedData = transformData(newRecord);
console.log(transformedData);