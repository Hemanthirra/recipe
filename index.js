const express=require('express');
const path=require('path');
const app=express();
const port =process.env.PORT||5000;
const passwordHash = require('password-hash');
const bodyParser = require('body-parser')
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount)
});
const db=getFirestore();
app.get('/signup',function(req,res){
    res.sendFile(__dirname+"/public/"+"sign.html");
})
app.get('/login',function(req,res){
    res.sendFile(__dirname+"/public/"+"login.html");
})
app.get('/recipe',function(req,res){
    res.sendFile(__dirname+"/public/"+"recipe.html");
})
app.post('/signupsubmit',function(req,res){
    var hashedPassword = passwordHash.generate(req.body.password);
    db.collection('signup_page')
      .where('Email','==',req.body.email)
      .get()
      .then((docs) => {
        if(docs.size > 0){
            res.send("hey ,your account is already exists in the Database");
            
        }
        else{
    db.collection('signup_page').add({
        FirstName:req.body.firstname,
        LastName:req.body.lastname,
        Email:req.body.email,
        Password:hashedPassword,
        conformpassword:req.body.confirmpassword,
    })
    .then(()=>
    {
        res.send("<h2>Signup successful <a href=\"login.html\">Login</a></h2>");
    });
}
});
});
app.post('/loginsubmit',function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    var dataPres = false; 
    db.collection('signup_page').get().then((docs) => {
        docs.forEach((doc) => {
            if ( email== doc.data().Email && password == doc.data().Password) {
                
                dataPres = true;
            }
        });
        if (dataPres) {
            res.send("<h2>data present in Firebase.if you want go through my recipe dashboard <a href=\"recipe.html\">click here</a></h2>");
        } else {
            res.send("data not present in Firebase, please login");
        }
    });
});
app.listen(5000,function(){
  console.log("listening to the server on http://localhost:5000/signup")
})
// const express = require('express');
// const path = require('path');
// const app = express();
// const port = process.env.PORT || 5000;
// const passwordHash = require('password-hash');
// const bodyParser = require('body-parser');
// const { initializeApp, cert } = require('firebase-admin/app');
// const { getFirestore, query, where } = require('firebase-admin/firestore');
// var serviceAccount = require("./key.json");

// initializeApp({
//   credential: cert(serviceAccount)
// });

// const db = getFirestore();
// app.set('view engine', 'ejs');
// app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/signup', function (req, res) {
//   res.sendFile(__dirname + "/public/" + "sign.html");
// });

// app.get('/login', function (req, res) {
//   res.sendFile(__dirname + "/public/" + "login.html");
// });

// app.get('/recipe', function (req, res) {
//   res.sendFile(__dirname + "/public/" + "recipe.html");
// });

// app.post('/signupsubmit', function (req, res) {
//   const hashedPassword = passwordHash.generate(req.body.password);
//   db.collection('signup_page').add({
//     FirstName: req.body.firstname,
//     LastName: req.body.lastname,
//     Email: req.body.email,
//     Password: hashedPassword,
//     ConformPassword: req.body.confirmpassword, // Fixed typo here
//   })
//     .then(() => {
//       res.send("<h2>Signup successful <a href=\"login.html\">Login</a></h2>");
//     })
//     .catch((error) => {
//       res.status(500).send("Error: " + error.message);
//     });
// });

// app.post('/loginsubmit', function (req, res) {
//   const email = req.body.email;
//   const password = req.body.password;
//   let dataPres = false;
  
//   // Query the database to find the user with the given email
//   const userRef = db.collection('signup_page');
//   const q = query(userRef, where('Email', '==', email));
  
//   db.collection('signup_page').get(q).then((docs) => {
//     docs.forEach((doc) => {
//       const storedHashedPassword = doc.data().Password;
//       if (passwordHash.verify(password, storedHashedPassword)) {
//         dataPres = true;
//       }
//     });

//     if (dataPres) {
//       res.send("<h2>Data present in Firebase. If you want to go to my recipe dashboard, <a href=\"recipe.html\">click here</a></h2>");
//     } else {
//       res.send("Data not present in Firebase, please login");
//     }
//   })
//   .catch((error) => {
//     res.status(500).send("Error: " + error.message);
//   });
// });

// app.listen(port, function () {
//   console.log(`Listening to the server on http://localhost:${port}`);
// });
