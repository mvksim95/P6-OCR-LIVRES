const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// définition des types MIME autorisé
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

// utilise memoryStorage plutot que diskStorage pour garder le fichier temporairement en RAM
const storage = multer.memoryStorage();

// middleware Multer
const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        // Vérifie le type MIME de l'image
        const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(new Error('Format d\'image non supporté '), false);
        }
        callback(null, true);
    },
}).single('image');

// middleware pour traiter et optimiser l'image avec Sharp (greencode)
const processImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    try {
        // définis le répertoire de destination
        const outputDir = path.join(__dirname, '../images');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // 
        // nom de fichier unique
        const fileName = `${Date.now()}-${req.file.originalname.split(' ').join('_')}.webp`;
        const outputPath = path.join(outputDir, fileName);

        // traite l'image avec Sharp
        await sharp(req.file.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile(outputPath);

        // ajoute les informations du fichier traité à `req.file`
        req.file.filename = fileName;
        req.file.path = outputPath;

        next();
    } catch (error) {
        console.error('Erreur lors du traitement de l\'image avec Sharp :', error);
        res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
    }
};

module.exports = { upload, processImage };
