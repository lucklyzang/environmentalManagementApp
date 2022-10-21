import request from '@/utils/request'
import qs from 'qs'
// 查询保洁管理任务总体情况统计
export function queryCleaningManageTaskGlobalStatistics(data) {
    return request({
      url: 'clean/cleanTask/app/clean/display',
      method: 'get',
      params: data
    })
};

// 查询保洁管理任务列表
export function queryCleaningManageTaskList(data) {
    return request({
      url: 'clean/cleanTask/listAllByParam',
      method: 'get',
      params: data
    })
};

// 更新保洁管理任务状态
export function updateCleaningManageTaskState(data) {
  return request({
    url: 'clean/cleanTask/state/update',
    method: 'put',
    data
  })
}

//保洁管理任务完成
export function cleaningManageTaskComplete(data) {
  return request({
    url: 'clean/cleanTask/complete',
    method: 'put',
    data
  })
}