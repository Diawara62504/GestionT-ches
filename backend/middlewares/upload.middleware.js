const multer = require("multer")
const path = require("path")

// Slugify filename: remove accents, spaces, and unsafe characters
function sanitizeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext);
  const noAccents = base
    .normalize('NFD') // split accents
    .replace(/[\u0300-\u036f]/g, ''); // remove accents
  const slug = noAccents
    .replace(/[^a-zA-Z0-9]+/g, '-') // replace non-alnum by dash
    .replace(/^-+|-+$/g, '') // trim dashes
    .toLowerCase();
  return { slug, ext };
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const { slug, ext } = sanitizeFilename(file.originalname || 'file');
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${slug || 'file'}${ext || ''}`);
  }
});

const upload = multer({ storage: storage })

module.exports = upload