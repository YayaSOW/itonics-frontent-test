# 🚀 Star Wars Fleet — Angular Data Grid

Application Angular single-page qui affiche les vaisseaux Star Wars depuis l'API SWAPI dans un tableau de données interactif et riche en fonctionnalités.

---

## 📦 Stack Technique

| Outil | Version | Pourquoi |
|-------|---------|----------|
| Angular | 19 |
| AG Grid Community | 33+ | Resize natif des colonnes, cellules éditables, scroll virtuel |
| Tailwind CSS | 3 | Style utilitaire, rapide à mettre en place |
| RxJS | 7 | Flux de données asynchrones, appels HTTP, pagination |
| Jasmine / Karma | intégré | Tests unitaires |

---

## ⚙️ Installation & Lancement

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd starwars-grid

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
```

Ouvrir **http://localhost:4200** dans le navigateur.

---

## 🧪 Lancer les Tests

```bash
ng test
```

Un navigateur Karma s'ouvre. Résultat attendu : **6 specs, 0 failures**.

---

## 🌐 API Utilisée

**Miroir SWAPI** — `https://swapi.py4e.com/api/starships/`

> L'URL officielle `swapi.dev` étant parfois instable, le miroir py4e a été utilisé. Il fournit exactement les mêmes données et la même structure de réponse.

Chaque page retourne **10 vaisseaux**. Total : ~37 vaisseaux sur 4 pages.

---

## ✨ Fonctionnalités

### 📊 Tableau de Données
- 10 colonnes affichées : Nom, Modèle, Fabricant, Classe, Équipage, Passagers, Hyperdrive, Longueur, Vitesse Max, Coût
- Toutes les colonnes sont **redimensionnables** en tirant les bords
- Toutes les colonnes sont **triables** en cliquant sur l'en-tête

### 🔄 Infinite Scroll
Le tableau charge **2 pages (20 vaisseaux) au démarrage** pour remplir l'écran, puis charge automatiquement la page suivante quand l'utilisateur scrolle vers le bas.

**Comment ça fonctionne :**
1. AG Grid déclenche l'événement `bodyScrollEnd` quand l'utilisateur atteint le bas
2. `onLoadMore()` dans `AppComponent` est appelée
3. `SwapiService.loadNextPage()` récupère la page suivante
4. Les nouveaux vaisseaux sont **ajoutés** à la liste existante — jamais remplacés

**Aucun loader visible pendant le scroll** — seul `isLoadingMore` (booléen interne) bloque les appels en double. Le chargement initial a son propre indicateur `isLoading` séparé.

**Cache des pages :**
Chaque page chargée est stockée dans une `Map<number, Starship[]>`. Avant tout appel HTTP, le service vérifie si la page est déjà en cache. Si oui, les données sont retournées immédiatement via `of()` sans aucune requête réseau.

### 🔍 Recherche / Filtrage
- Filtrage en temps réel à chaque frappe
- Filtre par **nom** de vaisseau (insensible à la casse)
- Affiche "No results found" quand aucun résultat ne correspond
- Bouton × pour effacer et restaurer la liste complète
- Le filtrage s'applique sur les **données déjà chargées** — aucun appel API supplémentaire

### ✏️ Cellules Éditables
La colonne **Crew** est éditable :
- **Double-cliquer** sur une cellule pour passer en mode édition
- **Entrée** pour confirmer
- **Échap** pour annuler

Les modifications sont stockées dans `SwapiService` via une `Map<string, Partial<Starship>>` où la clé est l'`url` unique du vaisseau.

**Pourquoi dans le service ?**
Le test impose que les modifications soient facilement remplaçables par de vrais appels API plus tard. En gardant les éditions dans le service, remplacer `editedValues.set(...)` par un `http.patch(...)` ne nécessite **aucun changement** dans le composant.

### ⚠️ Gestion des Erreurs
Deux états d'erreur distincts :

| Type d'erreur | Quand | Comportement |
|--------------|-------|-------------|
| Erreur initiale | La page 1 échoue | Message plein écran + bouton Réessayer |
| Erreur de scroll | La page 3+ échoue | Bannière en bas + Réessayer (le tableau reste visible) |

### 📋 Fin de Liste
Quand tous les vaisseaux sont chargés, un message apparaît en bas :
> ✓ All 36 starships loaded

---

## 🏗️ Architecture

```
src/app/
├── components/
│   ├── starship-grid/       → Tableau AG Grid + détection scroll + cellules éditables
│   └── search-bar/          → Champ de recherche avec bouton effacer
├── services/
│   └── swapi.service.ts     → Appels HTTP + pagination + cache + stockage des éditions
├── models/
│   └── starship.model.ts    → Interfaces TypeScript Starship & SwapiResponse
└── app.component.ts         → Orchestrateur : chargement, filtrage, gestion erreurs
```

**Décision d'architecture :** Architecture volontairement simple adaptée à la taille du projet. Un service, deux composants, un modèle. Pas de NgRx ni de patterns sur-ingéniérés — le service est la source de vérité unique et est facilement extensible.

---

## 🔄 Remplacement de SWAPI par une Vraie API

Le service est conçu pour une migration facile :

```typescript
// Actuel — lecture seule depuis SWAPI
private loadPage(pageNumber: number): Observable<Starship[]> {
  return this.http.get<SwapiResponse>(`${this.baseUrl}?page=${pageNumber}`)
    .pipe(map(r => r.results));
}

// Futur — remplacer par votre vrai endpoint
private loadPage(pageNumber: number): Observable<Starship[]> {
  return this.http.get<VotreApiResponse>(`${this.realApiUrl}?page=${pageNumber}`)
    .pipe(map(r => r.data));
}

// Actuel — stockage en mémoire
saveEdit(url: string, field: keyof Starship, value: string): void {
  this.editedValues.set(url, { ...existing, [field]: value });
}

// Futur — envoi vers une vraie API
saveEdit(url: string, field: keyof Starship, value: string): void {
  this.http.patch(`${this.realApiUrl}/${id}`, { [field]: value }).subscribe();
}
```

---

## 🧪 Tests Unitaires

| Test | Fichier | Ce qui est vérifié |
|------|---------|-------------------|
| Page 1 chargée correctement | `swapi.service.spec.ts` | GET HTTP appelé, 1 résultat retourné, `hasMorePages()` est vrai |
| Cache fonctionnel | `swapi.service.spec.ts` | Après chargement page 1, `getAllCachedStarships()` retourne les données sans nouvel appel HTTP |
| Filtrage par nom | `app.component.spec.ts` | "falcon" retourne uniquement le Millennium Falcon |
| Getter allLoaded | `app.component.spec.ts` | Retourne true quand `isLoading=false` et `hasMorePages()=false` |

---

## 📝 Compromis & Limitations Connues

- **La recherche filtre uniquement les données chargées** — SWAPI supporte `?search=` mais cela réinitialiserait la pagination et l'infinite scroll. Le filtrage en mémoire garde une UX cohérente.
- **~36 vaisseaux au total** — SWAPI a un petit jeu de données. L'infinite scroll est fonctionnel mais atteint rapidement la fin de liste.
- **Cache en mémoire** — se réinitialise au rechargement de la page. Pourrait être étendu avec `localStorage` si la persistance est nécessaire.
- **Une seule colonne éditable** — `Crew` a été choisie comme colonne représentative. Le pattern est facilement réplicable sur n'importe quelle colonne en ajoutant `editable: true` dans sa `ColDef`.
