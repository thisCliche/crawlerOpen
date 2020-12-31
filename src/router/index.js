import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import( /* webpackChunkName: "Login_home_welcome" */ '../views/Home.vue')
const Welcome = () => import( /* webpackChunkName: "Login_home_welcome" */ '../views/Welcome.vue')
const District = () => import( /* webpackChunkName: "Cate_params" */ '../views/district/District.vue')
const Crawler = () => import( /* webpackChunkName: "Orders_report" */ '../views/crawler/Crawler.vue')
const ScriptTemp = () => import( /* webpackChunkName: "Orders_report" */ '../views/crawler/ScriptTemp.vue')
const Rule = () => import( /* webpackChunkName: "Orders_report" */ '../views/crawler/Rule.vue')
const Policy = () => import( /* webpackChunkName: "Orders_report" */ '../views/policy/Policy.vue')
Vue.use(VueRouter)
const routes = [{
  path: '/',
  component: Home,
  redirect: '/welcome',
  name: 'Home',
  children: [{
      path: '/welcome',
      component: Welcome,
      name: 'Welcome'
    },
    {
      path: '/district',
      component: District,
      name: 'District'
    },
    {
      path: '/crawler',
      component: Crawler,
      name: 'Crawler'
    },
    {
      path: '/scripttemp',
      component: ScriptTemp,
      name: 'ScriptTemp'
    },
    {
      path: '/rule',
      component: Rule,
      name: 'Rule'
    },
    {
      path: '/policy',
      component: Policy,
      name: 'Policy'
    },
  ]
}]
const router = new VueRouter({
  routes
})
export default router