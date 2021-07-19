<template>
    <nk-dashboard-card :title="title">
        <div ref="chart" style="width:100%;height: 100%;"></div>
    </nk-dashboard-card>
</template>

<script>
import echarts from 'echarts';
import echartsStat from 'echarts-stat';

var data = [
    [1, 4862.4],
    [2, 5294.7],
    [3, 5934.5],
    [4, 7171.0],
    [5, 8964.4],
    [6, 10202.2],
    [7, 11962.5],
    [8, 14928.3],
    [9, 16909.2],
    [10, 18547.9],
    [11, 21617.8],
    [12, 26638.1],
    [13, 34634.4],
    [14, 46759.4],
    [15, 58478.1],
    [16, 67884.6],
    [17, 74462.6],
    [18, 79395.7]
];

// See https://github.com/ecomfe/echarts-stat
var myRegression = echartsStat.regression('exponential', data);

myRegression.points.sort(function(a, b) {
    return a[0] - b[0];
});


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
                grid:{
                    top:20,
                    bottom:20,
                    right:20,
                    left:30,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                xAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    splitNumber: 20
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                series: [{
                    name: 'scatter',
                    type: 'scatter',
                    emphasis: {
                        label: {
                            show: true,
                            position: 'left',
                            color: 'blue',
                            fontSize: 16
                        }
                    },
                    data: data
                }, {
                    name: 'line',
                    type: 'line',
                    showSymbol: false,
                    smooth: true,
                    data: myRegression.points,
                    markPoint: {
                        itemStyle: {
                            color: 'transparent'
                        },
                        label: {
                            show: true,
                            position: 'left',
                            formatter: myRegression.expression,
                            color: '#333',
                            fontSize: 14
                        },
                        data: [{
                            coord: myRegression.points[myRegression.points.length - 1]
                        }]
                    }
                }]
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