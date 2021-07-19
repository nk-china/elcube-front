<template>
    <nk-dashboard-card :title="title">
        <div ref="chart" style="width:100%;height: 100%;"></div>
    </nk-dashboard-card>
</template>

<script>
import echarts from 'echarts';

function getVirtulData(year) {
    year = year || '2020';
    var date = +echarts.number.parseDate(year + '-01-01');
    var end = +echarts.number.parseDate((+year + 1) + '-01-01');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
        data.push([
            echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 1000)
        ]);
    }
    return data;
}



var graphData = [
    [
        1485878400000,
        260
    ],
    [
        1486137600000,
        200
    ],
    [
        1486569600000,
        279
    ],
    [
        1486915200000,
        847
    ],
    [
        1487347200000,
        241
    ],
    [
        1487779200000,
        411
    ],
    [
        1488124800000,
        985
    ]
];

var links = graphData.map(function (item, idx) {
    return {
        source: idx,
        target: idx + 1
    };
});
links.pop();


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
                tooltip: {
                    position: 'top'
                },

                visualMap: [{
                    min: 0,
                    max: 1000,
                    inRange: {
                        color: ['grey'],
                        opacity: [0, 0.3]
                    },
                    seriesIndex: [1],
                    orient: 'horizontal',
                    left: '10%',
                    bottom: 20
                }],

                calendar: {
                    orient: 'vertical',
                    yearLabel: {
                        margin: 40
                    },
                    monthLabel: {
                        nameMap: 'cn',
                        margin: 20
                    },
                    dayLabel: {
                        firstDay: 1,
                        nameMap: 'cn'
                    },
                    cellSize: 30,
                    range: '2020-02'
                },

                series: [{
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    calendarIndex: 0,
                    symbolSize: function (val) {
                        return val[1] / 60;
                    },
                    data: getVirtulData(2020)
                }, {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    calendarIndex: 0,
                    data: getVirtulData(2020)
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