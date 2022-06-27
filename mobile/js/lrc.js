(function($ , root){
    function parseLrc(lrc){
        var lrcs = lrc.split("\n");
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var lrcObj = {};
        lrcs.forEach(function(ele,index){
            var timeStr = ele.match(timeReg);
            var minReg = /\[\d*/;
            var secReg = /\:\d*/;
            var content = ele.replace(timeReg , "");
            if(timeStr != null){
                var min = Number(timeStr[0].match(minReg)[0].slice(1));
                var sec = Number(timeStr[0].match(secReg)[0].slice(1));
                var time = min * 60 + sec;
                lrcObj[time] = content;
            }
           
        });
        return lrcObj;
    }
    root.parseLrc = parseLrc;
})(window.Zepto , window.player || (window.player = {}))