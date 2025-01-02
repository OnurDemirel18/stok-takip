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

### Projeden Ekran Görüntüleri (Light Tema)

## Giriş Ekranı

![Screenshot 2025-01-02 145306](https://github.com/user-attachments/assets/c6516646-e557-473d-aa49-c3e5c5f3edf5)

## Dashboard

![Screenshot 2025-01-02 144125](https://github.com/user-attachments/assets/cdb765f3-b75d-4379-be6f-012f6c0c3594)

![Screenshot 2025-01-02 144141](https://github.com/user-attachments/assets/3e5fe57f-cb4c-462e-b855-838c5d98bd49)

## Ürünler

![Screenshot 2025-01-02 144417](https://github.com/user-attachments/assets/11795bd3-4ea1-47c1-9883-3637808f2c1d)

![Screenshot 2025-01-02 144430](https://github.com/user-attachments/assets/71c0f5eb-7617-464e-92b4-8f808132c0e7)

## Kategoriler

![Screenshot 2025-01-02 144445](https://github.com/user-attachments/assets/f1ddc85f-d362-4a65-84b9-e8e17bafc9eb)

![Screenshot 2025-01-02 144454](https://github.com/user-attachments/assets/562848d2-a286-48e8-b64a-f19bca11c969)

## Stok Hareketleri

![Screenshot 2025-01-02 145133](https://github.com/user-attachments/assets/048dae19-f288-42eb-936c-3bb7636ec10b)

![Screenshot 2025-01-02 145141](https://github.com/user-attachments/assets/231acc11-4777-4361-bbdb-5b0cd0bc8228)

## Raporlar

![Screenshot 2025-01-02 145155](https://github.com/user-attachments/assets/ad3f14fa-ca0a-448a-b545-8116845ecf4f)

## Profil

![Screenshot 2025-01-02 145206](https://github.com/user-attachments/assets/934d7393-d440-4970-b0bd-d4c6b940a835)

![Screenshot 2025-01-02 145220](https://github.com/user-attachments/assets/7c9cca09-8141-47fc-b0ff-de9e7c6961f2)

![Screenshot 2025-01-02 145230](https://github.com/user-attachments/assets/d478ee10-4f5f-4394-a880-15058f4d3fe4)

## Kullanıcılar

![Screenshot 2025-01-02 145243](https://github.com/user-attachments/assets/ce4c396a-cd3a-4d18-820a-9731a232e1c9)

![Screenshot 2025-01-02 145252](https://github.com/user-attachments/assets/f7a0f9f6-b689-4f77-af09-b1833ab5bf27)


### Projeden Ekran Görüntüleri (Dark Tema)

![Screenshot 2025-01-02 145817](https://github.com/user-attachments/assets/3c3d7511-1b18-49a1-b2ab-1e1b1d5cfccb)

![Screenshot 2025-01-02 145837](https://github.com/user-attachments/assets/4a9d7166-d809-4382-8127-6b126da1ec93)
