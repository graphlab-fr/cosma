# Plan de dockerisation de Cosma

## Contexte du projet

**Cosma** est un outil CLI (Command Line Interface) de visualisation de graphes de documents écrits en Markdown.

### Architecture technique actuelle

1. **Technologie** : Node.js (nécessite v22+), application CLI distribuée via npm
2. **Point d'entrée principal** : `app.js` (wrapper CLI utilisant Commander.js)
3. **Build system** : Webpack (frontend + backend)
4. **Tests** :
   - Tests unitaires : Jest (`npm run test:unit`)
   - Tests E2E : Cypress (`npm run test:e2e`)
5. **Distribution** : Package npm `@graphlab-fr/cosma` avec un binaire `cosma`

### Gestion de la configuration

La configuration de Cosma repose sur trois fichiers clés :

#### 1. `core/models/config.js`
- Définit la classe `Config` qui gère toutes les configurations
- Utilise **env-paths** pour déterminer le répertoire de données utilisateur :
  ```javascript
  const { data: envPathDataDir } = envPaths('cosma-cli', { suffix: '' });
  static configDirPath = envPathDataDir;
  ```
- Sur Linux : `~/.local/share/cosma-cli/`
- Sur macOS : `~/Library/Application Support/cosma-cli/`
- Sur Windows : `%LOCALAPPDATA%\cosma-cli\Data\`
- Fichier de configuration global par défaut : `defaults.yml` dans ce répertoire
- Fichiers de configuration nommés : `<nom-projet>.yml` dans ce répertoire
- Fichier de configuration local : `config.yml` dans le répertoire d'exécution
- Validation stricte des options avec Joi (schémas de validation)

#### 2. `controllers/user-data-dir.js`
- Fonction `makeUserDataDir()` : crée le répertoire de données utilisateur
- Vérifie l'existence avant création
- Affiche le chemin créé ou existant

#### 3. `controllers/config.js`
- Fonction `makeConfigFile(title, { global })` : crée un fichier de configuration
- Peut créer :
  - Configuration globale par défaut (`defaults.yml`)
  - Configuration globale nommée (`<nom>.yml`)
  - Configuration locale (`config.yml`)
- Propose d'écraser si le fichier existe déjà
- Écrit les fichiers au format YAML

### Problématique

Les tests de configuration actuels peuvent "polluer" la machine de développement en créant des fichiers dans le répertoire utilisateur réel (`~/.local/share/cosma-cli/` sur Linux). Il faut un environnement isolé et reproductible pour :

1. Tester la création du répertoire de données utilisateur
2. Tester la création de fichiers de configuration (globaux et locaux)
3. Tester la lecture et validation des configurations
4. Vérifier que les chemins sont correctement résolus
5. S'assurer que tout fonctionne dans un environnement Linux standard
6. Pouvoir détruire l'environnement après les tests sans laisser de traces

## Objectif

Créer une image Docker de **test et développement** pour Cosma permettant :

1. D'exécuter l'application **localement** dans un environnement Linux isolé et reproductible
2. De tester la création et gestion des fichiers de configuration sans polluer le système hôte
3. D'exécuter les tests (Jest) dans le conteneur pour valider l'application
4. De détruire facilement l'environnement après les tests

Cette image Docker n'est **pas** destinée à la production ou distribution (c'est un test image), mais uniquement au **développement local**.

**Note sur GitHub Actions** : La CI/CD n'a pas besoin d'un Dockerfile supplémentaire. GitHub Actions s'exécute déjà dans une machine virtuelle isolée et jetable. Les tests créés y disparaissent naturellement après.

## Spécifications techniques de l'image Docker

### Image de base
- **Base** : `node:22-alpine` (légère et compatible)
- Alternative acceptable : `node:22-slim` (Debian-based, plus proche de l'environnement de production)

### Structure du Dockerfile

```dockerfile
FROM node:22-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Builder l'application (webpack front + back)
RUN npm run build:front && npm run build:back

# Créer un utilisateur non-root pour les tests
RUN addgroup -S cosmauser && adduser -S cosmauser -G cosmauser
USER cosmauser

# Le répertoire de données utilisateur sera dans /home/cosmauser/.local/share/cosma-cli/
# grâce à env-paths

# Point d'entrée par défaut
ENTRYPOINT ["node", "dist/back.cjs"]
CMD ["--help"]
```

### Variables d'environnement importantes

- `HOME=/home/cosmauser` : définit où env-paths va chercher le répertoire de config
- `NODE_ENV=test` : (optionnel) pour activer le mode test

### Volumes à considérer

Pour les tests, il peut être utile de monter :
- Volume pour les fichiers Markdown de test : `-v ./test-data:/data`
- Volume pour récupérer les exports : `-v ./output:/output`

## Plan d'implémentation

### Étape 1 : Créer le Dockerfile

Créer un fichier `Dockerfile` à la racine du projet avec la structure décrite ci-dessus.

**Points d'attention** :
- Utiliser `npm ci` plutôt que `npm install` pour une installation déterministe
- S'assurer que les scripts de build fonctionnent correctement
- Créer un utilisateur non-root pour éviter les problèmes de permissions
- Ne pas inclure `node_modules/` ni `dist/` dans l'image (ils seront régénérés)

### Étape 2 : Créer un .dockerignore

Créer `.dockerignore` pour optimiser le build :
```
node_modules
dist
.git
.gitignore
*.md
temp
e2e/report
coverage
.DS_Store
```

### Étape 3 : Créer des scripts Docker helper

Créer `docker-compose.yml` ou des scripts shell pour faciliter l'utilisation :

**docker-compose.yml** :
```yaml
version: '3.8'
services:
  cosma-test:
    build: .
    volumes:
      - ./e2e:/app/e2e
      - ./temp:/app/temp
    environment:
      - NODE_ENV=test
```

**Scripts helper** (créer dans `scripts/docker-test.sh`) :
```bash
#!/bin/bash
# Build l'image
docker build -t cosma-test .

# Exécuter les tests unitaires
docker run --rm cosma-test npm run test:unit

# Exécuter un shell interactif pour tester manuellement
docker run --rm -it cosma-test /bin/sh
```

### Étape 4 : Tests de la configuration dans Docker

Créer un fichier de test spécifique pour Docker : `core/models/config.docker.spec.js`

Ce fichier devrait tester :

```javascript
describe('Config in Docker environment', () => {
  test('configDirPath should be in user home directory', () => {
    // Vérifier que Config.configDirPath = /home/cosmauser/.local/share/cosma-cli
  });
  
  test('should create user data directory', () => {
    makeUserDataDir();
    // Vérifier que le répertoire existe
    const fileExists = fs.existsSync(Config.configDirPath);
    expect(fileExists).toBe(true);
  });
  
  test('should create default config file', () => {
    // Appeler makeConfigFile(undefined, { global: true })
    // Vérifier que defaults.yml existe
    // Vérifier le contenu
  });
  
  test('should create named global config file', () => {
    // Appeler makeConfigFile('test-project', { global: true })
    // Vérifier que test-project.yml existe
  });
  
  test('should create local config file', () => {
    // Appeler makeConfigFile(undefined, { global: false })
    // Vérifier que config.yml existe dans le CWD
  });
  
  test('should read and validate config files', () => {
    // Créer un fichier de config
    // Lire avec Config.get()
    // Valider la structure
  });
});
```

### Étape 5 : Documentation d'utilisation

Créer `docs/DOCKER.md` avec :

1. **Build de l'image** :
   ```bash
   docker build -t cosma-test .
   ```

2. **Exécuter Cosma dans le conteneur** :
   ```bash
   docker run --rm cosma-test --version
   docker run --rm cosma-test --help
   ```

3. **Tester la configuration** :
   ```bash
   # Créer le répertoire utilisateur
   docker run --rm cosma-test --create-user-data-dir
   
   # Note: Ceci ne persiste pas après l'arrêt du conteneur
   # Pour persister, utiliser un volume
   ```

4. **Tests avec persistance** :
   ```bash
   # Créer un volume nommé
   docker volume create cosma-test-data
   
   # Utiliser le volume
   docker run --rm -v cosma-test-data:/home/cosmauser/.local/share cosma-test --create-user-data-dir
   ```

5. **Exécuter les tests** :
   ```bash
   # Tests unitaires
   docker run --rm cosma-test npm run test:unit
   
   # Tests spécifiques à la config
   docker run --rm cosma-test npm run test:unit -- config
   ```

6. **Mode interactif pour debugging** :
   ```bash
   docker run --rm -it --entrypoint /bin/sh cosma-test
   # Puis dans le conteneur :
   node dist/back.cjs --create-user-data-dir
   ls -la ~/.local/share/cosma-cli/
   ```

7. **Nettoyage** :
   ```bash
   # Supprimer l'image
   docker rmi cosma-test
   
   # Supprimer le volume
   docker volume rm cosma-test-data
   ```

### Étape 6 : Intégration CI/CD (optionnel)

**Note importante** : GitHub Actions s'exécute déjà dans un environnement isolé et jetable (ubuntu-latest = machine virtuelle Linux). Créer un Dockerfile supplémentaire en CI serait une couche inutile.

**Recommandation** : Donc on garde les mêmes modalités et on utilise des tests directs.

## Checklist d'implémentation

- [ ] Créer `Dockerfile` à la racine
- [ ] Créer `.dockerignore`
- [ ] Vérifier que le build fonctionne : `docker build -t cosma-test .`
- [ ] Tester l'exécution de base : `docker run --rm cosma-test --version`
- [ ] Tester la création du répertoire utilisateur dans le conteneur
- [ ] Tester la création de fichiers de configuration dans le conteneur
- [ ] Créer des tests spécifiques pour Docker (optionnel)
- [ ] Créer `docker-compose.yml` (optionnel)
- [ ] Documenter dans `docs/DOCKER.md`
- [ ] Tester le cycle complet : build → test → destroy
- [ ] Vérifier qu'aucun fichier n'est créé sur la machine hôte

## Notes importantes

1. **Isolation** : Les fichiers créés dans le conteneur ne persistent pas après destruction, sauf si on utilise des volumes
2. **Permissions** : L'utilisateur non-root évite les problèmes de permissions entre le conteneur et l'hôte
3. **Cypress** : Les tests E2E Cypress nécessitent un affichage graphique. Pour Docker, utiliser `cypress run` (headless) ou configurer xvfb
4. **Performance** : Alpine est plus léger mais peut poser des problèmes avec certaines dépendances natives. Si problème, passer à `node:22-slim`
5. **Debug** : Toujours avoir accès à un shell interactif pour débugger : `docker run --rm -it --entrypoint /bin/sh cosma-test`

## Résultat attendu

Une fois implémenté, vous devriez pouvoir :

```bash
# Build
docker build -t cosma-test .

# Test interactif
docker run --rm -it --entrypoint /bin/sh cosma-test
$ node dist/back.cjs --create-user-data-dir
$ node dist/back.cjs config --global
$ ls -la ~/.local/share/cosma-cli/
$ cat ~/.local/share/cosma-cli/defaults.yml
$ exit

# Nettoyage
docker rmi cosma-test

# Aucun fichier créé sur votre machine hôte !
ls ~/.local/share/cosma-cli/  # Doit retourner "No such file or directory" si non existant avant
```