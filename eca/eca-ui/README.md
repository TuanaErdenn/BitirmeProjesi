# ECA E-Commerce Application

Bu proje, Keycloak ile güvenli authentication ve BFF (Backend for Frontend) mimarisi kullanan modern bir e-commerce uygulamasıdır.

## 🚀 Özellikler

- **BFF Mimarisi**: Backend for Frontend pattern ile güvenli API yönetimi
- **Keycloak Entegrasyonu**: PKCE ile OAuth 2.0/OpenID Connect authentication
- **In-Memory Session**: Sunucu tarafında güvenli session yönetimi
- **Modern Angular**: Angular 20.3.6 ile responsive ve performanslı UI
- **TypeScript**: Tip güvenliği ve modern JavaScript özellikleri
- **Bun Runtime**: Hızlı paket yönetimi ve build işlemleri

## 🛠️ Teknik Stack

- **Frontend**: Angular 20.3.6, TypeScript, RxJS
- **Backend**: Express.js, Node.js
- **Authentication**: Keycloak (OAuth 2.0 + PKCE)
- **Session Management**: Express Session (In-Memory)
- **Package Manager**: Bun
- **Styling**: Native CSS3 with modern responsive design

## 📋 Gereksinimler

- Node.js (v18+)
- Bun package manager
- Keycloak server (v24+)
- Modern web browser

## 🔧 Kurulum

1. **Proje dizinine gidin:**
```bash
cd eca-ui
```

2. **Bağımlılıkları yükleyin:**
```bash
bun install
```

3. **Environment variables konfigürasyonu:**
```bash
cp .env.example .env
```

`.env` dosyasında Keycloak konfigürasyonunuzu yapın:
```env
KEYCLOAK_ISSUER=http://localhost:8080/realms/ecommerce
KEYCLOAK_CLIENT_ID=ecommerce-app
KEYCLOAK_CLIENT_SECRET=your-client-secret-here
KEYCLOAK_REDIRECT_URI=http://localhost:4000/oauth/callback
SESSION_SECRET=your-super-secret-session-key-change-in-production
```

## 🔐 Keycloak Konfigürasyonu

1. **Realm oluşturun:** `ecommerce`
2. **Client oluşturun:**
   - Client ID: `ecommerce-app`
   - Client Type: `Confidential`
   - Authentication Flow: `Standard Flow` + `Direct Access Grants`
   - Valid Redirect URIs: `http://localhost:4000/oauth/callback`
   - Valid Post Logout Redirect URIs: `http://localhost:4000`
   - PKCE: `Enabled`

## 🚀 Geliştirme

Geliştirme sunucusunu başlatmak için:

```bash
bun run start
```

Uygulama `http://localhost:4000` adresinde çalışacaktır.

## 🏗️ Build

Production build için:

```bash
bun run build
```

Build artifacts `dist/` dizininde saklanacaktır.

## 🔄 API Endpoints

### Authentication Endpoints
- `GET /api/user` - Kullanıcı bilgilerini getirir
- `GET /api/login` - Login URL'ini döndürür
- `GET /oauth/callback` - OAuth callback endpoint
- `POST /api/logout` - Kullanıcı çıkışı

### Protected Endpoints
- `GET /api/protected` - Korumalı test endpoint'i

## 🎨 UI Bileşenleri

- **HeaderComponent**: Navigation bar ve authentication butonları
- **MainContentComponent**: Ana sayfa içeriği ve e-commerce bileşenleri
- **AuthService**: Authentication state yönetimi

## 🔒 Güvenlik Özellikleri

- **PKCE (Proof Key for Code Exchange)**: Authorization Code Flow güvenliği
- **HttpOnly Cookies**: XSS koruması
- **Session Timeout**: Otomatik session temizleme
- **CSRF Protection**: Express session koruması
- **In-Memory Sessions**: Sunucu restart'ta otomatik temizlik

## 📱 Responsive Design

- Mobile-first approach
- Tablet ve desktop optimizasyonu
- Modern CSS Grid ve Flexbox kullanımı
- Accessibility (a11y) desteği

## 🧪 Test

Unit testleri çalıştırmak için:

```bash
bun run test
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Sorularınız için GitHub Issues kullanabilirsiniz.
