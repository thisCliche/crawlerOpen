import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import( /* webpackChunkName: "Login_home_welcome" */ '../views/Home.vue')
const Login = () => import(/* webpackChunkName: "Login_home_welcome" */ '../views/Login.vue')
const Welcome = () => import( /* webpackChunkName: "Login_home_welcome" */ '../views/Welcome.vue')
const District = () => import( /* webpackChunkName: "Cate_params" */ '../views/district/District.vue')
const Crawler = () => import( /* webpackChunkName: "Orders_report" */ '../views/crawler/Crawler.vue')
const ScriptTemp = () => import( /* webpackChunkName: "Orders_report" */ '../views/crawler/ScriptTemp.vue')
const Rule = () => import( /* webpackChunkName: "Orders_report" */ '../views/crawler/Rule.vue')
const Policy = () => import( /* webpackChunkName: "Orders_report" */ '../views/policy/Policy.vue')
Vue.use(VueRouter)
const routes = [
  { path: '/login', component: Login },
  {
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
//挂载路由导航守卫
// router.beforeEach((to, from, next) =>{
//   // 如果用户访问的登录页，直接放行
//   if (to.path == '/login') return next()
//   // 从sessionStorage 中获取到保存的 token 值
//   const tokenStr = window.sessionStorage.getItem('token')
//   //没有 token，强制跳转到登录页
//   if (!tokenStr) {
//     // window.alert("请先登录！")
//     return next('/login')
//   }
//   next()
// })
export default router