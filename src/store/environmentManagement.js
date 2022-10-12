import { setStore, getStore } from '@/common/js/utils'
import { getDefaultCleanManagementState } from '@/common/js/resetStore'
export default {
    state: getDefaultCleanManagementState(),

    getters: {
        currentCleanTaskName: (state) => {
            state.currentCleanTaskName = getStore('currentCleanTaskName') ? getStore('currentCleanTaskName') : 1;
            return state.currentCleanTaskName
        },
    },

    mutations: {
        // 保存保洁管理中点击的任务类型
        storeCurrentCleanTaskName(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('currentCleanTaskName', playLoad);
                state.currentCleanTaskName = playLoad
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