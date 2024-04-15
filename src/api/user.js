import request from "@/utils/request";

export function getRequest(url, paramObj) {
  return request({
    method: "get",
    url,
    params: paramObj
  });
}

export function postRequest(url, data) {
  return request({
    method: "post",
    url,
    data
  })
}

export function getIndicators(url, types,tableName) {
  return request({
    method: "get",
    url,
    params: {
      types: types,
      tableName: tableName
    }
  });
}

export function getTaskNumber(url, disease, tasktype, leader) {
  return request({
    method: "get",
    url,
    params: {
      disease: disease,
      tasktype: tasktype,
      leader: leader,
    }
  });
}

export function getIndicatorInfo(url, checkedFeats,tableName) {
  return request({
    method: "get",
    url,
    params: {
      checkedFeats: checkedFeats,
      tableName: tableName
    }
  });
}

export function requestFormData(url, featureName,tableName,taskInfo) {
  return request({
    method: "get",
    url,
    params: {
      featureName: featureName,
      tableName: tableName,
      taskInfo: JSON.stringify(taskInfo)
    }
  });
}

export function saveParentDisease(url, diseaseName) {
  return request({
    method: "get",
    url,
    params: {
      diseaseName: diseaseName
    }
  });
}

export function getSingleAnalyze(url, tableName, colNames,taskInfo) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      colNames: colNames,
      taskInfo: JSON.stringify(taskInfo)
    }
  });
}


export function singleFactorAnalyze(url, tableName, featureName,taskInfo) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      featureName: featureName,
      taskInfo: JSON.stringify(taskInfo)
    }
  });
}


export function exportTableByFields(url, tableName, featureList) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      featureList: featureList
    }
  });
}
export function addVisliazationTask(url, tableName, selectDisease,taskInfo) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      selectDisease: JSON.stringify(selectDisease),
      taskInfo:JSON.stringify(taskInfo)
    }
  });
}

export function filterTask(url, disease, tasktype, leader,newPage,pageSize) {
  return request({
    method: "get",
    url,
    params: {
      disease: disease,
      tasktype: tasktype,
      leader: leader,
      newPage: newPage,
      pageSize: pageSize
    }
  });
}
export function addRepresentTask(url, tableName, colNames, model, taskInfo) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      colNames: colNames,
      model: model,
      taskInfo: JSON.stringify(taskInfo)
    }
  });
}