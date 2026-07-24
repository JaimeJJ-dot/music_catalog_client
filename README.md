# 🎵 Vynlo - Music Catalog Client

Cliente web Full-Stack desarrollado con **React 18**, **Vite** y **Material UI (MUI v5)** para el consumo de la API REST de catálogo musical. Implementa autenticación **OAuth 2.0**, control de acceso por roles (lectura pública / escritura autenticada), navegación protegida, gestión reactiva de estados visuales y una interfaz propia inspirada en productos de streaming reales.

Este frontend está diseñado específicamente para interactuar con el backend relacional del proyecto: [`music_catalog_api`](https://github.com/Nico180306/music_catalog_api).

---

## ✨ Vista general

| | |
|---|---|
| **Nombre del producto** | Vynlo |
| **Tipo** | SPA (Single Page Application) |
| **Backend consumido** | Django REST Framework + OAuth 2.0 (Django OAuth Toolkit) |
| **Acceso** | Lectura pública para cualquier visitante · Creación/edición/eliminación solo para usuarios autenticados |

---

## 🛠️ Tecnologías y librerías

- **React 18 + Vite** - SPA con recarga en caliente
- **Material UI (MUI v5)** & Emotion - sistema de componentes, tematizado con paleta propia (`theme.js`)
- **React Router DOM v6** - enrutamiento, rutas dinámicas (`/artists/:id`) y parámetros de búsqueda (`useSearchParams`)
- **Axios** - cliente HTTP con interceptor de token Bearer
- **API nativa FileReader** - conversión de imágenes locales a Base64
- **Google Fonts (Inter)** - tipografía del tema visual

---

## 📋 Requisitos previos

- Node.js 18 o superior ([nodejs.org](https://nodejs.org/))
- Git
- El servidor backend (`music_catalog_api`) corriendo en local en el puerto `8000`, con CORS habilitado para `http://localhost:5173`

---

## 🚀 Instalación y despliegue local

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/music_catalog_client.git
cd music_catalog_client
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Por seguridad (metodología Twelve-Factor App), las credenciales no están escritas en el código fuente.

1. En la raíz del proyecto, crea un archivo `.env` tomando como referencia `.env.example`.
2. Completa las variables con las credenciales generadas en el panel de administración de Django (`http://127.0.0.1:8000/admin/` → Django OAuth Toolkit):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_CLIENT_ID=tu_client_id_generado_en_django
VITE_CLIENT_SECRET=tu_client_secret_generado_en_django
```

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

La aplicación se abre en `http://localhost:5173/`, directamente en el **Home** - no requiere inicio de sesión para explorar el catálogo. Para crear, editar o eliminar registros, inicia sesión desde el botón **"Iniciar sesión"** del navbar.

---

## 🏗️ Aspectos destacados de la arquitectura

### 🛡️ Seguridad OAuth 2.0 y control de acceso por roles

- **Interceptor de peticiones (`services/api.js`)** - Axios inyecta dinámicamente `Authorization: Bearer <access_token>` en cada llamada si el usuario está autenticado.
- **Acceso de lectura público** - el backend expone los endpoints de consulta (`GET`) sin requerir autenticación (`IsAuthenticatedOrReadOnly`), así que Home, Artistas, Álbumes y el buscador son accesibles para cualquier visitante.
- **Escritura protegida** - los botones de crear, editar y eliminar solo se renderizan cuando `isLoggedIn()` detecta un `access_token` válido en `localStorage`; el backend refuerza el mismo control a nivel de API, por lo que no depende únicamente del frontend.
- **Sesión persistente** - el nombre de usuario se guarda junto al token para personalizar el saludo del Home, y ambos se limpian juntos al cerrar sesión.

### 🎨 Gestión estricta de estados de UI (feedback loops)

Todas las vistas conectadas a endpoints asíncronos (`Home`, `ArtistsPage`, `AlbumsPage`, `ArtistDetailPage`, `SearchPage`) gestionan explícitamente los 3 estados del ciclo de vida del dato:

1. **Cargando** - `<LoadingSpinner />` mientras se espera la respuesta del servidor.
2. **Error** - `<ErrorState />` con mensaje y acción de reintento (`retry`) si la red o el token fallan.
3. **Vacío** - `<EmptyState />` si la consulta devuelve un arreglo vacío, con una acción directa de "Agregar" cuando el usuario tiene permisos de edición.

### 🏠 Home dinámico

- Saludo personalizado según la hora del día y el usuario autenticado, con avatar (inicial o ícono genérico si no hay sesión).
- Contador en vivo de artistas y álbumes registrados.
- Grilla de acceso rápido mezclando los artistas y álbumes más recientes.
- Carruseles horizontales (`<Carousel />`) con flechas de navegación, tamaño de tarjeta fijo y hasta 7 elementos por sección.
- Chips de filtro (Todo / Artistas / Álbumes) que ocultan o muestran secciones sin recargar la página.

### 🔍 Búsqueda global

`SearchPage` consulta artistas y álbumes y filtra en el cliente por nombre de artista, título de álbum o artista asociado, mostrando resultados agrupados por tipo.

### 🎤 Página de detalle de artista

`ArtistDetailPage` (`/artists/:id`) muestra un hero con foto de portada (banner) y foto de perfil, biografía destacada y la discografía completa del artista, reutilizando `AlbumCard` con los mismos controles de edición condicionados por sesión.

### 🖼️ Procesamiento de imágenes en Base64

Para mantener un contrato de comunicación 100% JSON con el API REST sin requerir `multipart/form-data`, el componente `<ImageUploader />` usa la API `FileReader` del navegador para convertir archivos locales a Base64 antes de enviarlos al servidor.

---

## 📁 Estructura del proyecto

```text
music_catalog_client/
├── public/
│   └── favicon.svg           # Ícono de la app (disco de vinilo)
├── src/
│   ├── components/
│   │   ├── albums/            # AlbumCard, CreateAlbumModal, EditAlbumModal
│   │   ├── artists/            # ArtistCard, CreateArtistModal, EditArtistModal
│   │   ├── common/            # LoadingSpinner, ErrorState, EmptyState, ImageUploader, Logo, Carousel
│   │   └── layout/             # Navbar (logo, buscador, navegación, sesión)
│   ├── pages/
│   │   ├── Home.jsx            # Vista de inicio con carruseles y acceso rápido
│   │   ├── ArtistsPage.jsx     # Catálogo y CRUD de Artistas
│   │   ├── ArtistDetailPage.jsx# Detalle de artista + su discografía
│   │   ├── AlbumsPage.jsx      # Catálogo y CRUD de Álbumes
│   │   ├── SearchPage.jsx      # Resultados de búsqueda global
│   │   ├── Login.jsx           # Autenticación OAuth 2.0
│   │   └── *.css               # Estilos independientes por página
│   ├── services/
│   │   ├── api.js              # Instancia de Axios e interceptor Bearer
│   │   ├── authService.js      # Peticiones al endpoint de tokens OAuth2
│   │   ├── artistService.js    # CRUD de Artistas
│   │   └── albumService.js     # CRUD de Álbumes
│   ├── utils/
│   │   └── auth.js             # isLoggedIn() — lógica local de sesión
│   ├── theme.js                # Tema MUI (paleta, tipografía, componentes)
│   ├── App.jsx                 # Enrutador principal
│   └── main.jsx                # Punto de entrada y ThemeProvider
├── .env.example                # Plantilla pública de variables de entorno
├── package.json
└── README.md
```

---

## 👥 Equipo y distribución de trabajo

- **Nicolás Santillán** - Configuración de entorno de Vite, variables de seguridad, vista de Login y enlace OAuth 2.0, enrutamiento principal (`App.jsx`), y formularios modales de creación con motor de conversión de imágenes a Base64 (`ImageUploader`).
- **Jaime Jiménez** - Componentes de estado visual transversales (`LoadingSpinner`, `ErrorState`, `EmptyState`, `Navbar`), capa de servicios HTTP con Axios (`services/`), diseño de tarjetas visuales (`ArtistCard`, `AlbumCard`), vistas principales del catálogo (`ArtistsPage`, `AlbumsPage`), tema visual Vynlo, Home, página de detalle de artista, buscador global y control de acceso por roles en el frontend.
