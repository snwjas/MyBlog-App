/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      obj[name] = v.substring(index + 1, v.length)
    }
  })
  return obj
}

/**
 * @param jsonObj
 * @returns {FormData}
 */
export function jsonObj2FormData(jsonObj) {
  const formData = new FormData()
  Object.keys(jsonObj).forEach((key) => {
    formData.append(key, jsonObj[key])
  })
  return formData
}

/**
 * 随机hsl颜色
 * @returns {string}
 * @constructor
 */
export function randomColor() {
  return 'rgb(' +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ')'
}

/**
 * 获取随机el-tag标签样式
 * @returns {string}
 */
export function randomTagType() {
  const tagType = ['', 'info', 'success', 'warning', 'danger']
  return tagType[Math.floor(Math.random() * tagType.length)]
}

/**
 * HTML 转义
 * @param {String} sHtml
 * @return {String}
 */
export function html2Escape(sHtml) {
  return sHtml.replace(/[<>&"]/g, function(c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]
  })
}

/**
 * HTML 反转义
 * @param {String} str
 * @return {String}
 */
export function escape2Html(str) {
  const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
    return arrEntities[t]
  })
}

export function tryCopyDomText(element) {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange()
    range.moveToElementText(element)
    range.select()
  } else if (window.getSelection) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    console.error('select dom err')
  }
  document.execCommand('copy', false, null) // 过去方法
}

/**
 * 深拷贝
 * @param target
 * @return {{}}
 */
export function deepClone(target) {
  // 定义一个变量
  let result
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = [] // 将result赋值为一个数组，并且执行遍历
      for (const i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {}
      for (const i in target) {
        result[i] = deepClone(target[i])
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target
  }
  // 返回最终结果
  return result
}

/**
 * 滚动到元素
 * @param {String|Element} target
 */
export function scrollToElement(target) {
  const $elem = target && typeof target === 'string'
    ? target.startsWith('#') ? document.getElementById(target.substring(1, target.length)) : document.querySelector(target)
    : target
  if ($elem) {
    $elem.scrollIntoView({ behavior: 'smooth' })
  }
}
