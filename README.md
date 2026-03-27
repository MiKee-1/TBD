# Progetto_Sistemi_Web
# E-Commerce Full-Stack - Progetto Sistemi Web 2025/2026

Applicazione e-commerce completa sviluppata con Angular (frontend) e Ruby on Rails (backend API).

## Tecnologie Utilizzate

### Backend
- Ruby 3.4.7
- Rails 8.1.1 (API mode)
- SQLite3 (development), PostgreSQL (production recommended)
- JWT per autenticazione
- Pagy per paginazione
- RSpec per testing

### Frontend
- Angular 21
- TypeScript 5.9
- Angular Material 21
- RxJS con Signals

## Prerequisiti Software

### Opzione 1: Con Docker (Raccomandato)

- **Docker:** versione 20.x o superiore
- **Docker Compose:** versione 2.x o superiore

Verifica versioni:
```bash
docker --version          # Docker version 20.x.x o superiore
docker compose version    # Docker Compose version 2.x.x o superiore
```

### Opzione 2: Installazione Manuale

- **Ruby:** versione 3.4.7 
- **Rails:** versione 8.1.1 (`gem install rails -v 8.1.1`)
- **Node.js:** versione 20.x o superiore
- **npm:** versione 10.x o superiore
- **Angular CLI:** versione 21.x (`npm install -g @angular/cli@21`)
- **SQLite3:** (generalmente già incluso in macOS/Linux)

Verifica versioni:
```bash
ruby -v        # 3.4.7
rails -v       # 8.1.1
node -v        # v20.x.x
npm -v         # 10.x.x
ng version     # 21.x.x
```

## Setup Progetto

### 1. Clone Repository

```bash
git clone https://github.com/MiKee-1/Progetto_Sistemi_Web
cd Progetto_Sistemi_Web
```

### 2. Avvio con Docker

#### Step 1: Setup iniziale (solo la prima volta)

```bash
# Build e avvio dei container in background
docker compose up -d --build

# Crea il database e le tabelle per il backend
docker exec progetto_sistemi_web-backend-1 bin/rails db:create
docker exec progetto_sistemi_web-backend-1 bin/rails db:migrate
docker exec progetto_sistemi_web-backend-1 bin/rails db:seed

# Installa le dipendenze del frontend
docker exec progetto_sistemi_web-frontend-1 npm install

# Ferma i container
docker compose down
```

Il seed crea:
- **1 Admin:** `admin@example.com` / `password123`
- **2 Utenti:** `user@example.com` / `password123`, `user2@example.com` / `password123`
- **~50 Prodotti** importati da `Frontend/shop-mock-api/db.json`

#### Step 2: Avvio applicazione

```bash
# Build delle immagini e avvio dei container (in modalità attached per vedere i log)
docker compose up --build
```

**Nota:** Al primo avvio, attendi che Angular compili completamente (vedrai "Compiled successfully" nei log).

Questo comando:
- Compila le immagini Docker per backend e frontend
- Avvia i container in modalità attached (vedrai i log)
- Il backend sarà disponibile su: http://localhost:3000
- Il frontend sarà disponibile su: http://localhost:4200

#### Step 3: Verifica installazione

Apri il browser su http://localhost:4200 - dovresti vedere la homepage con i prodotti caricati.

#### Comandi Docker Utili

```bash
# Avvio container in background (dopo il primo build)
docker compose up -d

# Avvio con rebuild delle immagini
docker compose up --build

# Stop dei container
docker compose down

# Stop e rimuovi volumi
docker compose down -v

# Visualizza log
docker compose logs -f

# Riavvia un singolo servizio
docker compose restart backend
docker compose restart frontend

# Accedi alla shell del container backend
docker exec -it progetto_sistemi_web-backend-1 bash

# Esegui comandi Rails
docker exec progetto_sistemi_web-backend-1 bin/rails console
docker exec progetto_sistemi_web-backend-1 bin/rails routes
docker exec progetto_sistemi_web-backend-1 bin/rails db:reset

# Esegui comandi npm nel frontend
docker exec progetto_sistemi_web-frontend-1 npm install
docker exec progetto_sistemi_web-frontend-1 npm run build
```


#### Comando per aggiungere un ordine da console ruby:
```ruby
product = Product.first  # oppure Product.find("id-del-prodotto")
order = Order.create!(
  customer: { "firstName" => "Mario", "lastName" => "Rossi", "email" => "mario@test.com" },
  address:  { "street" => "Via Roma 1", "city" => "Milano", "zip" => "20100" },
  total:    product.price,
  order_items_attributes: [
    { product_id: product.id, quantity: 1, unit_price: product.price }
  ]
)

order.update_column(:creatred_at, 3.days_ago)
```

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

### 2. Filtri avanzati nell'o storico ordini

Possibilità di eseguire ricerche degli ordini con filtri personalizzati
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
# Con Docker
docker exec progetto_sistemi_web-backend-1 bin/rails db:seed

# Verifica che i prodotti siano stati caricati
docker exec progetto_sistemi_web-backend-1 bin/rails runner "puts Product.count"

# Manuale
cd Backend
rails db:seed
```

### Errore "Mock data file not found"

**Causa:** Il container backend non riesce a trovare il file `Frontend/shop-mock-api/db.json`.

**Soluzione:** Verifica che il file esista e che il volume sia montato correttamente in `docker-compose.yml`:
```yaml
volumes:
  - ./Backend:/rails
  - ./Frontend:/Frontend:ro  # Questa riga deve essere presente
```

Se hai modificato il `docker-compose.yml`, riavvia i container:
```bash
docker compose down
docker compose up --build
```

### Il frontend non si connette al backend

**Causa:** Problemi di CORS o backend non raggiungibile.

**Soluzione:**
1. Verifica che il backend sia in esecuzione su http://localhost:3000
2. Controlla la configurazione in `Frontend/src/app/core/services/product-api.ts`
3. Verifica CORS in `Backend/config/initializers/cors.rb`

### Permessi negati su Docker

**Causa:** File creati dal container Docker potrebbero avere permessi diversi dall'utente host.

**Soluzione:**
La configurazione Docker è stata ottimizzata per gestire automaticamente i permessi. Se riscontri ancora problemi:

```bash
# Ferma i container
docker compose down

# Ripristina proprietà corretta sui file host
sudo chown -R $USER:$USER Backend Frontend

# Rimuovi i volumi e ricrea
docker compose down -v
docker compose up --build
```

Se i problemi persistono, puoi modificare i permessi dei file locali:
```bash
chmod -R 755 Backend Frontend
```

### Backend "già in esecuzione"
Può capitare di chiudere docker forzatamente premendo "ctrl+c" due volte di fila.
Consiglio di terminare i container **premendo UNA volta ctrl+c**, oppure con:
```bash
docker compose down
```

Se dovesse accadere un errore simile:
```bash
backend-1   | => Booting Puma
backend-1   | => Rails 8.1.1 application starting in development 
backend-1   | => Run `bin/rails server --help` for more startup options
backend-1   | A server is already running (pid: 1, file: /rails/tmp/pids/server.pid).
backend-1   | Exiting
backend-1 exited with code 1
```
Bisognerà eliminare il file server.pid
```bash
#terminiamo i container
docker compose down

#eliminiamo il file pid contenente il backend "fantasma"
sudo rm Backend/tmp/pids/server.pid

#riavviamo docker
docker compose up --build
````
