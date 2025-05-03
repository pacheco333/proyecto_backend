const express = require('express');
const router = express.Router();
const multer = require('multer')();
const imagenesController = require('../controllers/imagenes.controller');

router.put('/subir/:tabla/:campoId/:id', async (req, res) => {
    const { tabla, campoId, id } = req.params;
    const imagenBase64 = req.body.imagen;

    if (!imagenBase64) {
        return res.status(400).json({ error: 'Se requiere la imagen en base64' });
    }

    try {
        const resultado = await imagenesController.procesarImagen(tabla, campoId, id, imagenBase64);
        res.json(resultado);
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

router.get('/obtener/:tabla/:campoId/:id', async (req, res) => {
    const { tabla, campoId, id } = req.params;

    try {
        const imagen = await imagenesController.procesarImagen(tabla, campoId, id);
        res.json(imagen);
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        res.status(500).json({ error: 'Error al obtener la imagen' });
    }
});

router.delete('/eliminar/:tabla/:campoId/:id', async (req, res) => {
    const { tabla, campoId, id } = req.params;

    try {
        const resultado = await imagenesController.eliminarImagen(tabla, campoId, id);
        res.json(resultado);
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
});

router.post('/insertar/:tabla/:campoId/:id', async (req, res) => {
    const { tabla, campoId, id } = req.params;
    const imagenBase64 = req.body.imagen;

    if (!imagenBase64) {
        return res.status(400).json({ error: 'Se requiere la imagen en base64' });
    }

    try {
        const resultado = await imagenesController.insertarImagen(tabla, campoId, id, imagenBase64);
        res.json(resultado);
    } catch (error) {
        console.error('Error al insertar la imagen:', error);
        res.status(500).json({ error: 'Error al insertar la imagen' });
    }
});

module.exports = router;