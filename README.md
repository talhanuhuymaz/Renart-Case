# Renart Case - Ring E-commerce Application

Bu proje, yüzük satışı için geliştirilmiş bir e-ticaret uygulamasıdır. Backend Express.js ile, frontend React ile geliştirilmiştir.

## 📁 Proje Yapısı

```
Renart-Case/
├── backend/           # Express.js backend server
│   ├── index.js       # Ana server dosyası
│   ├── products.json  # Ürün verileri
│   ├── package.json   # Backend bağımlılıkları
│   └── node_modules/  # Backend paketleri
├── frontend/          # React frontend uygulaması
│   ├── src/           # React kaynak dosyaları
│   ├── public/        # Statik dosyalar
│   ├── package.json   # Frontend bağımlılıkları
│   └── node_modules/  # Frontend paketleri
├── package.json       # Root seviye script'ler
└── README.md          # Bu dosya
```

## 🚀 Kurulum ve Çalıştırma

### Tüm Bağımlılıkları Yükleme

```bash
npm run install:all
```

### Geliştirme Modunda Çalıştırma (Backend + Frontend)

```bash
npm run dev
```

### Sadece Backend Çalıştırma

```bash
npm run backend:dev
```

### Sadece Frontend Çalıştırma

```bash
npm run frontend:dev
```

## 🔧 Özellikler

### Backend (Port 5000)

- Express.js server
- CORS desteği
- Altın fiyatı API entegrasyonu (GoldAPI)
- Ürün listesi endpoint'i (`/products`)
- Dinamik fiyat hesaplama

### Frontend (Port 3000)

- React uygulaması
- Axios ile API çağrıları
- Responsive tasarım
- Ürün listesi görüntüleme
- Yüzük görselleri

## 📡 API Endpoints

### GET /products

Tüm yüzüklerin listesini döner. Her ürün için:

- İsim
- Popülerlik skoru (0-1)
- Ağırlık (gram)
- Hesaplanmış fiyat (USD)
- Popülerlik değeri (0-5)
- Görseller (sarı, pembe, beyaz altın)

## 🛠 Teknolojiler

### Backend

- Node.js
- Express.js
- Axios
- CORS

### Frontend

- React 19
- Axios
- CSS3

### Geliştirme Araçları

- Nodemon (backend hot reload)
- Concurrently (paralel çalıştırma)

## 📝 Notlar

- Backend altın fiyatlarını GoldAPI'den çeker
- Fiyat hesaplama: `(popularityScore + 1) * weight * goldPrice`
- Frontend otomatik olarak backend'e bağlanır (localhost:5000)
