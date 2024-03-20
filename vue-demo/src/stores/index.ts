import { defineStore } from 'pinia'
import { getApiList } from '../server'
import type { RootObject, AreaTree, ChinaTotal, ChinaDayList } from './type'

export const useStore = defineStore('counter', {
  state: () => ({
    //根据请求到的json让list具有类型
    list: <RootObject>{},
    cityItem: <AreaTree["children"]>[],
    chinaAdd: <ChinaTotal["today"]>{},
    chinaTotal: <ChinaTotal["total"]>{},
    chinaDayList: <ChinaDayList[]>[]
  }),
  actions: {
    async getList() {
      const result = await getApiList()
      console.log(result);
      this.list = result
      this.chinaAdd = this.list.chinaTotal.today
      this.chinaTotal = this.list.chinaTotal.total
      this.chinaDayList = this.list.chinaDayList
    }
  }
})
