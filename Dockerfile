FROM node:22-alpine

# Créer un utilisateur non-root avant les copies
RUN addgroup -S cosmauser && adduser -S cosmauser -G cosmauser

# Définir le répertoire de travail et le rendre accessible à cosmauser
WORKDIR /app
RUN chown cosmauser:cosmauser /app

# Copier les fichiers de dépendances avec permissions directes
COPY --chown=cosmauser:cosmauser package.json package-lock.json* ./

# Installer les dépendances (--ignore-scripts pour éviter que prepare ne lance le build)
RUN npm ci --ignore-scripts

# Copier le code source avec permissions directes
COPY --chown=cosmauser:cosmauser . .

# Builder l'application (webpack front + back)
RUN ./node_modules/.bin/webpack build --config ./webpack-front.config.mjs --mode development
RUN ./node_modules/.bin/webpack build --config ./webpack-back.config.mjs --mode development

# Créer le répertoire de données utilisateur avec les bonnes permissions
RUN mkdir -p /home/cosmauser/.local/share && \
    chown -R cosmauser:cosmauser /home/cosmauser/.local

# Basculer vers l'utilisateur non-root
# À partir d'ici, cosmauser a :
# - Accès en écriture à /app (pour config.yml en mode local)
# - Accès en écriture à /home/cosmauser/.local/share (pour --global et user data dir)
USER cosmauser

# Le répertoire de données utilisateur sera dans /home/cosmauser/.local/share/cosma-cli/
# grâce à env-paths

# Point d'entrée par défaut
ENTRYPOINT ["node", "dist/back.cjs"]
CMD ["--help"]
