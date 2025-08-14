
# Documentation API Backend Gestion de Tâche

Ce backend permet de gérer des utilisateurs et des tâches avec authentification JWT.

## Base URL

```
http://localhost:3000/
```

---

## Authentification
Toutes les routes protégées nécessitent un token JWT dans l'en-tête :

```
Authorization: Bearer <votre_token>
```

---

## Modèles

### Utilisateur
- pseudo (String, requis)
- email (String, requis, unique, format email)
- password (String, requis, min 6 caractères)
- role ("membre" ou "admin", défaut "membre")

### Tâche
- titre (String, requis)
- description (String, requis)
- priorite ("faible", "moyenne", "haute", défaut "moyenne")
- status ("a faire", "en cours", "fait", défaut "a faire")
- assigne (User, optionnel)
- createdBy (User, requis)

---

## Endpoints

### Authentification

#### Inscription
- **URL** : `/register`
- **Méthode** : `POST`
- **Body** :
```json
{
  "pseudo": "Nom",
  "email": "email@example.com",
  "password": "motdepasse",
  "role": "membre" // optionnel
}
```
- **Réponse** :
```json
{
  "message": "Utilisateur inscrit !",
  "user": { ... }
}
```

#### Connexion
- **URL** : `/login`
- **Méthode** : `POST`
- **Body** :
```json
{
  "email": "email@example.com",
  "password": "motdepasse"
}
```
- **Réponse** :
```json
{
  "token": "...",
  "user": { "id": "...", "email": "..." }
}
```

---

### Tâches (toutes protégées par JWT)

#### Créer une tâche
- **URL** : `/createTask`
- **Méthode** : `POST`
- **Headers** : `Authorization: Bearer <token>`
- **Body** :
```json
{
  "titre": "Titre de la tâche",
  "description": "Description de la tâche",
  "priorite": "faible|moyenne|haute", // optionnel
  "status": "a faire|en cours|fait", // optionnel
  "assigne": "<user_id>" // optionnel
}
```
- **Réponse** :
```json
{
  "_id": "...",
  "titre": "...",
  "description": "...",
  "priorite": "...",
  "status": "...",
  "assigne": { "pseudo": "...", "email": "..." },
  "createdBy": { "pseudo": "...", "email": "..." },
  ...
}
```

#### Récupérer les tâches
- **URL** : `/getTask`
- **Méthode** : `GET`
- **Headers** : `Authorization: Bearer <token>`
- **Query params** :
  - `page` (défaut 1)
  - `limit` (défaut 2)
  - `priorite` (optionnel)
  - `status` (optionnel)
- **Réponse** :
```json
[
  {
    "_id": "...",
    "titre": "...",
    "description": "...",
    "priorite": "...",
    "status": "...",
    "assigne": { "pseudo": "...", "email": "..." },
    "createdBy": { "pseudo": "...", "email": "..." },
    ...
  },
  ...
]
```

#### Modifier une tâche
- **URL** : `/updateTask/:id`
- **Méthode** : `PUT`
- **Headers** : `Authorization: Bearer <token>`
- **Body** :
```json
{
  "titre": "Nouveau titre",
  "description": "Nouvelle description",
  "priorite": "faible|moyenne|haute",
  "status": "a faire|en cours|fait",
  "assigne": "<user_id>"
}
```
- **Réponse** :
```json
{
  "_id": "...",
  "titre": "...",
  "description": "...",
  "priorite": "...",
  "status": "...",
  "assigne": { "pseudo": "...", "email": "..." },
  "createdBy": { "pseudo": "...", "email": "..." },
  ...
}
```

#### Supprimer une tâche
- **URL** : `/deleteTask/:id`
- **Méthode** : `DELETE`
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** :
```json
{
  "message": "Tâche supprimée avec succès !"
}
```

---

## Structure des dossiers
- `controllers/` : Logique métier (auth, tâches)
- `models/` : Schémas Mongoose (utilisateur, tâche)
- `routes/` : Définition des routes API
- `middlewares/` : Middlewares (authentification)
- `config/` : Configuration de la base de données
- `uploads/` : Fichiers uploadés

---

## Démarrer le serveur
1. Installer les dépendances :
   ```
   npm install
   ```
2. Lancer le serveur :
   ```
   node server.js
   ```

---

## Remarques
- Utilisez Postman ou un client HTTP pour tester les endpoints.
- Les erreurs sont retournées au format JSON avec un message explicatif.
- Pour l'authentification, créez d'abord un utilisateur via `/register` puis connectez-vous via `/login` pour obtenir le token.
- Les tâches sont paginées (2 par défaut), filtrables par priorité et statut.
- Seul le créateur ou un admin peut modifier/supprimer une tâche.

---

## Auteur
- Backend développé par Moussoukoura Diawara
