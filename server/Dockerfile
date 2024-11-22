FROM node:18-alpine

WORKDIR /app

# Copier uniquement package.json et package-lock.json pour tirer parti du cache Docker
COPY package*.json ./

# Installer les dépendances avant de copier le reste
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 2000

# Démarrer l'application
CMD ["node", "index.js"]
