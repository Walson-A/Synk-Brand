# Pousser Synk-Brand sur GitHub

Le repo n'a pas encore d'origine distante. Crée-le puis pousse — 3 étapes.

## Option A — avec la CLI GitHub (`gh`), le plus rapide
```bash
cd Synk-Brand
git init -b main
git add .
git commit -m "feat: initial SYNK brand package (logo, animation, tokens)"
gh repo create Walson-A/Synk-Brand --private --source=. --remote=origin --push
```

## Option B — git classique
1. Crée un repo **vide** sur GitHub nommé **`Synk-Brand`** (privé), sans README.
2. Puis :
```bash
cd Synk-Brand
git init -b main
git add .
git commit -m "feat: initial SYNK brand package (logo, animation, tokens)"
git remote add origin https://github.com/Walson-A/Synk-Brand.git
git push -u origin main
```

## Ensuite — consommer depuis le site / l'app
```bash
# dans Synk-Website et Synk-App
npm install github:Walson-A/Synk-Brand
```
Puis voir le `README.md` pour les imports (tokens, composant, logos).

## Publier sur npm (optionnel, plus tard)
Le workflow `.github/workflows/release.yml` publie sur **GitHub Packages** via
Trusted Publishing (OIDC) à chaque push sur `main` où la `version` du
`package.json` change. Aucun token secret à configurer — il faut juste activer
le Trusted Publisher côté npm/GitHub Packages pour ce repo.
