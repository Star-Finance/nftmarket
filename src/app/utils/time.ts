/*时间人性化转换 time:日期时间字符串  -----Start*/
export const getTimeTo = (time: string | Date): string => {
    if (!time) {
        return ''
    }

    let createDate = time
    if (typeof time == 'string') {
        createDate = new Date(Date.parse(time.replace(/-/g, '/')))
    }
    const nowDate = new Date()
    const nowDateNum = nowDate.getTime()
    const createDateNum = createDate.getTime()

    const m = parseInt(Math.abs(nowDateNum - createDateNum) / 1000 / 60)
    if (m < 60) {
        if (m < 1) {
            const s = parseInt(Math.abs(nowDateNum - createDateNum) / 1000)
            if (s < 1) return 'Just'
            return parseInt(Math.abs(nowDateNum - createDateNum) / 1000) + ' ' + 'seconds ago'
        } else {
            return m + ' ' + 'minutes ago'
        }
    } else {
        const todayHourMin = Number(nowDate.getHours()) * 60 + Number(nowDate.getMinutes())
        if (m == todayHourMin) {
            return '1 days ago'
        }
        if (m < todayHourMin) {
            return Number(Math.abs(m / 60)).toFixed(0) + ' ' + 'hours ago' //return "今天 " + TimeToHourMin(time);
        } else if (m > todayHourMin && m < Number(todayHourMin) + 24 * 60) {
            return 'yesterday' + ' ' + TimeToHourMin(createDate.format('yyyy/MM/dd HH:mm:ss'))
        }
        // else if (createDate.getFullYear() == nowDate.getFullYear()) {
        //     const month = (createDate.getMonth() + 1 + '').length > 1 ? createDate.getMonth() + 1 : '0' + (createDate.getMonth() + 1)
        //     const day = (createDate.getDate() + '').length > 1 ? createDate.getDate() : '0' + createDate.getDate()
        //     return time //month + "月" + day + "日" + " " + timeToShortTime(time);
        // }
        else {
            return Math.floor(m / 1440) + ' days ago'
        }
    }

    //时间转短时间
    // function timeToShortTime(dateTimeStr) {
    //     if (dateTimeStr.indexOf(' ') > -1) {
    //         const arr = dateTimeStr.split(' ')
    //         return arr[1]
    //     } else {
    //         return dateTimeStr
    //     }
    // }

    //时间转小时分
    function TimeToHourMin(dateTimeStr: string): string {
        if (dateTimeStr.indexOf(' ') > -1) {
            const arr = dateTimeStr.split(' ')
            return arr[1].substring(0, arr[1].length - 3)
        } else {
            return dateTimeStr
        }
    }
}

/*时间人性化转换 time:日期时间字符串  -----Start*/
export const _getTimeTo = (time: string | Date, $t: void): string => {
    if (!time) {
        return ''
    }

    let createDate = time
    if (typeof time == 'string') {
        createDate = new Date(Date.parse(time.replace(/-/g, '/')))
    }
    const nowDate = new Date()
    const nowDateNum = nowDate.getTime()
    const createDateNum = createDate.getTime()

    const m = parseInt(Math.abs(nowDateNum - createDateNum) / 1000 / 60)
    if (m < 60) {
        if (m < 1) {
            const s = parseInt(Math.abs(nowDateNum - createDateNum) / 1000)
            if (s < 1) return $t('just')
            return parseInt(Math.abs(nowDateNum - createDateNum) / 1000) + ' ' + $t('second_ago')
        } else {
            return m + ' ' + $t('minute_ago')
        }
    } else {
        const todayHourMin = Number(nowDate.getHours()) * 60 + Number(nowDate.getMinutes())
        if (m == todayHourMin) {
            return '1 days ago'
        }
        if (m < todayHourMin) {
            const hours = Number(Math.abs(m / 60)).toFixed(0)

            if (Number(hours) > 1) {
                return hours + ' ' + $t('hours_ago')
            }
            return Number(Math.abs(m / 60)).toFixed(0) + ' ' + $t('hour_ago') //return "今天 " + TimeToHourMin(time);
        } else if (m > todayHourMin && m < Number(todayHourMin) + 24 * 60) {
            return $t('yesterday') + ' ' + TimeToHourMin(createDate.format('yyyy/MM/dd HH:mm:ss'))
        }
        // else if (createDate.getFullYear() == nowDate.getFullYear()) {
        //     const month = (createDate.getMonth() + 1 + '').length > 1 ? createDate.getMonth() + 1 : '0' + (createDate.getMonth() + 1)
        //     const day = (createDate.getDate() + '').length > 1 ? createDate.getDate() : '0' + createDate.getDate()
        //     return time //month + "月" + day + "日" + " " + timeToShortTime(time);
        // }
        else {
            return Math.floor(m / 1440) + $t('days_ago')
        }
    }

    //时间转小时分
    function TimeToHourMin(dateTimeStr: string): string {
        if (dateTimeStr.indexOf(' ') > -1) {
            const arr = dateTimeStr.split(' ')
            return arr[1].substring(0, arr[1].length - 3)
        } else {
            return dateTimeStr
        }
    }
}

Date.prototype.format = function (format) {
    const o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'H+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        S: this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (const k in o)
        if (new RegExp('(' + k + ')').test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return format
}
