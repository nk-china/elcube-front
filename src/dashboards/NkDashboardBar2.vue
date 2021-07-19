<template>
    <nk-dashboard-card :title="title">
        <div ref="chart" style="width:100%;height: 100%;"></div>
    </nk-dashboard-card>
</template>

<script>
import echarts from 'echarts';


export default {
    props:{
        title:String,
        config:Object,
    },
    data(){
        return {
            chart:undefined
        }
    },
    mounted() {
        this.$nextTick(()=>{
            this.chart = echarts.init(this.$refs.chart);
            this.chart.setOption({
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 10,
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '直接访问',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            });
        })
    },
    methods:{
        ready(){
        },
        resized(){
            this.chart && this.chart.resize();
        }
    }
}
</script>

<style scoped>

</style>