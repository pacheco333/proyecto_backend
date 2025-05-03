const express = require('express');
const cors = require('cors');
const app = express();
const imagenesRoutes = require('./routes/imagenes.routes');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/imagenes', imagenesRoutes);
app.use('/api/personas', require('./routes/personas.routes'));


module.exports = app;