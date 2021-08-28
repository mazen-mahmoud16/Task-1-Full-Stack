//Requires
const express=require('express');
const mongoose=require('mongoose');
var axios = require("axios").default;

//Schema requires
const Blog = require('./models/blog');
const Movie = require('./models/movie');

//express app
const app=express();

//To connect to database
//const dbURI= "mongodb+srv://mazen:mazen123@cluster0.zpucm.mongodb.net/test?retryWrites=true&w=majority";
const dbURI="mongodb://mazen:mazen123@cluster0-shard-00-00.yrupk.mongodb.net:27017,cluster0-shard-00-01.yrupk.mongodb.net:27017,cluster0-shard-00-02.yrupk.mongodb.net:27017/test?ssl=true&replicaSet=atlas-rhz5s1-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));



// register view engine
app.set('view engine', 'ejs');


//API connection
var options = {
    method: 'GET',
    url: 'https://shazam.p.rapidapi.com/songs/list-artist-top-tracks',
    params: {id: '40008598', locale: 'en-US'},
    headers: {
        'x-rapidapi-host': 'shazam.p.rapidapi.com',
        'x-rapidapi-key': 'a367f94af4msh02172b9cd3059d0p178c34jsn49eb80599274'
    }
};

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//routes
app.get('/',(req,res)=>{
    res.redirect('/blogs');
});

app.get('/about',(req,res)=>{
    res.render('about',{title: 'About'});
});

app.get('/blogs/create',(req,res)=>{
    res.render('create',{title: 'Create a new blog'});
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then(result => {
        res.render('index', { blogs: result, title: 'All blogs' });
        })
        .catch(err => {
        console.log(err);
    });
});


app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch(err => {
            console.log(err);
        });
    });

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then(result => {
        res.redirect('/blogs');
    })
        .catch(err => {
        console.log(err);
    });
});


//Axios request
app.get('/top-tracks',(req,res)=>{
    axios.request(options).then(function (response) {
        let topList = [];
        response.data.tracks.forEach(movie1=>{
            const movie= new Movie({
                title: movie1.title
            });
            movie.save().catch(err => { console.log(err); });
            topList.push(movie1.title);
        })
        res.render('topTracks',{title: 'Test',topList});       
    }).catch(function (error) {
        console.error(error);
    });
})


//404 page
app.use((req, res) => {
    res.status(404).render('404',{title: '404'});
});





/*
app.get('/top-tracks',(req,res)=>{
    axios.request(options).then(function (response) {
        let topList = [];
        response.data.tracks.forEach(movie=>{
            topList.push(movie.title);
        })
        res.render('topTracks',{title: 'Test',topList});       
    }).catch(function (error) {
        console.error(error);
    });
})*/