<template>
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
</template>

<script setup lang="ts">
import { useStore } from '../stores/index';

const store = useStore()
</script>

<style>
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