const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const Movie = require('./models/Movie');
const User = require('./models/User');

const app = express();

// MongoDB Connection
const mongoUri = "mongodb+srv://admin:<admin>@cluster0.njdz2nl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// View engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get('/', (req, res) => {
  res.redirect('/movies');
});

// Movie routes
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('movies/index', { movies });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/movies/add', (req, res) => {
    res.render('movies/add');
});

app.post('/movies/add', async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.redirect('/movies');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.render('movies/show', { movie });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/movies/:id/edit', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.render('movies/edit', { movie });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/movies/:id/edit', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.redirect('/movies');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.delete('/movies/:id/delete', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.redirect('/movies');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Auth routes
app.get('/register', (req, res) => {
    res.render('auth/register');
});

app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Registration failed');
    }
});

app.get('/login', (req, res) => {
    res.render('auth/login');
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && user.password === req.body.password) {
            req.session.userId = user._id;
            res.redirect('/movies');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Login failed');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 