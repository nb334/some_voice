var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;
var controlmanager;
var audio = new root.audioManager();
var lrcObj = {};
var index = 0;

function bindClick(){
    $scope.on("play:change",function(event,index,flag){ 
        getLrc(songList[index].lrc);     
        audio.setAudioSource(songList[index].audio);
        if(audio.status == "play"||flag){
            audio.play();
            root.processor.start(lrcObj);
        }
        root.processor.renderAllTime(songList[index].duration)
        root.render(songList[index]);
        root.processor.updata(0);
        root.processor.uplrc(lrcObj[0]);
    })
    //移动端click有300ms延迟
    $scope.on("click",".prev-btn",function(){
        index = controlmanager.prev();
        $scope.trigger("play:change",index);
    })
    $scope.on("click",".next-btn",function(){
        index = controlmanager.next();
        $scope.trigger("play:change",index);
    })
    $scope.on("click",".play-btn",function(){
        if(audio.status == "play"){
            audio.pause();
            root.processor.stop();
        }else{
            root.processor.start(lrcObj);
            audio.play();
        }
        $(this).toggleClass("playing");
    })
    $scope.on("click",".list-btn",function(){
        root.playList.show(controlmanager);
    })
}
function bindTouch(){
    var $slidePoint = $scope.find(".slider-point");
    var offset = $scope.find(".pro-wrapper").offset();
    var left = offset.left;
    var width = offset.width;
    //绑定拖拽事件 开始拖拽 ： 取消进度条渲染
    $slidePoint.on("touchstart",function(){
        root.processor.stop();
    }).on("touchmove",function(e){
        //计算拖拽的百分比 更新我们的当前时间和进度条
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if(percent > 1 || percent < 0){
            percent = 0;
        }
        root.processor.updata(percent)
    }).on("touchend",function(e){
        //计算百分百 跳转播放 重新开始进度条渲染 
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if(percent > 1 || percent < 0){
            percent = 0;
        }
        var curDuration = songList[controlmanager.index].duration;
        var curTime = curDuration * percent;
        audio.jumpToplay(curTime);
        if($scope.find(".play-btn").attr("class").indexOf("playing") == -1){
            root.processor.start(lrcObj , percent);
            root.processor.stop();
        }else{
            root.processor.start(lrcObj , percent);
        }
    })
}
function getData(url){
    $.ajax({
        type : "GET",
        url : url,
        success : function(data){
            bindClick();
            bindTouch();
            root.playList.renderList(data);
            controlmanager = new root.controlManager(data.length);
            songList = data;
            $scope.trigger("play:change",0);
        },
        error : function(){
            console.log("error")
        }
    })
}
function getLrc(url){
    $.ajax({
        type : "GET",
        url : url,
        headers:{
            contentType:"application/x-www-form-urlencoded"
        },
        async: false,
        success:function(data){
            lrcObj = root.parseLrc(data)
        }
    })
}
getData("mock/data.json");

