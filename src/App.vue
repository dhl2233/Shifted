<template>
  <div class="app-center">
    <div class="mb30">
      <div :style="{ width: '800px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
        <a-calendar v-model="timenow" :fullscreen="false" @panelChange="onPanelChange" @keyup.enter="addItem"/>
      </div>
      <select v-model="leixing" style="width:60px;height: 32px;margin-top: 10px;margin-bottom: 5px;margin-left: 10px">
        <option value="out">支出</option>
        <option value="in">收入</option>
      </select>

      <label >
        <input style="width: 100px;margin-left: 10px" v-model="money"
               class="todo-input"
               placeholder="金额"
               @keyup.enter="addItem"/>
      </label>
      <label >
        <input style="width: 610px;margin-left: 10px" v-model="tittle"
               class="todo-input"
               placeholder="描述"
               @keyup.enter="addItem"/>
      </label>

    </div>

    <div class="mb30">
      <table class="todo-table">
        <thead>
        <tr>
          <th style="width: 50px;">日期</th>
          <th style="width: 50px;">类型</th>
          <th style="width: 50px;">金额</th>
          <th style="width: 50px;">描述</th>
          <th style="width: 70px;margin-left: 25px">操作</th>
        </tr>
        </thead>
        <tbody v-if="items.length">
        <tr v-for="item in itemsInTable" :key="item.id">
          <td style="width: 100px">
            <span>{{ item.timenow.toString().substring(0,10)}}</span>
          </td>
          <td>
            <label>
              <!--                            <input type="checkbox"-->
              <!--                                      v-model="item.done"/>-->
              <span >{{ item.leixing }}</span>
            </label>
          </td>
          <!--                    金额部分-->

          <td style="width: 100px"
              @click="item.edmoney = true">
            <label v-if="item.edmoney">
              <input v-model="item.money"
                     @keyup.enter="updateItem(item.id)"
                     @focusout="updateItem(item.id)"/>
            </label>
            <span v-else>{{ item.money }}</span>
          </td>
          <!--                    描述-->
          <td style="width: 400px"
              @click="item.editable = true">
            <label v-if="item.editable">
              <input v-model="item.title"
                     @keyup.enter="updateItem(item.id)"
                     @focusout="updateItem(item.id)"/>
            </label>
            <span v-else>{{ item.title }}</span>
          </td>

          <td style="width: 60px">
            <a-button type="danger" @click="removeItem(item.id)">
              删除
            </a-button>
          </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td colspan="3">无数据</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td style="width: 300px;color: #42b983">
            总收入：<span>{{ parseInt(totalize.incomeSum) }}</span>
          </td>
          <td style="width: 300px;color: red">
            总支出：<span>{{ parseInt(totalize.expendSum) }}</span>
          </td>
          <td style="width: 300px;color: red" v-if="totalize.allSum<=0">
            亏损：<span>{{ parseInt(totalize.allSum) }}</span>
          </td>
          <td v-else style="width: 300px;color: #42b983" >
            盈利：<span>{{ parseInt(totalize.allSum) }}</span>
          </td>
        </tr>
        </tfoot>
      </table>
    </div>

    <div>
      <label v-for="radio in radios" :key="radio.value">
        <input type="radio"
               :value="radio.value"
               v-model="viewMode"/> {{ radio.text }}
      </label>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        
        item: '',
        leixing:'',//支出类型
        money: '',//金额
        tittle:'',//描述
        allin:'',//总收入
        allout:'',//总支出
        items: [],
        radios: [
          {value: 'all', text: '查看所有'},
          {value: 'out', text: '查看支出'},
          {value: 'done', text: '查看收入'}
        ],
        viewMode: 'all',
        timenow: '',
      }
    },

    computed: {
      newItem() {//生成对象
        return {
          id: this.items.length + 1,
          leixing: this.leixing,
          money: this.money,
          title: this.tittle,
          done: false,
          edmoney: false,
          editable: false,
          timenow: this.timenow,

        }
      },

      totalize() {
        let incomeSum = 0
        let expendSum = 0

        this.items.filter(item => item.leixing === 'in').forEach((item) => {
          incomeSum = parseInt(incomeSum) + parseInt(item.money)
        })
        this.items.filter(item => item.leixing === 'out').forEach((item) => {
          expendSum = expendSum + parseInt(item.money)
        })
        return {
          incomeSum: incomeSum,
          expendSum: expendSum,
          allSum: incomeSum - expendSum
        }
        // incomeSum
        // return incomeSum
      },
      itemsInTable() {//筛选
        switch (this.viewMode) {
          case 'all':
            return this.items;
          case 'out':
            return this.items.filter(item => item.leixing==="out")
          default:
            return this.items.filter(item => item.leixing==="in")
        }
      }
    },
    created() {
      this.items = JSON.parse(localStorage.getItem('todos')) || []
    },
    methods: {
      addItem() {
        if (this.leixing!=""){
          console.log(this.timenow)
          this.items.push(this.newItem)
          //console.log(this.timenow)
          this.leixing=''
          this.item = ''
          this.tittle=''
          this.money=''
          localStorage.setItem('todos', JSON.stringify(this.items))
        }
      },
      removeItem(id) {
        this.items = this.items.filter(item => item.id !== id)
        localStorage.setItem('todos', JSON.stringify(this.items))
      },
      updateItem(id) {
        this.items = this.items.map(
                item => item.id === id
                        ? {...item, editable: false,edmoney: false}
                        : item)
        localStorage.setItem('todos', JSON.stringify(this.items))
      },
      onPanelChange(value, mode) {
        console.log(value, mode);
      },
    }
  }
</script>

<style scoped>
  .app-center {
    width: 800px;
    margin: 0 auto;
  }
  .todo-input {
    width: 100%;
    outline-style: none;
    border: solid 1px #ccc;
    border-radius: 4px;
    line-height: 30px;
    padding: 0 5px;
  }
  .todo-table {
    width: 100%;
    line-height: 30px;
    text-align: center;
    border-collapse: collapse;
    border-top: solid 1px #ccc;
  }
  .todo-table thead tr {
    border-bottom: solid 2px #dee2e6;
  }
  .todo-table tbody tr {
    border-bottom: solid 1px #dee2e6;
  }
  .mb30 {
    margin-bottom: 30px;
  }
</style>




