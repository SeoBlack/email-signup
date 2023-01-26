//jshint esversion: 6

const express     = require('express');
const bodyParser  = require('body-parser');
const request     = require('request');
const https       = require('https')
const listsID     = process.env.LISTSID;
const apiKey      = process.env.APIKEY;

const app = express()
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/signup.html');
})

app.post("/",(req,res)=>{
    const firstName = req.body.fname;
    const lastName  = req.body.lname;
    const email     = req.body.email;

    const data      = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_field:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url      = "https://us21.api.mailchimp.com/3.0/lists/" + listsID;
    const options  = {
        method: "POST",
        auth:"sorin:"

    }
    const request = https.request(url,options , (response)=>{
        console.log(response.statusCode)


        if(response.statusCode >= 200 && response.statusCode <= 299){
            response.on('data',(data)=>{
                if(JSON.parse(data).errors.length === 0)
                    
                    res.sendFile(__dirname + '/success.html');
                else
                    res.sendFile(__dirname + '/failure.html');

            })
            
        }
        else{
            res.sendFile(__dirname + '/failure.html')
        }
    })
    request.write(jsonData);
    request.end();

    
})
app.post('/failure',(req,res)=>{
    res.redirect("/");
})



app.listen(process.env.PORT || 3000,() =>{
    console.log("[+] A connection established")

})