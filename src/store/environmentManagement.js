import { setStore, getStore } from '@/common/js/utils'
import { getDefaultEnvironmentManagementState } from '@/common/js/resetStore'
export default {
    state: getDefaultEnvironmentManagementState(),

    getters: {
        currentCleanTaskName: (state) => {
            state.currentCleanTaskName = getStore('currentCleanTaskName') ? getStore('currentCleanTaskName') : 1;
            return state.currentCleanTaskName
        },

        currentCleanTaskDateVlue : (state) => {
            state.currentCleanTaskDateVlue = getStore('currentCleanTaskDateVlue') ? getStore('currentCleanTaskDateVlue') : 1;
            return state.currentCleanTaskDateVlue
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

        //重置保洁管理状态
        resetCleanManagementState(state) {
            Object.assign(state, getDefaultCleanManagementState())
        }
    },

    actions: {
        resetCleanManagementStore({ commit }) {
            commit('resetCleanManagementState')
        }
    }
}