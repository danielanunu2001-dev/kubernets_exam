require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3001" }
});

// DB
const { sequelize, User, Book } = require("./db");

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Health route pour Kubernetes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/books", require("./routes/books"));
app.use("/api/loans", require("./routes/loans"));

// Frontend statique
app.use(express.static(path.join(__dirname, "public")));

// Gestion erreurs
app.use((err, req, res, next) => {
  console.error("❗ Erreur serveur :", err);
  res.status(err.status || 500).json({ error: err.message || "Erreur serveur" });
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("✅ Client connecté:", socket.id);
});

app.set("io", io);

const PORT = process.env.PORT || 3000;

/* ------------------ Seeds ------------------ */
async function seedAdmin() {
  const emailAdmin = "admin@biblio.com";
  const existingAdmin = await User.findOne({ where: { email: emailAdmin } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      nom: "Admin",
      prenom: "Biblio",
      age: 30,
      ecole: "Université Fès",
      email: emailAdmin,
      password: hashedPassword,
      role: "admin"
    });
    console.log("👤 Administrateur principal créé :", emailAdmin);
  } else {
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("🔒 Administrateur principal rétabli :", emailAdmin);
    } else {
      console.log("👤 Administrateur principal déjà présent :", emailAdmin);
    }
  }
}

async function seedBooks() {
  const booksCount = await Book.count();
  if (booksCount === 0) {
    await Book.bulkCreate([
      {
        titre: "Le Petit Prince",
        auteur: "Antoine de Saint-Exupéry",
        edition: "Gallimard",
        isbn_13: "9782070612758",
        coverId: 8231851
      },
      {
        titre: "1984",
        auteur: "George Orwell",
        edition: "Secker & Warburg",
        isbn_13: "9780451524935",
        coverId: 7222246
      },
      {
        titre: "L’Étranger",
        auteur: "Albert Camus",
        edition: "Gallimard",
        isbn_13: "9782070360024",
        coverId: 9251234
      }
    ]);
    console.log("📘 Livres ajoutés à la base");
  } else {
    console.log(`📚 ${booksCount} livres déjà présents en base`);
  }
}

/* ------------------ Démarrage ------------------ */
/* ------------------ Démarrage ------------------ */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion DB réussie");

    // ⚠️ force:true = recrée les tables selon les modèles (ajoute la colonne statut)
    await sequelize.sync({ force: true });
    console.log("📚 Tables synchronisées");

    await seedAdmin();
    await seedBooks();

    server.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erreur démarrage :", err);
    process.exit(1);
  }
})();
