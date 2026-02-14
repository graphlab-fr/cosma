FROM node:22-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances (--ignore-scripts pour éviter que prepare ne lance le build)
RUN npm ci --ignore-scripts

# Copier le code source
COPY . .

# Builder l'application (webpack front + back)
RUN ./node_modules/.bin/webpack build --config ./webpack-front.config.mjs --mode development
RUN ./node_modules/.bin/webpack build --config ./webpack-back.config.mjs --mode development

# Créer un utilisateur non-root pour les tests
RUN addgroup -S cosmauser && adduser -S cosmauser -G cosmauser

# Donner les permissions à l'utilisateur sur le répertoire de travail
RUN chown -R cosmauser:cosmauser /app

USER cosmauser

# Le répertoire de données utilisateur sera dans /home/cosmauser/.local/share/cosma-cli/
# grâce à env-paths

# Point d'entrée par défaut
ENTRYPOINT ["node", "dist/back.cjs"]
CMD ["--help"]
