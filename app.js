const express = require('express');
const https = require('https'); // how we'll make a request to an endpoint.
const bodyParser = require('body-parser')
import apiKey from './creds'

const app = express(); // use the express module

app.use(bodyParser.urlencoded({extended: true})) // hey express, 'use' this urlencoded method on bodyParser --now has access to this parsing ability

app.get('/', (req, res) => { // Q: how will i respond to an initial GET request (url entered)?
    res.sendFile(`${__dirname}/index.html`)
})

app.listen(3000, (req, res)=> {
    console.log('server running on port 3000')
})

app.post('/', (req, res)=>{ // we need body parser to be able to parse thru the body of the reques
// we can do this thanks to body-parser. body = the whole item as and {name: value}
 
const query = req.body.cityName
const unit = 'metric'
const URL = `https://api.openweathermap.org/data/2.5/weather?${apiKey}&units=${unit}&q=${query}`
    https.get(URL, (resp)=>{ // using the https's get method. Use resp for response var name.
        resp.on('data', (data)=>{ // request 'data' using the .on() method.
            const weatherData = JSON.parse(data) // unpack it into an object from string (hex, binary, etc... are all considered strings in this context)
            const description = weatherData.weather[0].description
            const city = weatherData.name
            const temperature = weatherData.main.temp
            const icon = weatherData.weather[0].icon // This just the icon code (not the icon itself)...
            const imageURL = 'http://openweathermap.org/img/wn/' + icon + '@2x.png' // ... now u need the url of where it lives on the weather website
            res.write(`<h1>The temperature in ${city} is ${temperature} degrees.</h1>`)
            res.write(`<p>Outside is ${description}.</p>`)
            res.write(`<img src=${imageURL}>`)
            res.send()
            // console.log(temperature) 
            // console.log(description)
            // console.log(req) // huge object of incoming request data from the browser 
        })
    }).on('error', (e)=>{ // .on() even has an error property to tap into.
        console.log(e)
    })
})

// res.sendFile(__dirname + "/index.html") // A: I'll use the response object to send the page. We'll do something different though
 