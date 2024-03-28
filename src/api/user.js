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

export function requestFormData(url, featureName,tableName) {
  return request({
    method: "get",
    url,
    params: {
      featureName: featureName,
      tableName: tableName
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

export function getSingleAnalyze(url, tableName, colNames) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      colNames: colNames
    }
  });
}
