var axios = require("axios").default;
const express=require('express');
const app=express();

app.set('view engine', 'ejs');

app.listen(3000);

var options = {
    method: 'GET',
    url: 'https://shazam.p.rapidapi.com/songs/list-artist-top-tracks',
    params: {id: '40008598', locale: 'en-US'},
    headers: {
        'x-rapidapi-host': 'shazam.p.rapidapi.com',
        'x-rapidapi-key': 'a367f94af4msh02172b9cd3059d0p178c34jsn49eb80599274'
    }
};



axios.request(options).then(function (response) {
    let topList = [];
    app.get('/',(req,res)=>{
        response.data.tracks.forEach(movie=>{
            topList.push(movie.title);
        })
        res.send(response.data);
    });
    
}).catch(function (error) {
	console.error(error);
});