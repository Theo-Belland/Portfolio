# 📦 Guide de déploiement - Portfolio Théo Belland

## 🚀 Fichiers à envoyer sur le serveur

### 1️⃣ Nouveaux fichiers créés

Ces fichiers doivent être créés sur le serveur :

```
src/components/Loader.jsx
src/components/CookieConsent.jsx
src/Styles/loader.scss
src/Styles/cookie.scss
```

### 2️⃣ Fichiers modifiés

Ces fichiers ont été modifiés et doivent remplacer les anciens :

```
src/App.jsx
src/pages/managementProject.jsx
src/Styles/add-project.scss
src/Styles/technologies.scss
src/Styles/managementProj.scss
```

### 3️⃣ Dossier dist/ (OBLIGATOIRE)

Remplacer complètement le dossier `dist/` sur le serveur par le nouveau.

---

## 📋 Étapes de déploiement

### Option 1 : Déploiement complet (recommandé)

```bash
# Sur ton PC, dans le dossier du projet
npm run build

# Envoyer via FTP/SFTP vers /var/www/portfolio/
# Remplacer :
- Tout le dossier dist/
- Les fichiers sources listés ci-dessus
```

### Option 2 : Déploiement dist uniquement (rapide)

```bash
# 1. Build local
npm run build

# 2. Via SFTP vers le serveur
cd /var/www/portfolio/
# Supprimer l'ancien dist/
rm -rf dist/
# Uploader le nouveau dist/
```

### Option 3 : Build direct sur le serveur

```bash
# Se connecter au serveur VPS
ssh user@theobelland.fr

# Aller dans le dossier
cd /var/www/portfolio/

# Uploader les fichiers sources modifiés

# Installer les dépendances (si nécessaire)
npm install

# Build
npm run build

# Redémarrer le serveur backend
pm2 restart portfolio-server
```

---

## ✅ Nouvelles fonctionnalités ajoutées

### 🔄 Écran de chargement (2.5 secondes)

- Spinner animé avec anneaux tournants
- Effet gradient purple
- Barre de progression
- Animation fluide au démarrage

### 🍪 Bandeau de consentement cookies

- Apparaît en bas après le chargement
- Boutons Accepter/Refuser
- Sauvegarde du choix dans localStorage
- Design responsive

### 🎨 Améliorations CSS

- Formulaires Add/Edit redesignés
- Sélecteur de technologies en grille
- Page technologies avec layout 3 colonnes
- Meilleurs espacements (plus de débordement)
- Correction du footer (plus de chevauchement)

### 🔗 Bouton import GitHub

- Ajouté dans la page de gestion des projets
- Permet d'importer les repos GitHub automatiquement
- Message de statut (loading/succès/erreur)

---

## 🔍 Vérifications après déploiement

1. ✅ Le loader s'affiche pendant 2.5 secondes au chargement
2. ✅ Le bandeau cookies apparaît après le loader
3. ✅ Les formulaires Add/Edit ne débordent plus du cadre
4. ✅ La page technologies affiche 3 colonnes (desktop)
5. ✅ Le bouton "Importer depuis GitHub" est visible
6. ✅ Le footer ne chevauche plus le contenu

---

## 🛠️ Commandes utiles sur le serveur

```bash
# Voir les logs du serveur
pm2 logs portfolio-server

# Redémarrer le serveur
pm2 restart portfolio-server

# Vérifier le statut
pm2 status

# Voir les processus
pm2 list
```

---

## 📱 URLs à tester

- **Frontend** : https://theobelland.fr
- **Admin** : https://theobelland.fr/admin
- **API** : https://theobelland.fr/api/projects

---

## 🐛 En cas de problème

### Le loader ne s'affiche pas

→ Vérifier que `dist/` a bien été remplacé et vider le cache du navigateur (Ctrl+Shift+R)

### Le bandeau cookies ne s'affiche pas

→ Vider le localStorage : F12 → Application → Local Storage → Supprimer "cookieConsent"

### Les projets ne se chargent pas

→ Vérifier les logs du serveur backend : `pm2 logs`

### CSS cassé / ancien design

→ Vider le cache : Ctrl+Shift+R ou mode navigation privée

---

## 📝 Notes importantes

- Le fichier `.env` côté serveur doit toujours contenir :

  ```
  VITE_API_URL=https://theobelland.fr/api
  ```

- Les fallback URLs sont maintenant intégrés dans le code, donc même si le `.env` est mal configuré, le site utilisera automatiquement `https://theobelland.fr/api`

- Le build génère environ **519 kB** de JavaScript (compressé : 168 kB)

---

✨ **Déploiement réalisé le 12 janvier 2026**
