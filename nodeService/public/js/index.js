"use strict";

var btn = document.getElementById('btn');
btn.addEventListener('click',function(){
    begin()
})
//获取省份市区
  async function getCity(callback){
    let res = [];
    await $.ajax({
        method:'post',
        url:'/getCity',
        data:{
            name:'1243'
        },
        success:function(data){
            callback(data)
            res= data
        },
        fail:function(err){
            console.log(err)
        }
    })
    return res;
}
async function begin(){
    let data = await getCity((data)=>{
        console.log(data)
    });
    console.log(data);
}

