//Requires
const express=require('express');
const mongoose=require('mongoose');
var axios = require("axios").default;
const dotenv=require('dotenv').config();

//Schema requires
const Blog = require('./models/blog');
const Movie = require('./models/movie');

//express app
const app=express();

//To connect to database
const dbURI=process.env.MONGO_DB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(process.env.PORT))
    .catch((err) => console.log(err));



// register view engine
app.set('view engine', 'ejs');


//API connection
var options = {
    method: 'GET',
    url: process.env.API_URL,
    params: {id: '40008598', locale: 'en-US'},
    headers: {
        'x-rapidapi-host': process.env.API_HOST,
        'x-rapidapi-key': process.env.API_KEY
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


