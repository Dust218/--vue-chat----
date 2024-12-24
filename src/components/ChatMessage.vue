<template>
    <div v-for="(item, index) in $store.state.items" :key="index">
        <div v-if="$store.state.id !== 0">
            <div style="display: flex; justify-content: flex-end;">
                <div style="margin-top: 6px; margin-left: 10%;">
                    <a-card :style="{ width: '100%' }" :hoverable="true">
                        <div style="white-space: pre-line;">
                            {{ item.user }}
                        </div>
                    </a-card>
                </div>
                <div style="margin-right: 12px; margin-top: 5px;">
                    <a-avatar :style="{ backgroundColor: '#3370ff', marginLeft: '18px' }">
                        <IconUser />
                    </a-avatar>
                </div>
            </div>
        </div>

        <br>
        <div style="display: flex; justify-content: flex-start;">
            <div style="margin-left: 12px;">
                <a-avatar :style="{ backgroundColor: '#3370ff', marginRight: '18px' }">
                    <icon-pen />
                </a-avatar>
            </div>
            <div style="margin-top: -5px; width: 100%;">
                <a-card :style="{ width: '90%' }" :hoverable="true">
                    <div style="white-space: pre-line; text-align: left;" v-if="$store.state.model === 1">
                        {{ item.chat }}
                    </div>
                    <div v-if="$store.state.model === 2 && Array.isArray(item.chat)">
                        <!-- 默认显示情感分析内容 -->
                        <a-descriptions :data="item.chat[0].tabel" size="medium" title="情感分析表" bordered />
                        <div class="button-container">
                            <a-button type="outline" @click="initChart(item.chat[1].counter, index)">查看图表</a-button>
                            <a-button type="dashed" @click="destroyChart(index)">关闭图表</a-button>
                        </div>
                        <div :id="'main' + index" :style="getDisplayStyle(index)"></div>
                    </div>
                </a-card>
            </div>
        </div>
    </div>
    <div v-if="$store.state.id === 0">
        <initialize />
    </div>
</template>

<script>
import * as echarts from 'echarts';
import initialize from './initialize.vue';
export default {
    name: 'ChatMessage',
    data() {
        return {
            myCharts: {}, // 使用对象存储每个图表实例
            chartInitialized: {},// 跟踪每个图表是否已初始化
        };
    },
    components: {
    initialize
  },
    computed: {
        getDisplayStyle() {
            return (index) => ({
                width: '100%',
                height: '350px',
                marginTop: '10px',
                display: this.chartInitialized[index] ? 'block' : 'none'
            });
        }
    },
    methods: {
        initChart(counter, index) {
            if (this.chartInitialized[index]) return;

            this.chartInitialized[index] = true;

            // 使用nextTick确保DOM更新完成后执行
            this.$nextTick(() => {
                const chartId = `main${index}`;
                this.myCharts[index] = echarts.init(document.getElementById(chartId));
                this.myCharts[index].setOption({
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            name: '情绪分析',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '70%'],
                            startAngle: 180,
                            endAngle: 360,
                            data: [
                                { value: counter[0].positive, name: '积极' },
                                { value: counter[1].normal, name: '正常' },
                                { value: counter[2].passive, name: '消极' }
                            ]
                        }
                    ]
                });
                window.addEventListener('resize', () => this.resizeChart(index));
            });
        },
        resizeChart(index) {
            if (this.myCharts[index]) {
                this.myCharts[index].resize();
            }
        },
        destroyChart(index) {
            if (this.myCharts[index]) {
                window.removeEventListener('resize', () => this.resizeChart(index));
                this.myCharts[index].dispose();
                this.myCharts[index] = null;
                this.chartInitialized[index] = false;  // 重置为false以隐藏图表
            }
        }
    },
    beforeUnmount() {
        Object.keys(this.myCharts).forEach(index => {
            this.destroyChart(Number(index)); // 确保在组件卸载前清理所有资源
        });
    }
};
</script>

<style>
.button-container {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    /* 让子元素在主轴（水平）上两端对齐 */
    align-items: center;
    /* 垂直居中对齐 */
    padding: 0 80px;
    margin-top: 20px;
    /* 控制容器与上方元素之间的间距 */
}
</style>