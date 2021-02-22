//监听自动更新事件
const { ipcRenderer } = require("electron");

var update = document.getElementById('update');
update.addEventListener('click',function(){
    //发送请求执行自动更新
    ipcRenderer.send("checkForUpdate");
}) 
let len = 5,timer=null;
 ipcRenderer.on("message", (event, text) => {
        console.log(event)
        console.log(text)
        timer=null;
       
        var sp = document.createElement('span');
        sp.style.top=len+'px';
        len+=30
        sp.style.padding="0 20px"
        sp.innerText=text;
        document.getElementById('message').append(sp);
        clearTimeout(timer);
        timer = setTimeout(()=>{
            document.getElementById('message').innerHTML=''
            len=5
        },4000)
});
ipcRenderer.on("downloadProgress", (event, progressObj)=> {
    console.log(progressObj);
    document.getElementById('progress').innerHTML=(progressObj.toFixed(2))+'%'
});
ipcRenderer.on("isUpdateNow", () => {
    document.getElementById('mode').className='active';
    document.getElementById('ok').addEventListener('click',function(){
        ipcRenderer.send("isUpdateNow");
    })
   
});
document.getElementById('cancel').addEventListener('click',function(){
    document.getElementById('mode').className='';
})
window.onunload=function(){
    ipcRenderer.removeAll(["message", "downloadProgress", "isUpdateNow"])
}
//开机启动
document.getElementById('startUp').onclick=function(){
    ipcRenderer.send('startFun',true);
}

//关闭开机启动
document.getElementById('startUpOff').onclick=function(){
    ipcRenderer.send('startFun',false);
}