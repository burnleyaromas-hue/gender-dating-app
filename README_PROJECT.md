# Gender - Aplicación de Citas para Lesbianas

Gender es una aplicación móvil tipo Grindr diseñada específicamente para lesbianas. Permite a las usuarias descubrir, conectar y conocer a otras mujeres cercanas en tiempo real.

## Características Principales

### 🔍 Descubrimiento Inteligente
- **Geolocalización en tiempo real**: Encuentra mujeres cercanas a ti
- **Tarjetas deslizables**: Like, Super Like o Pass en perfiles
- **Distancia calculada automáticamente**: Ve cuán lejos está cada persona
- **Filtros por preferencias**: Edad, distancia máxima y más

### 💬 Mensajería
- **Chat en tiempo real**: Comunícate con tus matches
- **Notificaciones**: Recibe alertas de nuevos mensajes
- **Historial de conversaciones**: Accede a todos tus chats

### 📸 Perfil y Fotos
- **Carga de hasta 6 fotos**: Muestra tu mejor versión
- **Foto principal destacada**: La primera foto es la más importante
- **Reordenamiento de fotos**: Organiza tus fotos como desees
- **Edición de perfil**: Actualiza tu bio, edad e intereses

### 🔒 Seguridad y Privacidad
- **Verificación de perfiles**: Confirma que eres real
- **Bloqueo de usuarios**: Controla quién puede contactarte
- **Reportes de abuso**: Denuncia comportamiento inapropiado
- **Privacidad de ubicación**: Controla quién ve tu ubicación

## Tecnología

### Frontend
- **React Native 0.81** - Framework para aplicaciones móviles
- **Expo 54** - Plataforma de desarrollo
- **TypeScript 5.9** - Tipado estático
- **NativeWind 4** - Tailwind CSS para React Native
- **Expo Router 6** - Navegación
- **React Native Reanimated 4** - Animaciones

### Backend
- **Node.js + Express** - Servidor
- **tRPC** - API type-safe
- **PostgreSQL** - Base de datos
- **Drizzle ORM** - Gestión de base de datos

### Características Técnicas
- **Geolocalización**: `expo-location`
- **Carga de fotos**: `expo-image-picker`
- **Almacenamiento local**: `AsyncStorage`
- **Autenticación**: OAuth integrado

## Instalación

### Requisitos
- Node.js 18+
- pnpm (gestor de paquetes)
- PostgreSQL 12+ (para desarrollo)
- Expo Go (para probar en dispositivo)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/gender-dating-app.git
cd gender-dating-app

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# 4. Configurar base de datos
pnpm db:push

# 5. Iniciar desarrollo
pnpm dev

# 6. Escanear código QR con Expo Go
```

## Estructura del Proyecto

```
gender-dating-app/
├── app/                      # Pantallas (Expo Router)
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Navegación de tabs
│   │   ├── index.tsx        # Pantalla de inicio
│   │   ├── discovery.tsx    # Descubrimiento con geolocalización
│   │   ├── matches.tsx      # Matches y chat
│   │   ├── photos.tsx       # Carga de fotos
│   │   └── profile.tsx      # Perfil de usuario
│   └── oauth/               # Callbacks de autenticación
├── server/                   # Backend
│   ├── _core/
│   │   └── index.ts         # Servidor Express
│   ├── db.ts                # Funciones de base de datos
│   └── routers.ts           # Rutas de API (tRPC)
├── drizzle/                  # Migraciones de base de datos
│   └── schema.ts            # Esquema de tablas
├── hooks/                    # Hooks personalizados
│   ├── use-location.ts      # Geolocalización
│   ├── use-colors.ts        # Tema de colores
│   └── use-auth.ts          # Autenticación
├── components/               # Componentes reutilizables
│   ├── screen-container.tsx # Contenedor de pantalla
│   ├── themed-view.tsx      # Vista con tema
│   └── ui/
│       └── icon-symbol.tsx  # Mapeo de iconos
├── lib/                      # Utilidades
│   ├── trpc.ts              # Cliente tRPC
│   ├── theme-provider.tsx   # Proveedor de tema
│   └── utils.ts             # Funciones auxiliares
├── constants/               # Constantes
│   └── theme.ts             # Colores y tema
├── app.config.ts            # Configuración de Expo
├── tailwind.config.js       # Configuración de Tailwind
└── package.json             # Dependencias
```

## Configuración de Base de Datos

### Tablas Principales

- **users**: Información de usuarios
- **userProfiles**: Perfiles extendidos
- **userPhotos**: Fotos de usuarios
- **userPreferences**: Preferencias de búsqueda
- **likes**: Likes y super likes
- **matches**: Matches entre usuarios
- **messages**: Mensajes entre matches
- **blockedUsers**: Usuarios bloqueados
- **reports**: Reportes de abuso

## API (tRPC)

### Rutas Disponibles

```typescript
// Autenticación
auth.login
auth.logout
auth.me

// Perfiles
profiles.get
profiles.update
profiles.updateLocation

// Fotos
photos.list
photos.add
photos.delete

// Descubrimiento
discovery.nearby

// Likes
likes.like
likes.pass

// Matches
matches.list
matches.get

// Mensajes
messages.send
messages.list
messages.markAsRead

// Seguridad
safety.block
safety.unblock
safety.blockedList
safety.report
```

## Desarrollo

### Comandos Útiles

```bash
# Iniciar desarrollo
pnpm dev

# Verificar tipos TypeScript
pnpm check

# Ejecutar linter
pnpm lint

# Formatear código
pnpm format

# Ejecutar pruebas
pnpm test

# Generar migraciones de BD
pnpm db:push

# Compilar para producción
pnpm build
```

### Agregar Nuevas Pantallas

```bash
# Crea un archivo en app/(tabs)/
touch app/(tabs)/nueva-pantalla.tsx

# Agrega la ruta en app/(tabs)/_layout.tsx
<Tabs.Screen
  name="nueva-pantalla"
  options={{
    title: "Título",
    tabBarIcon: ({ color }) => <IconSymbol size={28} name="icon-name" color={color} />,
  }}
/>
```

## Despliegue

### Desarrollo Local
```bash
pnpm dev
```

### Producción con EAS
```bash
eas build --platform android
eas build --platform ios
eas submit --platform android
eas submit --platform ios
```

Ver [GITHUB_SETUP.md](./GITHUB_SETUP.md) para instrucciones detalladas.

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

## Soporte

Para reportar bugs o sugerir características, abre un issue en GitHub.

## Autores

- Creado con ❤️ para la comunidad lésbica

---

**Nota**: Esta es una aplicación de demostración. Para usar en producción, asegúrate de:
- Implementar autenticación real
- Configurar HTTPS
- Cumplir con regulaciones de privacidad (GDPR, etc.)
- Implementar moderación de contenido
- Agregar términos de servicio y política de privacidad
