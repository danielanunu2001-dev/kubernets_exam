// middlewares/isAdmin.js
module.exports = (req, res, next) => {
  if (
    req.user &&
    req.user.role === "admin" &&
    req.user.email === "admin@biblio.com"
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Accès interdit : réservé à l’administrateur principal" });
};
