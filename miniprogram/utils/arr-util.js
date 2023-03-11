// 数组相关函数

/**
 * 数组分组
 * @param arr 待分组的数组
 * @param field 分组字段
 * @returns {*[]}
 */
export function groupBy(arr, field) {
  const groups = {}
  for (let item of arr) {
    const matchedGroup = groups[item[field]] || []
    matchedGroup.push(item)
    groups[item[field]] = matchedGroup
  }
  const groupedArr = []
  for (let key of Object.keys(groups)) {
    const matchedGroup = groups[key]
    groupedArr.push({
      index: key,
      group: matchedGroup
    })
  }
  return groupedArr
}
