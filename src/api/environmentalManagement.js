import request from '@/utils/request'
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
