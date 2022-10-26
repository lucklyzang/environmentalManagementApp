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

// 获取建筑信息
export function getArchitectureMessage(data) {
  return request({
    url: 'clean/structure/query2Select',
    method: 'get',
    params: data
  })
}

// 获取科室信息
export function getDepartmentMessage(data) {
  return request({
    url: 'clean/department/query2Select',
    method: 'get',
    params: data
  })
}

// 获取目的区域信息
export function getGoalAreaMessage(data) {
  return request({
    url: 'clean/goalArea/queryAll',
    method: 'get',
    params: data
  })
}

// 获取功能区信息
export function getFunctionAreaMessage(data) {
  return request({
    url: 'clean/cleanArea/queryAll',
    method: 'get',
    params: data
  })
}

// 获取违反标准信息
export function getViolateStandardMessage(data) {
  return request({
    url: 'clean//cleanArea/standards',
    method: 'get',
    params: data
  })
}

// 即时保洁任务新增
export function addForthwithCleanTask(data) {
  return request({
    url: 'clean/cleanTask/add',
    method: 'post',
    data
  })
}

// 考勤日统计
export function cleanAttendanceDay(data) {
  return request({
    url: 'clean/attendance/dayApp',
    method: 'get',
    params: data
  })
}

// 考勤日统计详情
export function cleanAttendanceDayInfo(data) {
  return request({
    url: 'clean/attendance/dayAppInfo',
    method: 'get',
    params: data
  })
}

// 考勤月统计
export function cleanAttendanceMonth(data) {
  return request({
    url: 'clean/attendance/monthApp',
    method: 'get',
    params: data
  })
}

// 考勤月统计详情
export function cleanAttendanceMonthInfo(data) {
  return request({
    url: 'clean/attendance/monthAppInfo',
    method: 'get',
    params: data
  })
}

// 考勤月统计出勤详情
export function cleanAttendanceMonthAttendance(data) {
  return request({
    url: 'clean/attendance/monthAttendanceApp',
    method: 'get',
    params: data
  })
}

// 考勤人员统计
export function cleanAttendancePeople(data) {
  return request({
    url: 'clean/attendance/peopleApp',
    method: 'get',
    params: data
  })
}

// 考勤人员详情统计
export function cleanAttendancePeopleInfo(data) {
  return request({
    url: 'clean/attendance/peopleInfoApp',
    method: 'get',
    params: data
  })
}
