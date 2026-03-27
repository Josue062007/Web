# 📷 PhoneCam — Acceso Remoto a Cámaras

Accede a las cámaras (frontal y trasera) de cualquier celular desde tu computadora, **sin importar que estén en redes diferentes**.

## 🚀 Cómo Usar (Local)

```bash
cd PhoneCam
npm install
npm start
```

Abre `http://localhost:3000` en tu navegador.

## 🌍 Desplegar en Internet (Render.com - GRATIS)

Para acceso desde cualquier lugar del mundo:

1. **Crea una cuenta** en [render.com](https://render.com) (gratis)
2. **Sube el código a GitHub:**
   ```bash
   cd PhoneCam
   git init
   git add .
   git commit -m "PhoneCam initial"
   ```
   - Crea un repositorio en GitHub y súbelo
3. **En Render.com:**
   - Click "New" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente el `render.yaml`
   - Click "Create Web Service"
4. **¡Listo!** Render te dará una URL como `https://phonecam-xxxx.onrender.com`

## 📱 Conectar un Celular

1. En el celular, abre la URL en el navegador
2. Toca **"Soy el Celular"**
3. Toca **"Generar Código de Conexión"**
4. Dale permisos de cámara cuando pregunte
5. Aparecerá un código de 6 dígitos

## 💻 Ver desde la PC

1. En la PC, abre la misma URL
2. Click en **"Soy la PC"**
3. Ingresa el código de 6 dígitos del celular
4. Click **"Conectar"**
5. ¡Verás el video en vivo! 🎉

## ✨ Funciones

- 🔄 Cambiar entre cámara frontal y trasera
- 📸 Tomar capturas de pantalla
- ⛶ Modo pantalla completa
- 🔒 Conexión encriptada (WebRTC)
- 🌍 Funciona desde cualquier red
