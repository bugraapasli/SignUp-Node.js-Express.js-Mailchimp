const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const https = require('https');
const { options } = require('request');

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));  // using body-parser module here

app.use(express.static("public"));  // we needed it to use our css and images in our server.

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/signup.html");   //sending our first page 
});

app.post('/', (req,res)=>{
    const firstName = req.body.Fname;
    const lastName = req.body.Lname;
    const eMail = req.body.email;
    
    const data = {
        members: [
            {
                email_address: eMail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);  // I need the data as a string because we'll gonna send the data to mailchip.
    const url = "https://us8.api.mailchimp.com/3.0/lists/f5ea97edff";

    const options = {
        method: "POST",
        auth: "bugrapasli:8617b27385a83b091696fbebdfa1e096-us8"  // mailchimp key and username.
    }

    const request = https.request(url, options, (response)=>{
       
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data)=>{
        console.log(JSON.parse(data));
        });

    });

    request.write(jsonData);
    request.end();

});


app.post("/failure", (req,res)=>{      // redirecting the users to home screen when they failure.
    res.redirect("/");
});

app.post("/success", (req,res) => {     // redirecting the users if they want to go back.
    res.redirect("/");
});

app.listen(port, ()=>{
    console.log('Server is running on port ' + port);
});