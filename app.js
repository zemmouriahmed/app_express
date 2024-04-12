const express = require('express');
const fs = require('fs');

const path = require('path');
const app = express();
const PORT = 3000;

// Middleware pour vérifier les heures de travail
app.use((req, res, next) => {
    const date = new Date();
    const hour = date.getHours();
    const day = date.getDay();

    if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
        next();
    } else {
        res.sendFile(path.join(__dirname, 'views', 'hors_horaires.html'));
    }
});

// Servir les fichiers statiques du dossier 'public'
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/images-list', (req, res) => {
    const imagesDirectory = path.join(__dirname, 'images'); // Assurez-vous que le chemin est correct
    fs.readdir(imagesDirectory, (err, files) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error accessing images directory.');
            return;
        }
        const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png')); // Filtre pour obtenir uniquement les fichiers images
        res.json(imageFiles);
    });
});
// Route dynamique pour servir les pages HTML
app.get('/:page?', (req, res, next) => {
    const page = req.params.page || 'index';
    const filePath = path.join(__dirname, 'views', `${page}.html`);
    res.sendFile(filePath, err => {
        if (err) {
            next(); // Passe à la gestion des erreurs si le fichier n'existe pas
        }
    });
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    (async () => {
        try {
            const open = (await import('open')).default;
            await open(`http://localhost:${PORT}`);
        } catch (err) {
            console.error("Erreur lors de l'ouverture du navigateur:", err);
        }
    })();
});