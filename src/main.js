import Vue from 'vue';
//import Button from 'ant-design-vue/lib/button';

import { Button } from 'ant-design-vue';
// eslint-disable-next-line no-unused-vars
import {DatePicker} from "ant-design-vue";
//import Calendar from 'ant-design-vue/lib/button';

import 'ant-design-vue/dist/antd.css';
import App from './App';
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)
Vue.component(Button.name, Button);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
