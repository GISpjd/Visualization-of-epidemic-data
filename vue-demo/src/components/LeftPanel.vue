<template>
    <div style="color: #fff;" class="left">
        <div class="card">
            <section>
                <div>较昨日+{{ store.chinaAdd.confirm }}</div>
                <div>{{ store.chinaTotal.confirm }}</div>
                <div>累计确诊</div>
            </section>
            <section>
                <div>较昨日+{{ store.chinaAdd.input }}</div>
                <div>{{ store.chinaTotal.input }}</div>
                <div>境外输入</div>
            </section>
            <section>
                <div>较昨日+{{ store.chinaAdd.dead }}</div>
                <div>{{ store.chinaTotal.dead }}</div>
                <div>累计死亡</div>
            </section>
            <section>
                <div>较昨日+{{ store.chinaAdd.heal }}</div>
                <div>{{ store.chinaTotal.heal }}</div>
                <div>累计确诊</div>
            </section>
        </div>

        <div ref="pieChart" class="pie">
        </div>

        <div ref="lineChart" class="line">

        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from '../stores/index';
import * as echarts from 'echarts';

const store = useStore();
let pieChart = ref(null)
let lineChart = ref(null)

onMounted(async () => {
    await store.getList()
    initPie();
    initLine();
});

const initPie = () => {
    // const charts = echarts.init(document.querySelector('.pie') as HTMLElement)
    const charts = echarts.init(pieChart.value)
    charts.setOption({
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '该市累计确诊',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                data: store.cityItem.map(i => {
                    return {
                        name: i.name,
                        value: i.total.confirm
                    }
                })
            }
        ]
    })
}

const initLine = () => {
    // const charts = echarts.init(document.querySelector('.line') as HTMLElement)
    const charts = echarts.init(lineChart.value)

    // const showArr: any = store.chinaDayList.slice(store.chinaDayList.length - 7)
    // console.log(showArr);

    charts.setOption({
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['ago6', 'ago5', 'ago4', 'ago3', 'ago2', 'ago1', 'today'],
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
        },
        label: {
            show: true
        },
        series: [
            {
                data: store.chinaDayList.slice(-7).map(day => day.today.confirm),
                type: 'line',
                smooth: true
            }
        ]
    })
}

</script>

<style>
.left {
    width: 320px;
    /* background-color: aqua; */
}

/* @itemColor: #41b0db;
    @itemBg: #223651;
    @itemBorder: #212028; */

.left .card {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
}

.left .card section {
    background-color: #223651;
    border: 1px solid #212028;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.left .card section div:nth-child(2) {
    color: #41b0db;
    font-weight: bold;
    font-size: 18px;
    padding: 5px 0;
}

.left .pie {
    height: 280px;
    margin-top: 5px;
    background-color: #223651;
}

.left .line {
    height: 260px;
    margin-top: 5px;
    background-color: #223651;

}
</style>