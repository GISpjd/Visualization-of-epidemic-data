<template>
    <div ref="chinaMap" class="center">
        <!-- <div id="china"></div> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '../stores/index';
import { geoCoordMap } from '../assets/geoMap'
import '../assets/china'


const store = useStore()
const chinaMap = ref(null)


onMounted(async () => {
    await store.getList()
    initCharts()
    //目的就是初始就把我設置的地方信息顯示出來
    initPie()
});

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
    // const charts = echarts.init(document.querySelector('#china') as HTMLElement)
    const charts = echarts.init(chinaMap.value)

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

</script>

<style>
.center {
    flex: 1;
    /* background-color: salmon; */
}
</style>