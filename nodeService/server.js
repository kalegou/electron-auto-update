const express = require('express');
const app = express();
app.use(express.static('public')); //监控静态资源
//模拟接口数据
app.post('/getCity',(req,res)=>{
    console.log(req.data)
    setTimeout(()=>{
        return res.json({
            success:true,
            data:{
                provice:'广州',
                city:'深圳'
            }
        })
    },1500)
})
app.post('/getData',(req,res)=>{
    setTimeout(()=>{
        return res.json({
            success:true,
            data:[
                {
                    name:'lt',
                    age:12
                },
                {
                    name:'lt1',
                    age:121
                }
            ]
        })
    })
})

app.listen(2060,()=>{
    console.log('loaclhost:2060')
})
