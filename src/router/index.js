import Vue from 'vue'
import Router from 'vue-router'
import { getStore } from '@/common/js/utils.js'
import store from '@/store'
const Home = () =>
    import ('@/pages/Home')
const CleanTaskList = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/TaskList')
const CleaningTask = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/CleaningTask')
const ForthwithCleaningTaskDetails = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/ForthwithCleaningTaskDetails')
const ChoosePosition = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/ChoosePosition')
const SpecialCleaningTaskDetails = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/SpecialCleaningTaskDetails')
const AddTask = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/AddTask')
const PollingTaskDetails = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/PollingTaskDetails')
const PollingTaskDepartmentDetails = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/PollingTaskDepartmentDetails')
const PollingTaskDepartmentCornerDetails = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/PollingTaskDepartmentCornerDetails')
const PollingTaskNoCompleteReason = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/PollingTaskNoCompleteReason')
const ScanQRCode = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/ScanQRCode')
const AttendanceManagement = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/AttendanceManagement')
const AttendanceStatistics = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/AttendanceStatistics')
const AttendanceTypeDetails = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/AttendanceTypeDetails')
const PersonnelStatisticsDetails = () =>
    import ('@/pages/environmentalManagement/cleaningManagement/PersonnelStatisticsDetails')               
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
        path: '/cleaningTask',
        name: 'cleaningTask',
        component: CleaningTask
    },
    {
        path: '/cleanTaskList',
        name: 'cleanTaskList',
        component: CleanTaskList
    },
    {
        path: '/addTask',
        name: 'addTask',
        component: AddTask
    },
    {
        path: '/forthwithCleaningTaskDetails',
        name: 'forthwithCleaningTaskDetails',
        component: ForthwithCleaningTaskDetails
    },
    {
        path: '/choosePosition',
        name: 'choosePosition',
        component: ChoosePosition
    },
    {
        path: '/specialCleaningTaskDetails',
        name: 'specialCleaningTaskDetails',
        component: SpecialCleaningTaskDetails
    },
    {
        path: '/pollingTaskDetails',
        name: 'pollingTaskDetails',
        component: PollingTaskDetails
    },
    {
        path: '/pollingTaskDepartmentDetails',
        name: 'pollingTaskDepartmentDetails',
        component: PollingTaskDepartmentDetails
    },
    {
        path: '/pollingTaskDepartmentCornerDetails',
        name: 'pollingTaskDepartmentCornerDetails',
        component: PollingTaskDepartmentCornerDetails
    },
    {
        path: '/pollingTaskNoCompleteReason',
        name: 'pollingTaskNoCompleteReason',
        component: PollingTaskNoCompleteReason
    },
    {
        path: '/scanQRCode',
        name: 'scanQRCode',
        component: ScanQRCode
    },
    {
        path: '/attendanceManagement',
        name: 'attendanceManagement',
        component: AttendanceManagement
    },
    {
        path: '/attendanceStatistics',
        name: 'attendanceStatistics',
        component: AttendanceStatistics
    },
    {
        path: '/attendanceTypeDetails',
        name: 'attendanceTypeDetails',
        component: AttendanceTypeDetails
    },
    {
        path: '/personnelStatisticsDetails',
        name: 'personnelStatisticsDetails',
        component: PersonnelStatisticsDetails
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