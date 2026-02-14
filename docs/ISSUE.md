# Résumé de l’issue GitHub graphlab-fr/cosma#194


## Titre

- **[Bug] Erreur : Impossible de trouver le fichier de configuration depuis /home/USERNAME/.local/share/cosma-cli/defaults.yml** (#194)


## Statut / auteurs / dates / labels (tels qu’affichés)

- **Ouvert**
- Ouvert par **Julianoe** le **9 janvier** (issue indiquée comme « modifiée par Julianoe »)
- **Label** : `bug` (« Quelque chose ne fonctionne pas »)
- **Assignés** : Aucun assigné
- **Type** : Aucun type
- **Projets** : Aucun projet
- **Jalon** : Aucun jalon
- **Relations** : Aucune
- **Développement** : Pas de branches ou de pull requests
- **Participants** : Julianoe, infologie


## Description (champs du formulaire)


### Quelle version de Cosma utilisez-vous ?

- `2.6.0`
- `Node v24.8.0`


### Sur quel(s) système(s) d’exploitation avez-vous observé le bug ?

- macOS
- Windows
- Linux


### Quelle version du système d’exploitation utilisez-vous ?

- `Manjaro 25`


### Actions menant au bug

- « J’ai installé globalement ET essayé aussi avec une installation locale. »
- « J’essaie d’exécuter `cosma config` ou `cosma record` »
- Erreur obtenue :
  - `Error: Can not find config file from /home/USERNAME/.local/share/cosma-cli/defaults.yml`
- Actions de contournement décrites :
  - « J’ai alors créé le dossier et fait un `touch defaults.yml` »
  - « J’ai réessayé. Mais j’ai alors eu l’erreur `Cannot convert undefined or null to object` »
  - « Finalement, j’ai rempli le defaults.yml avec une ligne de texte `test: ok`. Et cela a fonctionné (en local ET en global) »


### Description du bug


- « La documentation ne mentionnait pas la création d’un fichier spécifique ou autre. Je pensais que cela se ferait tout seul. »
- « Tout en bas du log d’erreur, il y avait ceci : » puis un extrait de log :

```text
Error: Can not find config file from /home/USERNAME/.local/share/cosma-cli/defaults.yml.
    at D.get (/home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:1133865)
    at /home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:1968064
    at m.<anonymous> (/home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:1968661)
...
    at m._actionHandler (/home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:174567)
    at /home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:184049
    at m._chainOrCall (/home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:182624)
    at m._parseCommand (/home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:184024)
    at /home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:181409
...
    at m._chainOrCall (/home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:182624)
    at m._dispatchSubcommand (/home/USERNAME/Documents/cosma-test/node_modules/@graphlab-fr/cosma/dist/back.cjs:3:181354)

Node.js v24.8.0

```


### Informations supplémentaires

- « La sortie Node contenait aussi tout le contenu d’un fichier .cjs ou quelque chose comme ça, ce qui était étrange. Ce n’est qu’un extrait. »
- Extrait affiché (tronqué dans l’issue) :

```text
...
];""!==e&&(s=e.split(",").map((t=>t.trim())).filter((t=>""!==t))),""!==n&&(a=n.split(",").map((t=>t.trim())).filter((t=>""!==t)));const l=r.getTypesRecords(),c=s.filter((t=>!l.has(t)));c.length>0&&console.log(["","Warn.",""].join(""),1===c.length?`type "${c[0]}" is`:`types "${c.join('\",\"')}" are`,'not set in the configuration, will treat as "undefined"');const u=et.recordWithTimestamp({title:t,types:s,tags:a},r),h=u.getFileName(),p=_().join(r.opts.files_origin,h),d=()=>o().writeFile(p,u.getFileContent(i),(t=>{!function(){const{dir:t,base:e}=_().parse(p);console.log(["","...
...
```


## Activité (commentaires)


### infologie — 9 janvier

- « Nous avons peut-être accidentellement rendu `defaults.yml` obligatoire. Ce n’est pas une bonne régression pour les nouveaux utilisateurs ou les installations fraîches. Je vais vérifier avec @Myllaume et je reviens vers toi. »


### Julianoe — 13 janvier

- « J’ai réussi à comprendre et à contourner le problème. Mais comme je l’ai dit dans l’autre fil, cela constituerait probablement un blocage total pour la plupart des utilisateurs qui ne sont pas habitués aux incantations runiques de Node et à ses grognements. »
- Mention de l’issue liée :
  - « [Bug] cosma config not creating config.yml in cosma-test #197 »


### infologie — le mois dernier (1)


- « Deux étapes pour corriger cela en attendant un correctif : »
  1. « Sur une installation fraîche, lancez `cosma --create-user-data-dir` si vous n’avez pas encore créé le dossier de données utilisateur. »
  2. « Créez un fichier `defaults.yml` dans ce dossier, avec au moins un paramètre, par exemple : »

```yml
select_origin: 'directory'
```

- « Maintenant la commande `cosma config` devrait à nouveau fonctionner. »


### infologie — le mois dernier (2)

- « En vérifiant cela avec @Myllaume, j’ai redécouvert une fonctionnalité qui simplifie encore plus la procédure, la ramenant à : »
  1. « Lancez `cosma --create-user-data-dir`. »
  2. « Lancez `cosma config --global`. »
- « Quand vous n’ajoutez pas de nom après `--global`, Cosma crée `defaults.yml`. Il est vide, mais cela suffit pour que Cosma arrête de se plaindre et vous pouvez alors utiliser `cosma config` normalement. »


### Julianoe — le mois dernier

- « merci pour les précisions. Cela aidera probablement les personnes qui ont eu le même problème que moi au début 👍 »
