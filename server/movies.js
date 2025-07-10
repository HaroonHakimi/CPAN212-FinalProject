const Movie = require("./models/Movie");
const express = require("express");
const app = express();

const checkAuthenticated = (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
    return next();
  }
  res.redirect("/login");
};

const checkMovieOwner = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found");
    if (movie.userId.toString() === req.session.user._id.toString()) {
      return next();
    }
    res.status(403).send("Unauthorized");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};



app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render("movies/index", { movies });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/movies/add", checkAuthenticated,(req, res) => {
    res.render('movies/add', { formData: {}, errors: [] });
});

app.post("/movies/add", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.redirect("/movies");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    res.render("movies/show", { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/movies/:id/edit", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    res.render("movies/edit", { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/movies/:id/edit", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    res.redirect("/movies");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.delete("/movies/:id/delete", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    res.redirect("/movies");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(8080, () => {
  console.log("Server listening on port 8080", "http://localhost:8080");
});
