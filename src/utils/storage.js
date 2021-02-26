/*
  本地储存模块
*/

/* 储存 */

export const setItem = (key, value) => {
  // 将数组、对象类型的数据转换为 JSON 格式的字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

/* 获取 */
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  // 通过 try catch 可验证是否有数据能转换为 JSON.prase 对象或数组
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/* 删除 */
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
