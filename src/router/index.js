import Vue from 'vue'
import Router from 'vue-router'
import { getStore } from '@/common/js/utils.js'
import store from '@/store'
const Home = () =>
    import ('@/pages/Home')
const CleanTaskList = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/TaskList')
const Login = () =>
    import ('@/pages/Login')
const MyInfo = () =>
    import ('@/pages/MyInfo')
Vue.use(Router)
let baseRoute = [{
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/myInfo',
        name: 'myInfo',
        component: MyInfo
    },
    {
        path: '/cleanTaskList',
        name: 'cleanTaskList',
        component: CleanTaskList
    }
];
let router = new Router({
    routes: baseRoute,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            // return {
            //     x: 0,
            //     y: 0
            // }
        }
    }
});
router.beforeEach((to, from, next) => {
    let login = getStore('isLogin');
    let name = to.name;
    if (name === 'login') {
        if (login) {
            next({ path: '/home' })
        } else {
            next()
        }
    } else {
        if (login) {
            next()
        } else {
            next({ path: '/' })
        }
    }
});
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
export default router