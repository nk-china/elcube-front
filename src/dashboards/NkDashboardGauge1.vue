<template>
    <nk-dashboard-card :title="title||'雷达图'" >
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
            let option = {
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                toolbox: {
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [
                    {
                        name: '业务指标',
                        type: 'gauge',
                        detail: {formatter: '{value}%'},
                        data: [{value: 50, name: '逾期率'}]
                    }
                ]
            };
            this.chart.setOption(option);
            let that = this;
            setInterval(function () {
                option.series[0].data[0].value = (option.series[0].data[0].value +  Math.random()*10 - 5).toFixed(2)-0;
                that.chart.setOption(option, true);
            },1000);
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