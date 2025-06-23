import  app  from "./express";

app.get('/movies', (req, res) => {
});

app.get('/movies/add', (req, res) => {
});

app.post('/movies/add', (req, res) => {
});

app.get('/movies/:id', (req, res) => {
});

app.get('/movies/:id/edit', (req, res) => {
});

app.post('/movies/:id/edit', (req, res) => {
});

app.delete('/movies/:id/delete', (req, res) => {
});


app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
