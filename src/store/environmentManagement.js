import { setStore, getStore } from '@/common/js/utils'
import { getDefaultEnvironmentManagementState } from '@/common/js/resetStore'
export default {
    state: getDefaultEnvironmentManagementState(),

    getters: {
        currentCleanTaskName: (state) => {
            state.currentCleanTaskName = getStore('currentCleanTaskName') ? JSON.parse(getStore('currentCleanTaskName')) : {};
            return state.currentCleanTaskName
        },

        currentCleanTaskDateVlue : (state) => {
            state.currentCleanTaskDateVlue = getStore('currentCleanTaskDateVlue') ? getStore('currentCleanTaskDateVlue') : 1;
            return state.currentCleanTaskDateVlue
        },

        cleanTaskDetails : (state) => {
            state.cleanTaskDetails = getStore('cleanTaskDetails') ? JSON.parse(getStore('cleanTaskDetails')) : {};
            return state.cleanTaskDetails
        },

        attendanceStatisticsSwitchMessage : (state) => {
            return state.attendanceStatisticsSwitchMessage
        },

        locationMessage : (state) => {
            return state.locationMessage
        },

        attendanceTypeDetailsMessage : (state) => {
            state.attendanceTypeDetailsMessage = getStore('attendanceTypeDetailsMessage') ? JSON.parse(getStore('attendanceTypeDetailsMessage')) : {};
            return state.attendanceTypeDetailsMessage
        },

        personnelStatisticsDetailsMessage : (state) => {
            state.personnelStatisticsDetailsMessage = getStore('personnelStatisticsDetailsMessage') ? JSON.parse(getStore('personnelStatisticsDetailsMessage')) : {};
            return state.personnelStatisticsDetailsMessage
        }
    },

    mutations: {
        // 保存保洁管理中点击的任务类型
        storeCurrentCleanTaskName(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('currentCleanTaskName', playLoad);
                state.currentCleanTaskName = playLoad
            }
        },

        // 保存保洁管理任务列表选择的日期
        storeCurrentCleanTaskDateVlue(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('currentCleanTaskDateVlue', playLoad);
                state.currentCleanTaskDateVlue = playLoad
            }
        },

        // 保存保洁管理任务详情
        storeCleanTaskDetails(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('cleanTaskDetails', playLoad);
                state.cleanTaskDetails = playLoad
            }
        },

        // 保存保洁管理考勤统计类型详情
        storeAttendanceTypeDetailsMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('attendanceTypeDetailsMessage', playLoad);
                state.attendanceTypeDetailsMessage = playLoad
            }
        },

        // 保存保洁管理考勤人员统计详情
        storePersonnelStatisticsDetailsMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('personnelStatisticsDetailsMessage', playLoad);
                state.personnelStatisticsDetailsMessage = playLoad
            }
        },

        // 保存保洁管理考勤统计切换和日期信息
        storeAttendanceStatisticsSwitchMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.attendanceStatisticsSwitchMessage = playLoad
            }
        },

        // 保存保洁管理即时保洁任务添加的位置信息
        storeLocationMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.locationMessage = playLoad
            }
        },

        //重置保洁管理状态
        resetCleanManagementState(state) {
            Object.assign(state, getDefaultEnvironmentManagementState())
        }
    },

    actions: {
        resetCleanManagementStore({ commit }) {
            commit('resetCleanManagementState')
        }
    }
}