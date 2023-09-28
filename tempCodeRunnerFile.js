
const db=getFirestore();
app.get('/signup',function(req,res){
    res.sendFile(__dirname+"/public/"+"sign.html");
})
app.get('/login',function(req,res){
    res.sendFile(__dirname+"/public/"+"logi