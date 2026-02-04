# Guía: Cómo Desplegar Gender en GitHub

Esta guía te ayudará a subir tu aplicación Gender a tu repositorio de GitHub y tener control total del código y backend.

## Requisitos Previos

- Cuenta de GitHub (crea una en https://github.com si no tienes)
- Git instalado en tu computadora (https://git-scm.com/download)
- Node.js y pnpm instalados

## Paso 1: Crear un Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `gender-dating-app` (o el nombre que prefieras)
3. Descripción: "Aplicación de citas tipo Grindr para lesbianas"
4. Selecciona "Public" o "Private" según tus preferencias
5. NO inicialices con README (lo haremos localmente)
6. Haz clic en "Create repository"

## Paso 2: Clonar el Proyecto Localmente

```bash
# Descarga el proyecto desde Manus
# (Descarga el archivo ZIP desde la interfaz de Manus)

# Descomprime el archivo
unzip gender-dating-app.zip
cd gender-dating-app

# Inicializa Git
git init

# Agrega el repositorio remoto (reemplaza TU_USUARIO y TU_REPO)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Configura tu nombre y email en Git
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
```

## Paso 3: Instalar Dependencias

```bash
# Instala todas las dependencias
pnpm install

# Verifica que todo está bien
pnpm check
```

## Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gender_db"
NODE_ENV="development"
```

## Paso 5: Configurar la Base de Datos

### Opción A: PostgreSQL Local (Recomendado para desarrollo)

```bash
# Instala PostgreSQL desde https://www.postgresql.org/download/

# Crea la base de datos
createdb gender_db

# Ejecuta las migraciones
pnpm db:push
```

### Opción B: Usar un Servicio en la Nube

Opciones populares:
- **Supabase** (PostgreSQL gratuito): https://supabase.com
- **Railway**: https://railway.app
- **Render**: https://render.com
- **PlanetScale** (MySQL): https://planetscale.com

## Paso 6: Subir a GitHub

```bash
# Agrega todos los archivos
git add .

# Crea el primer commit
git commit -m "Initial commit: Gender dating app with geolocation and photo upload"

# Sube a GitHub
git branch -M main
git push -u origin main
```

## Paso 7: Configurar Secrets en GitHub (Importante)

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" → "Secrets and variables" → "Actions"
3. Agrega estos secrets:

```
DATABASE_URL = tu_url_de_base_de_datos
NODE_ENV = production
```

## Estructura del Proyecto

```
gender-dating-app/
├── app/                    # Pantallas de la app
│   └── (tabs)/
│       ├── index.tsx      # Inicio
│       ├── discovery.tsx  # Descubrimiento con geolocalización
│       ├── matches.tsx    # Matches y chat
│       ├── photos.tsx     # Carga de fotos
│       └── profile.tsx    # Perfil de usuario
├── server/                # Backend
│   ├── db.ts             # Funciones de base de datos
│   ├── routers.ts        # Rutas de API (tRPC)
│   └── _core/index.ts    # Servidor Express
├── drizzle/              # Migraciones de base de datos
├── hooks/                # Hooks personalizados
│   ├── use-location.ts   # Geolocalización
│   └── use-colors.ts     # Tema de colores
├── components/           # Componentes reutilizables
├── app.config.ts         # Configuración de Expo
└── package.json          # Dependencias
```

## Ejecutar Localmente

```bash
# Desarrollo
pnpm dev

# La app estará disponible en http://localhost:8081

# Prueba en dispositivo real
# Escanea el código QR con Expo Go (disponible en App Store y Google Play)
```

## Desplegar a Producción

### Opción 1: EAS Build (Recomendado)

```bash
# Instala EAS CLI
npm install -g eas-cli

# Inicia sesión
eas login

# Configura el proyecto
eas build:configure

# Construye para iOS
eas build --platform ios

# Construye para Android
eas build --platform android
```

### Opción 2: Compilación Local

```bash
# Para Android
eas build --platform android --local

# Para iOS (requiere Mac)
eas build --platform ios --local
```

## Publicar en App Stores

### App Store (iOS)

1. Crea una cuenta de desarrollador en https://developer.apple.com
2. Sigue la guía: https://docs.expo.dev/submit/ios/
3. Ejecuta: `eas submit --platform ios`

### Google Play (Android)

1. Crea una cuenta de desarrollador en https://play.google.com/console
2. Sigue la guía: https://docs.expo.dev/submit/android/
3. Ejecuta: `eas submit --platform android`

## Actualizar el Código

```bash
# Haz cambios en tu código

# Verifica que todo está bien
pnpm check

# Agrega los cambios
git add .

# Crea un commit
git commit -m "Descripción de los cambios"

# Sube a GitHub
git push origin main
```

## Solucionar Problemas

### Error: "DATABASE_URL not found"
- Asegúrate de que el archivo `.env` existe y tiene la URL correcta
- Verifica que PostgreSQL está corriendo

### Error: "Permission denied" al hacer push
- Usa SSH en lugar de HTTPS: `git remote set-url origin git@github.com:TU_USUARIO/TU_REPO.git`
- O genera un token de acceso personal en GitHub

### La app no carga en el dispositivo
- Verifica que tu computadora y dispositivo están en la misma red WiFi
- Reinicia el servidor: `pnpm dev`

## Recursos Útiles

- Documentación de Expo: https://docs.expo.dev
- Documentación de React Native: https://reactnative.dev
- Documentación de Drizzle ORM: https://orm.drizzle.team
- Documentación de tRPC: https://trpc.io

## Soporte

Si tienes preguntas o problemas:
1. Revisa la documentación oficial
2. Busca en Stack Overflow
3. Abre un issue en GitHub

¡Éxito con tu app Gender! 🚀
