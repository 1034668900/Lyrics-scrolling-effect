
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

// 获取需要用到的 DOM元素
const doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container')
}


/**
 *根据播放器播放的时间计算与之应显示的歌词下标
 *并返回其在lyricArr中的下标index
 *算法：根据当前歌词的时间，与lyricArr中每一项的时间对比，小于其中x处的时间后其下标-1就是当前该显示的歌词
 *如果在0秒时则返回-1，因为0秒时不应该显示歌词
 */
function findHighlightIndex(){
    // 获取当前时间
    let currTime = doms.audio.currentTime
    // 遍历比较lyricArr
    for(let i=0; i<lyricArr.length;i++){
        if(currTime<lyricArr[i].time){
            return i-1
        }
    }

    // 在播放器播放到最后时，时间已经比数组中所有时间都大，此时应显示最后一句歌词
    return lyricArr.length-1
   
}

// 界面

/**
 *创建界面中显示的歌词元素   li
 *
 */
function createLyricElement(){
    // 循环遍历lyricArr
    for(let i=0; i<lyricArr.length;i++){
        let li = document.createElement('li')
        li.textContent = lyricArr[i].words
        // 将li插入ul中
        doms.ul.appendChild(li)// 修改了DOM树
        // 如果要优化可以先创建一个文档片段，将需要添加的li先添加到文档片段中，最后在将文档片段添加到ul中
        /* 
            let frag = document.createDocumentFragment()
            frag.appendChild(li)
            
            最后在循环外再添加文档片段
            ul.appendChild(frag)
        */
        
    }
}

createLyricElement()

// 获取歌词视口高度
let viewHeight = doms.container.clientHeight
// 获取ul高度
let ulHeight = doms.ul.clientHeight
// 获取li的高度
let liHeight = doms.ul.children[0].clientHeight
// 获取偏移量最大值
let maxOffset = ulHeight - viewHeight
/**
 *设置ul的偏移量
 *歌词高亮显示在窗口中心
 */
function setOffset(){
    // 获取需要显示高亮的下标
    let index = findHighlightIndex()
    // 计算偏移量
    let offSet = liHeight*index + liHeight/2 - viewHeight/2
    // 设置偏移量的最小值
    if(offSet < 0){
        offSet = 0
    }
    // 判断最大偏移量
    if(offSet > maxOffset){
        offSet = maxOffset
    }


    // 将偏移量赋值给ul
    doms.ul.style.transform = `translateY(-${offSet}px)`
    
    // 高亮部分
    // 设置前先取消之前设置的active属性
    let li = doms.ul.querySelector('.active')
    if(li){
        li.classList.remove('active')
    }

    // 准备设置高亮
    // li可能不存在
    li = doms.ul.children[index]
    if(li){
    // 设置高亮 --> 为需要高亮的歌词添加active类属性，含active类名的li已在css中设置高亮
    li.classList.add('active')
    }

}

// 监听播放器中时间变化
doms.audio.addEventListener('timeupdate',() => {
    // 时间发生变化后触发的回调
    setOffset()
})