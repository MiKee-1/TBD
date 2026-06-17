# Progetto Teconologie Basi di Dati
# Database PostgreSQL

Applicazione e-commerce completa sviluppata con Angular (frontend) e Ruby on Rails (backend API).

## Tecnologie Utilizzate

### Backend
- Ruby 3.4.7
- Rails 8.1.1 (API mode)
- PostgreSQL
- JWT per autenticazione
- Pagy per paginazione
- RSpec per testing

### Frontend
- Angular 21
- TypeScript 5.9
- Angular Material 21
- RxJS con Signals

## Prerequisiti Software

- **Ruby:** versione 3.4.7
- **Rails:** versione 8.1.1 (`gem install rails -v 8.1.1`)
- **Node.js:** versione 20.x o superiore
- **npm:** versione 10.x o superiore
- **Angular CLI:** versione 21.x (`npm install -g @angular/cli@21`)
- **PostgreSQL:** versione 14.x o superiore

Verifica versioni:
```bash
ruby -v        # 3.4.7
rails -v       # 8.1.1
node -v        # v20.x.x
npm -v         # 10.x.x
ng version     # 21.x.x
psql --version # 14.x.x
```

## Setup Progetto

### 1. Clone Repository

```bash
git clone https://github.com/MiKee-1/Progetto_Sistemi_Web
cd Progetto_Sistemi_Web
```

### 2. Configurazione Database

Assicurati che PostgreSQL sia in esecuzione e configura le variabili d'ambiente per le credenziali:

```bash
export DATABASE_USER=<tuo_utente_postgres>
export DATABASE_PASSWORD=<tua_password_postgres>
```

### 3. Setup Backend

```bash
cd Backend
bundle install
rails db:create
rails db:migrate
rails db:seed
```

Il seed crea:
- **1 Admin:** `admin@example.com` / `password123`
- **2 Utenti:** `user@example.com` / `password123`, `user2@example.com` / `password123`
- **~50 Prodotti** importati da `Frontend/shop-mock-api/db.json`

### 4. Setup Frontend

```bash
cd Frontend
npm install
```

## Avvio Applicazione

Aprire due terminali separati:

**Terminale 1 — Backend:**
```bash
cd Backend
rails server
```

**Terminale 2 — Frontend:**
```bash
cd Frontend
ng serve
```

- Backend disponibile su: http://localhost:3000
- Frontend disponibile su: http://localhost:4200

---

## Utilizzo Applicazione

### Utente Normale

1. **Registrazione:**
   - Vai su http://localhost:4200/register
   - Compila form: nome, cognome, email, indirizzo, password

2. **Login:**
   - Vai su http://localhost:4200/login
   - Credenziali demo: `user@example.com` / `password123`

3. **Shopping:**
   - Browse prodotti: filtra per titolo, prezzo, ordina
   - Aggiungi al carrello
   - Visualizza carrello: modifica quantità, rimuovi articoli
   - Checkout: compila dati spedizione, conferma ordine
   - Visualizza storico ordini

### Amministratore

1. **Login Admin:**
   - Email: `admin@example.com`
   - Password: `password123`

2. **Dashboard Admin:**
   - Statistiche: ordini totali, revenue, utenti, prodotti, low stock
   - Gestione Prodotti: CRUD completo (crea, modifica, elimina)
   - Gestione Inventario: increment/decrement quantità
   - Visualizzazione Ordini: tutti gli ordini con dettagli
   - Cancellazione Ordini

## Architettura Applicazione

### Modelli Database

```
users
├── id (integer)
├── email (string, unique)
├── password_digest (string) - BCrypt hash
├── first_name (string)
├── last_name (string)
├── address (string)
├── role (string: 'user' | 'admin')
└── timestamps

products
├── id (string, primary key)
├── title (string)
├── description (text)
├── price (decimal)
├── original_price (decimal)
├── sale (boolean)
├── thumbnail (string - URL)
├── tags (json)
├── quantity (integer)
└── timestamps

carts
├── id (integer)
├── user_id (integer, foreign key)
├── expires_at (datetime)
└── timestamps

cart_items
├── id (integer)
├── cart_id (integer, foreign key)
├── product_id (string, foreign key)
├── quantity (integer)
├── unit_price (decimal)
└── timestamps
└── UNIQUE INDEX (cart_id, product_id)

orders
├── id (integer)
├── user_id (integer, foreign key, nullable)
├── customer (json: {firstName, lastName, email})
├── address (json: {street, city, zip})
├── total (decimal)
└── timestamps

order_items
├── id (integer)
├── order_id (integer, foreign key)
├── product_id (string, foreign key)
├── quantity (integer)
├── unit_price (decimal)
└── timestamps
```

## Funzionalità Avanzate Implementate

### 1. Area Amministratore

Dashboard completa con:
- **Statistiche Real-time:**
  - Totale ordini e revenue
  - Conteggio utenti e prodotti
  - Alert prodotti con stock < 10
  - Ultimi 10 ordini recenti

- **Gestione Prodotti CRUD:**
  - Creazione nuovi prodotti
  - Modifica prodotti esistenti
  - Eliminazione prodotti
  - Aggiustamento inventario (+10/-10)

- **Gestione Ordini:**
  - Visualizzazione tutti gli ordini (anche guest)
  - Dettagli completi (customer, indirizzo, prodotti)
  - Cancellazione ordini

- **Protezione:**
  - Backend: `before_action :require_admin!`
  - Frontend: `adminGuard` su route `/admin`

### 2. Filtri avanzati nello storico ordini

Possibilità di eseguire ricerche degli ordini con filtri personalizzati:
- **Ricerca del prodotto per nome**
   - possibilità di cercare uno specifico prodotto per ogni ordine
- **Ricerca per data (inizio e fine)**
   - possibilità di vedere gli ordini a partire da/entro una tale data
- **Spesa minima e massima effettuata nell'ordine**
   - possibilità di vedere gli ordini dove si ha speso almeno/al massimo una somma di denaro

## Testing
 - **Un test su controller e un test su model**

## Troubleshooting

### I prodotti non vengono mostrati

**Causa:** Il database non è stato popolato con il seed.

**Soluzione:**
```bash
cd Backend
rails db:seed

# Verifica che i prodotti siano stati caricati
rails runner "puts Product.count"
```

### Il frontend non si connette al backend

**Causa:** Problemi di CORS o backend non raggiungibile.

**Soluzione:**
1. Verifica che il backend sia in esecuzione su http://localhost:3000
2. Controlla la configurazione in `Frontend/src/app/core/services/product-api.ts`
3. Verifica CORS in `Backend/config/initializers/cors.rb`

### Errore di connessione al database

**Causa:** PostgreSQL non è in esecuzione o le credenziali non sono corrette.

**Soluzione:**
1. Verifica che PostgreSQL sia in esecuzione: `pg_isready`
2. Controlla che le variabili d'ambiente `DATABASE_USER` e `DATABASE_PASSWORD` siano impostate correttamente
3. Verifica la configurazione in `Backend/config/database.yml`
