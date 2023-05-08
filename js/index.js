console.log(lyric);
/**
 *解析歌词字符串
 *希望最终获得一个数组，数组里面包含了每句歌词的时间和文字，且以对象保存  ｛time:秒, words:歌词内容｝
 */
function parseLyric(){
    // 准备一个数组，储存每句歌词的数据对象
    let lyricArr = []

    // 以行将歌词字符串分割
    let lines = lyric.split('\n')
    // 遍历 lines 
    for(let i=0;i<lines.length;i++){
        let lineStr = lines[i]
        // 以']'符号分割字符串
        let lineArr = lineStr.split(']')
        // 获得时间串,并去掉串首位的'['  --> 截取字符串
        let timeStr = lineArr[0].substring(1)
        let parseArr = timeStr.split(':')
        // 将 11 : 11.11 格式时间转换为秒
        let parsedTimeSecond = +parseArr[0]*60 + +parseArr[1]
        // 准备歌词对象
        let lyricObj = {
            time: parsedTimeSecond,
            words: lineArr[1]
        }
        lyricArr.push(lyricObj)
    }
    return lyricArr
}

const lyricArr = parseLyric()
console.log(lyricArr);
