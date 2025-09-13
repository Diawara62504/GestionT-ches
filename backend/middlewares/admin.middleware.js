module.exports = function adminOnly(req, res, next) {
  try {
    if (req?.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé !' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Erreur de vérification des droits' });
  }
}