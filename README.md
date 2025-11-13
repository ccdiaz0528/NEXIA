# 🧠 Nexia - Tu Asistente IA con Memoria

**Nexia** es una aplicación web moderna de chat con inteligencia artificial que recuerda todo lo que le dices.

## ✨ Características

- 💬 **Chat en tiempo real** con respuestas inteligentes
- 🧠 **Memoria persistente**: Nexia recuerda tus conversaciones anteriores
- ⚡ **Interfaz limpia y simple**: Diseño minimalista y responsivo
- 💾 **Almacenamiento local**: Tu historial se guarda en tu navegador
- 🎯 **Sin dependencias externas**: Solo HTML, CSS y JavaScript puro

## 🚀 Cómo usar

### 1. Configurar la API Key

Edita el archivo `config.js` y reemplaza:

```javascript
API_KEY: 'AIzaSyAzcTiK-jgkyBUnreB4O5n0FmGTCMQna6M'
```

Con tu propia API Key de Google Gemini (obtén una en [Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Abrir la aplicación

Simplemente abre `index.html` en tu navegador.

### 3. Empezar a chatear

- Escribe tu mensaje en la caja de texto
- Presiona **Enter** o haz clic en el botón **➤**
- Nexia responderá recordando todo lo anterior

## 📁 Estructura de archivos

```
config.js      - Configuración (API Key, nombre de la app, etc.)
styles.css     - Estilos CSS simples y claros
script.js      - Lógica de la aplicación (chat + memoria)
index.html     - Estructura HTML
README.md      - Este archivo
```

## 🧠 Cómo funciona la memoria

1. **Almacenamiento local**: Los mensajes se guardan en `localStorage` del navegador
2. **Contexto en la API**: Se envía el historial a Gemini para que entienda el contexto
3. **Límite de memoria**: Se guardan los últimos 20 mensajes (configurable en `config.js`)
4. **Nueva conversación**: Al hacer clic en "Nueva conversación" se borra el historial

## ⚙️ Configuración

Edita `config.js` para personalizar:

- `APP_NAME` - Nombre de la aplicación
- `MAX_HISTORY` - Número máximo de mensajes a recordar (por defecto 20)
- `STORAGE_KEY` - Clave para el almacenamiento local
- `API_ENDPOINT` - Endpoint de la API (no cambiar normalmente)
- `MODEL` - Modelo de Gemini a usar (por defecto: gemini-2.0-flash)

## 🎨 Personalización

### Cambiar el nombre de la app

Edita en `config.js`:
```javascript
APP_NAME: 'Tu Nombre Aquí'
```

### Cambiar colores

Edita `styles.css` y busca las clases CSS principales:
- `.header` - Encabezado
- `.message.user` - Tus mensajes
- `.message.assistant` - Mensajes de Nexia
- `.btn-primary` - Botones principales

## 📋 Requisitos

- Un navegador moderno (Chrome, Firefox, Edge, Safari)
- Una API Key de Google Gemini (gratuita)
- Conexión a internet

## 🔒 Privacidad

- Tu historial se guarda **solo en tu navegador** (localStorage)
- Los mensajes se envían a Google para procesar con Gemini
- No hay servidor backend: todo es cliente-side

## 🐛 Solución de problemas

### "Desconectado" - API Key no válida
- Verifica tu API Key en `config.js`
- Asegúrate de tener acceso a Google Gemini API

### Los mensajes no se guardan
- Verifica que tu navegador permite localStorage
- Prueba en modo incógnito/privado

### Respuestas lentas
- Verifica tu conexión a internet
- El modelo gemini-2.0-flash puede tardar unos segundos

## 📝 Licencia

Libre para usar y modificar.

---

**¡Disfruta de Nexia! 🚀**
