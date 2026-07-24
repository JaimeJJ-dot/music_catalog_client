# Music Catalog Client

Cliente web Full-Stack desarrollado con **React 18**, **Vite** y **Material UI (MUI v5)** para el consumo de la API REST de catálogo musical. Implementa un flujo de seguridad y navegación protegido por **OAuth 2.0**, gestión reactiva de estados visuales y procesamiento local de archivos en formato Base64.

Este frontend está diseñado específicamente para interactuar con el backend relacional del proyecto: [`music_catalog_api`](https://github.com/Nico180306/music_catalog_api).

---

## 🛠️ Tecnologías y Librerías

- React 18 + Vite
- Material UI (MUI v5) & Emotion
- React Router Dom v6 (Enrutamiento y Rutas Protegidas)
- Axios (Cliente HTTP y gestión de interceptores)
- API nativa FileReader (Transformación de imágenes a Base64)

---

## 📋 Requisitos previos

- Node.js 18 o superior instalado ([nodejs.org](https://nodejs.org/))
- Git
- El servidor backend (`music_catalog_api`) corriendo en local en el puerto `8000` y con las cabeceras CORS habilitadas.

---

## 🚀 Instalación y Despliegue Local (desde cero)

### 1. Clonar el repositorio y entrar al directorio

```bash
git clone [https://github.com/TU_USUARIO/music_catalog_client.git](https://github.com/TU_USUARIO/music_catalog_client.git)
cd music_catalog_client

### 2. Instalar dependencias del proyecto
No es necesario manipular carpetas ni instalar paquetes individualmente. El manifiesto del sistema reconstruirá todo el árbol de dependencias ejecutando:

```bash
npm install
```

---

### 3. Configurar variables de entorno (OAuth 2.0 y API)
Por seguridad y buenas prácticas (metodología Twelve-Factor App), las credenciales de cliente no están programadas en el código fuente.

1. En la raíz del proyecto, crea un archivo llamado exactamente `.env` tomando como referencia el archivo `.env.example`.
2. Completa las variables con las credenciales emitidas por tu panel de administración en Django (http://127.0.0.1:8000/admin/ -> Django OAuth Toolkit):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_CLIENT_ID=tu_client_id_generado_en_django
VITE_CLIENT_SECRET=tu_client_secret_generado_en_django
```

---

### 4. Levantar el servidor de desarrollo en caliente

```bash
npm run dev
```

La aplicación se abrirá en tu navegador en la ruta http://localhost:5173/. Si intentas acceder directamente al catálogo sin haber iniciado sesión, el sistema te redirigirá automáticamente a la pantalla de /login.

---

## 🏗️ Aspectos Destacados de la Arquitectura

### 🛡️ Seguridad OAuth 2.0 y Rutas Protegidas
- **Intercepción de peticiones (services/api.js):** Axios está configurado con un interceptor que inyecta dinámicamente la cabecera `Authorization: Bearer <access_token>` en cada llamada HTTP si el usuario está autenticado.
- **Rutas Privadas (App.jsx):** Un componente envoltorio (`<ProtectedRoute>`) monitorea la persistencia de la sesión en el `localStorage`. Sin un token válido, se cortocircuita el renderizado visual y se bloquea el acceso a las vistas de entidades.

### 🎨 Gestión Estricta de Estados de UI (Feedback Loops)
Cumpliendo con los estándares de diseño de interfaces web modernas, todas las vistas conectadas a endpoints asíncronos (ArtistsPage y AlbumsPage) gestionan explícitamente los 3 estados del ciclo de vida del dato:
1. **Cargando:** Renderizado de `<LoadingSpinner/>` durante el tiempo de espera de respuesta del servidor.
2. **Error:** Renderizado de `<ErrorState/>` con alertas comprensibles y acción de reintento (`retry`) si la red o el token fallan.
3. **Vacío:** Renderizado de `<EmptyState/>` si la consulta HTTP 200 devuelve un arreglo vacío `[]`, guiando al usuario a crear el primer registro.

### 🖼️ Procesamiento de Imágenes en Base64
Para mantener un contrato de comunicación 100% JSON con el API REST sin requerir transferencias multipartes (`multipart/form-data`), el componente `<ImageUploader/>` utiliza la API asíncrona del navegador `FileReader`. Convierte en tiempo real los archivos binarios locales seleccionados por el usuario a cadenas ASCII codificadas en **Base64** antes de despachar el payload al servidor.

---

## 📁 Estructura del Proyecto

```text
music_catalog_client/
├── public/
├── src/
│   ├── components/
│   │   ├── albums/          # Tarjetas y formularios modales de Álbumes
│   │   ├── artists/         # Tarjetas y formularios modales de Artistas
│   │   ├── common/          # Componentes UI transversales (Loading, Error, Empty, Uploader)
│   │   └── layout/          # Barra de navegación principal (Navbar)
│   ├── pages/
│   │   ├── AlbumsPage.jsx   # Vista principal y CRUD de Álbumes
│   │   ├── ArtistsPage.jsx  # Vista principal y CRUD de Artistas
│   │   ├── Login.jsx        # Pantalla y formulario de autenticación OAuth 2.0
│   │   └── *.css            # Estilos externos independientes por página
│   ├── services/
│   │   ├── api.js           # Instancia central de Axios e interceptor Bearer
│   │   ├── authService.js   # Peticiones POST al endpoint de tokens OAuth2
│   │   ├── artistService.js # Métodos CRUD para la entidad Artista
│   │   └── albumService.js  # Métodos CRUD para la entidad Álbum
│   ├── App.jsx              # Enrutador principal y reglas de protección de rutas
│   └── main.jsx             # Punto de entrada y montaje del DOM virtual
├── .env.example             # Plantilla pública de variables de entorno
├── package.json             # Manifiesto y dependencias de Node
└── README.md
```

---

## 👥 Equipo y Distribución de Trabajo

- **Nicolás Santillán** — Configuración de entorno de Vite, variables de seguridad, vista de Login y enlace OAuth 2.0, enrutamiento principal con protección de rutas (App.jsx), y formularios modales de creación con motor de conversión de imágenes a Base64 (ImageUploader).
- **Jaime Jiménez** — Desarrollo de componentes de estado visual transversales (LoadingSpinner, ErrorState, EmptyState, Navbar), capa de servicios HTTP con Axios (services/), diseño de tarjetas visuales (ArtistCard, AlbumCard) y construcción de las vistas principales del catálogo con máquinas de estado (ArtistsPage, AlbumsPage).
