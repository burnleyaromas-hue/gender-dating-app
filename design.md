# Diseño de Interfaz - LoveConnect (Grindr para Lesbianas)

## Visión General
Aplicación móvil de citas enfocada en lesbianas con sistema de geolocalización, perfiles con fotos, y mensajería en tiempo real. La interfaz debe ser intuitiva, segura y optimizada para una mano.

---

## Pantallas Principales

### 1. **Pantalla de Inicio de Sesión**
- Logo de la app
- Botón "Iniciar sesión con Manus"
- Opción de registro
- Términos y condiciones

### 2. **Pantalla de Creación de Perfil**
- Foto de perfil (cámara o galería)
- Nombre y edad
- Ubicación (con permiso de geolocalización)
- Bio/Descripción personal
- Intereses/Tags (deportes, música, películas, etc.)
- Preferencias de búsqueda (rango de edad, distancia)
- Botón "Completar perfil"

### 3. **Pantalla Principal (Grid de Perfiles)**
- Grid de 2 columnas con perfiles cercanos
- Cada tarjeta muestra: foto, nombre, edad, distancia
- Deslizar hacia arriba para ver más fotos del perfil
- Botones de acción:
  - ❤️ Like (rojo)
  - ✕ Pasar (gris)
  - ⭐ Super Like (dorado)
- Filtros: distancia, edad, en línea

### 4. **Pantalla de Detalle de Perfil**
- Galería de fotos (swipe horizontal)
- Nombre, edad, distancia
- Bio completa
- Intereses/Tags
- Botones: Like, Pasar, Super Like, Bloquear, Reportar

### 5. **Pantalla de Matches**
- Lista de matches (personas que dieron like mutuamente)
- Foto, nombre, última conexión
- Indicador de "en línea"
- Tap para abrir chat

### 6. **Pantalla de Mensajería**
- Lista de conversaciones
- Foto de perfil, nombre, último mensaje
- Timestamp del último mensaje
- Indicador de mensajes no leídos

### 7. **Pantalla de Chat Individual**
- Encabezado con foto y nombre del perfil
- Historial de mensajes
- Campo de entrada de texto
- Botón para enviar
- Opción para compartir ubicación (opcional)

### 8. **Pantalla de Perfil del Usuario**
- Foto de perfil
- Nombre, edad, ubicación
- Bio
- Intereses
- Botones: Editar perfil, Preferencias, Privacidad, Cerrar sesión

### 9. **Pantalla de Configuración**
- Preferencias de búsqueda
- Privacidad (mostrar/ocultar perfil)
- Notificaciones
- Bloqueados
- Reportes de seguridad

---

## Flujos de Usuario Principales

### Flujo 1: Descubrimiento de Perfiles
1. Usuario abre app → Pantalla Principal
2. Ve grid de perfiles cercanos
3. Toca perfil para ver detalles
4. Desliza fotos para ver más
5. Toca Like/Pasar/Super Like
6. Si es match → Notificación

### Flujo 2: Chatear con Match
1. Usuario va a Matches
2. Toca un match
3. Se abre pantalla de Chat
4. Escribe y envía mensaje
5. Recibe respuesta en tiempo real

### Flujo 3: Editar Perfil
1. Usuario va a Perfil
2. Toca "Editar perfil"
3. Actualiza foto, bio, intereses
4. Guarda cambios

---

## Decisiones de Diseño

### Colores
- **Primario**: #FF1493 (Rosa fuerte/Magenta) - Representa energía y feminidad
- **Secundario**: #FF69B4 (Rosa claro) - Acentos y botones
- **Fondo**: #FFFFFF (Blanco) - Limpio y moderno
- **Texto**: #1A1A1A (Gris oscuro) - Legibilidad
- **Acentos**: #00CED1 (Turquesa) - Elementos interactivos

### Tipografía
- **Encabezados**: Bold, 24-28px
- **Subtítulos**: Semibold, 16-18px
- **Texto regular**: Regular, 14-16px
- **Pequeño**: Regular, 12-14px

### Iconografía
- Corazón lleno para Like
- X para Pasar
- Estrella para Super Like
- Chat bubble para mensajes
- Engranaje para configuración
- Persona para perfil

### Espaciado
- Padding general: 16px
- Gap entre elementos: 12px
- Border radius: 12px (tarjetas), 8px (botones)

---

## Funcionalidades Clave

### Geolocalización
- Mostrar distancia en km desde el usuario actual
- Actualizar ubicación cada 5 minutos
- Opción para ocultar ubicación exacta

### Sistema de Likes
- Like: Indica interés
- Super Like: Interés especial (notificación al otro usuario)
- Pasar: No interesado

### Matches
- Mutual Like = Match automático
- Notificación cuando hay match
- Acceso a chat inmediato

### Mensajería
- Mensajes en tiempo real
- Indicador de "escribiendo..."
- Historial persistente
- Opción para desaparecer mensajes (opcional)

### Seguridad
- Verificación de identidad opcional
- Reportar usuario
- Bloquear usuario
- Denunciar contenido inapropiado

---

## Consideraciones Técnicas

### Base de Datos
- Tabla de usuarios con perfil
- Tabla de likes/matches
- Tabla de mensajes
- Tabla de bloqueados

### API
- Obtener perfiles cercanos (basado en geolocalización)
- Crear/actualizar perfil
- Enviar like/pasar/super like
- Obtener matches
- Enviar/recibir mensajes

### Seguridad
- Autenticación con OAuth
- Encriptación de mensajes
- Validación de datos en servidor
- Rate limiting para prevenir spam

---

## Próximos Pasos
1. Configurar base de datos con esquema de usuarios, matches, mensajes
2. Implementar autenticación
3. Crear pantalla principal con grid de perfiles
4. Implementar sistema de likes
5. Crear pantalla de matches
6. Implementar mensajería en tiempo real
7. Agregar funcionalidades de seguridad
