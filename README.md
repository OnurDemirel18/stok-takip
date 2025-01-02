# 📦 Stok Takip Sistemi

Modern ve kullanıcı dostu bir stok yönetim uygulaması. TypeScript, Next.js ve Node.js teknolojileri ile geliştirilmiştir.

![Stok Takip Demo](demo.gif)

## 🌟 Özellikler

### 💼 Temel Özellikler
- **Ürün Yönetimi**: Ürün ekleme, düzenleme, silme ve arama
- **Kategori Yönetimi**: Kategorileri organize etme ve yönetme
- **Stok Hareketleri**: Giriş/çıkış işlemleri ve hareket geçmişi
- **Raporlama**: Detaylı raporlar ve analiz araçları
- **Kullanıcı Yönetimi**: Rol tabanlı yetkilendirme sistemi

### 🎨 Kullanıcı Arayüzü
- **Modern Tasarım**: Temiz ve profesyonel arayüz
- **Responsive**: Tüm cihazlarda uyumlu çalışma
- **Dark/Light Mode**: Karanlık/Aydınlık tema desteği
- **Real-time Validation**: Anlık form doğrulama

### 📊 Raporlama Özellikleri
- Excel export
- PDF raporları
- Grafik ve istatistikler
- Stok değeri analizi

## 🛠 Teknoloji Stack

### Frontend
- **Framework**: Next.js 14
- **Dil**: TypeScript
- **State Yönetimi**: React Query & Zustand
- **UI**: Tailwind CSS
- **Form**: React Hook Form & Zod
- **Grafikler**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Dil**: TypeScript
- **ORM**: Prisma
- **Veritabanı**: PostgreSQL
- **Auth**: JWT

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js >= 18.17.0
- PostgreSQL >= 15
- npm >= 9.6.7

### Frontend Kurulum

- **Repository'yi klonlayın**
- git clone https://github.com/onurdemirel18/stok-takip.git

- **Frontend dizinine gidin**
- cd stok-takip/frontend

- **Bağımlılıkları yükleyin**
- cd npm install

- **Geliştirme sunucusunu başlatın**
- npm run dev

### Backend Kurulum

- **Backend dizinine gidin**
- cd stok-takip/backend

- **Bağımlılıkları yükleyin**
- npm install

- **.env dosyasını oluşturun**
- cp .env.example .env

- **Veritabanı migrationlarını çalıştırın**
- npx prisma migrate dev

- **Sunucuyu başlatın**
- npm run dev

## 📝 Ortam Değişkenleri

### Frontend (.env)

- env
- NEXT_PUBLIC_API_URL=http://localhost:3001
- NEXT_PUBLIC_APP_URL=http://localhost:3000

### Backend (.env)

- env
- DATABASE_URL="postgresql://user:password@localhost:5432/stok_takip"
- JWT_SECRET="your-secret-key"
- PORT=3001

## 👥 Kullanıcı Rolleri

- **Admin**: Tam yetki
- **User**: Sınırlı yetki (stok hareketleri ve raporlar)

## 📚 API Dokümantasyonu

API dokümantasyonuna [http://localhost:3001/api-docs](http://localhost:3001/api-docs) adresinden erişebilirsiniz.

## 🧪 Test

### Frontend testleri

- cd frontend
- npm run test

### Backend testleri

- cd backend
- npm run test

## 📦 Build & Deploy

### Frontend testleri

- cd frontend
- npm run build

### Backend testleri

- cd backend
- npm run build

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)

## 📧 İletişim

Proje Sahibi -  onurdemirel18@outlook.com

Proje Linki: [https://github.com/OnurDemirel18/stok-takip](https://github.com/OnurDemirel18/stok-takip)
