<template>
    <div class="container" :style="{ background: `url(${scene})` }">
        <div style="color: #fff;" class="left">
            <div class="card">
                <!-- <section>
                    <div>较昨日+{{ store.chinaAdd.storeConfirm }}</div>
                    <div>{{ 9006774 }}</div>
                    <div>现有确诊</div>
                </section> -->
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

            <div class="pie">
            </div>

            <div class="line">

            </div>
        </div>
        <div id="china" class="center">
            <!-- <div id="china"></div> -->
        </div>
        <div class="right">
            <table class="table" cellspacing="0" border="1">
                <thead>
                    <tr>
                        <th>地区</th>
                        <th>新增确诊</th>
                        <th>累计确诊</th>
                        <th>治愈</th>
                        <th>死亡</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in store.cityItem">
                        <td>{{ item.name }}</td>
                        <td>{{ item.today.confirm }}</td>
                        <td>{{ item.total.confirm }}</td>
                        <td>{{ item.total.heal }}</td>
                        <td>{{ item.total.dead }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import scene from './assets/scene.jpg'
import { useStore } from './stores/index';
import * as echarts from 'echarts'
import './assets/china'
import { geoCoordMap } from './assets/geoMap'

const store = useStore();


onMounted(async () => {
    await store.getList()

    initCharts()
    initPie()
    initLine()
})

const initCharts = () => {
    const provinces = store.list.areaTree[2].children
    store.cityItem = provinces[2].children
    console.log(provinces);
    const data = provinces.map(item => {
        // console.log(item.name,geoCoordMap[item.name].concat(item.today.confirm));
        return {
            name: item.name,
            value: geoCoordMap[item.name].concat(item.today.confirm),
            children: item.children
        }
    })
    // console.log(data);
    const charts = echarts.init(document.querySelector('#china') as HTMLElement)

    charts.setOption({
        // backgroundColor: "black",
        geo: {
            map: "china",
            aspectScale: 0.8,
            layoutCenter: ["50%", "50%"],
            layoutSize: "120%",
            itemStyle: {
                areaColor: {
                    type: "linear-gradient",
                    x: 0,
                    y: 1200,
                    x2: 1000,
                    y2: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: "#152E6E", // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: "#0673AD", // 50% 处的颜色
                        },
                    ],
                    global: true, // 缺省为 false
                },
                shadowColor: "#0f5d9d",
                shadowOffsetX: 0,
                shadowOffsetY: 15,
                opacity: 0.5,
            },

            emphasis: {
                areaColor: "#0f5d9d",
            },

            regions: [
                {
                    name: "南海诸岛",
                    itemStyle: {
                        areaColor: "rgba(0, 10, 52, 1)",
                        borderColor: "rgba(0, 10, 52, 1)",
                        // normal: {
                        opacity: 0,
                        label: {
                            show: false,
                            color: "#009cc9",
                        },
                        // },
                    },
                    label: {
                        show: false,
                        color: "#FFFFFF",
                        fontSize: 12,
                    },
                },
            ],
        },
        series: [
            {
                type: "map",
                //多选
                // selectedMode: "multiple",
                map: "china",
                aspectScale: 0.8,
                layoutCenter: ["50%", "50%"], //地图位置
                layoutSize: "120%",
                zoom: 0.9, //当前视角的缩放比例
                // roam: true, //是否开启平游或缩放
                scaleLimit: {
                    //滚轮缩放的极限控制
                    min: 1,
                    max: 2,
                },
                //标签名字的设置
                label: {
                    show: true,
                    color: "#FFFFFF",
                    fontSize: 12,
                },
                itemStyle: {
                    // normal: {
                    areaColor: "#0c3653",
                    borderColor: "#1cccff",
                    borderWidth: 1.8,
                    // },
                },

                //强调，即鼠标hover之后
                emphasis: {
                    areaColor: "#56b1da",
                    label: {
                        show: true,
                        color: "#fff",
                    },
                },
                data: data,
            },
            {
                // name: 'Top 5',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin',
                symbolSize: [40, 40],
                //让展示的数字颜色为白色
                label: {
                    show: true,
                    color: '#fff',
                    formatter(value: any) {
                        // console.log(value);
                        return value.data.value[2]
                    }
                },
                //图标颜色
                itemStyle: {
                    // color: '#D8BC37', //标志颜色
                    color: '#1E90FF'
                },
                data: data,
            },
        ],
    })

    charts.on('click', (e: any) => {
        console.log(e);
        store.cityItem = e.data.children
        initPie()
    })
}

const initPie = () => {
    const charts = echarts.init(document.querySelector('.pie') as HTMLElement)
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
    const charts = echarts.init(document.querySelector('.line') as HTMLElement)
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
* {
    padding: 0;
    margin: 0;
}

html,
body,
#app {
    height: 100%;
    overflow: hidden;
}

#app {
    justify-content: space-around
}

.container {
    display: flex;
    height: 100%;
    /* padding: 10px; */
}

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

.center {
    flex: 1;
    /* background-color: salmon; */
}

.right {
    width: 250px;
    /* background-color: goldenrod; */
    color: white;
    font-size: 13px;
    text-align: center;
    display: flex;
}

.table {
    width: 100%;
    border-radius: 5px;
    border-collapse: collapse;
    /* 折叠边框 */
    /* margin-top: 20px; */
    /* 根据需要调整 */
    background: #212028;
    /* 背景色 */
}


.table th {
    background-color: #2a2d34;
    /* 表头背景色 */
    color: #41b0db;
    /* 表头字体颜色 */
    font-weight: bold;
    /* 字体加粗 */
}

.table tr:nth-child(even) {
    background-color: #292b30;
    /* 斑马纹效果 */
}

.table tr:hover {
    background-color: #41454b;
    /* 悬停效果 */
}
</style>
