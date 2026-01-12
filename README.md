# 🚀 Portfolio - Théo Belland

Portfolio personnel développé avec React + Vite, présentant mes projets et compétences en développement Full Stack.

## 🌐 Site en ligne

**URL** : [theobelland.fr](https://theobelland.fr)

## ✨ Fonctionnalités

### Frontend Public
- 🎨 Design moderne avec animations fluides
- 📱 Responsive (mobile, tablette, desktop)
- 🔄 Loader animé au démarrage
- 🍪 Gestion du consentement cookies
- 💼 Présentation des projets avec slider
- 🛠️ Affichage des technologies/compétences
- 📧 Formulaire de contact

### Panel Admin
- 🔐 Authentification sécurisée (JWT)
- ✏️ Gestion complète des projets (CRUD)
- 🔧 Gestion des technologies
- 📊 Dashboard administrateur
- 🔗 Import automatique depuis GitHub
- 📸 Upload d'images multiples

## 🛠️ Stack Technique

### Frontend
- **Framework** : React 18
- **Build Tool** : Vite 4.5
- **Routing** : React Router DOM
- **Styling** : SCSS + CSS Modules
- **Icons** : React Icons
- **Slider** : Swiper

### Backend
- **Runtime** : Node.js + Express
- **Base de données** : JSON (fichiers)
- **Upload** : Multer
- **Auth** : JWT (jsonwebtoken)
- **CORS** : CORS middleware
- **Process Manager** : PM2

### Déploiement
- **Hébergement** : VPS Linux
- **Serveur Web** : Nginx
- **Domain** : theobelland.fr
- **SSL** : Certbot (Let's Encrypt)

## 📦 Installation

### Prérequis
- Node.js >= 16
- npm ou yarn

### Frontend
```bash
# Cloner le repository
git clone https://github.com/votre-username/portfolio-vite.git
cd portfolio-vite

# Installer les dépendances
npm install

# Créer le fichier .env
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Lancer en développement
npm run dev

# Build pour production
npm run build
```

### Backend
```bash
# Aller dans le dossier serveur
cd server

# Installer les dépendances
npm install

# Créer le fichier .env
echo "PORT=5000" > .env
echo "JWT_SECRET=votre_secret_jwt" >> .env
echo "GITHUB_TOKEN=votre_github_token" >> .env

# Lancer le serveur
npm start

# Ou avec PM2
pm2 start server.js --name portfolio-server
```

## 🌳 Structure du projet

```
portfolio-vite/
├── src/
│   ├── components/        # Composants React
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   └── CookieConsent.jsx
│   ├── pages/             # Pages de l'application
│   │   ├── Home.jsx
│   │   ├── Admin.jsx
│   │   ├── AddProject.jsx
│   │   ├── EditProject.jsx
│   │   └── ManageTechnologies.jsx
│   ├── Styles/            # Fichiers SCSS
│   ├── context/           # Context API React
│   └── App.jsx            # Composant principal
│
├── server/
│   ├── routes/            # Routes API
│   │   ├── project.js
│   │   ├── technology.js
│   │   ├── contact.js
│   │   └── admin.js
│   ├── uploads/           # Images uploadées
│   ├── projects.json      # Base de données projets
│   ├── technologies.json  # Base de données technologies
│   └── server.js          # Serveur Express
│
├── public/                # Assets statiques
├── dist/                  # Build de production
└── package.json
```

## 🔧 Configuration

### Variables d'environnement Frontend (.env)
```env
VITE_API_URL=https://theobelland.fr/api
```

### Variables d'environnement Backend (server/.env)
```env
PORT=5000
JWT_SECRET=votre_secret_jwt_securise
GITHUB_TOKEN=ghp_votre_token_github
```

## 📡 API Endpoints

### Publics
- `GET /api/projects` - Liste des projets
- `GET /api/technologies` - Liste des technologies
- `POST /api/contact` - Envoyer un message
- `POST /api/visite` - Enregistrer une visite

### Admin (Auth requise)
- `POST /api/admin/login` - Connexion admin
- `POST /api/projects` - Créer un projet
- `PUT /api/projects/:id` - Modifier un projet
- `DELETE /api/projects/:id` - Supprimer un projet
- `POST /api/projects/import-github` - Import GitHub
- `POST /api/technologies` - Ajouter une technologie
- `DELETE /api/technologies/:id` - Supprimer une technologie

## 🚀 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées de déploiement sur VPS.

## 🎨 Design

- **Palette de couleurs** : Dégradés purple (#a855f7, #c084fc, #e9d7ff)
- **Police** : System fonts (Arial, sans-serif)
- **Animations** : Transitions CSS + keyframes
- **Responsive** : Mobile-first approach

## 🔐 Sécurité

- ✅ JWT pour l'authentification
- ✅ CORS configuré
- ✅ Validation des entrées
- ✅ Protection des routes admin
- ✅ HTTPS (SSL)
- ✅ Sanitization des uploads

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Théo Belland**
- Website : [theobelland.fr](https://theobelland.fr)
- GitHub : [@votre-username](https://github.com/votre-username)
- LinkedIn : [Théo Belland](https://linkedin.com/in/votre-profil)

## 📞 Contact

Pour toute question, vous pouvez me contacter via le formulaire sur [theobelland.fr](https://theobelland.fr) ou par email.

---

⭐ **Star le projet si tu l'aimes !** ⭐
