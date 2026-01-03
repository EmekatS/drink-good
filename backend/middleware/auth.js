module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  // Optional: log all protected requests
  console.log(`Request from logged-in user: ${req.session.user.username}`);
  next();
};
