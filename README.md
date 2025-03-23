# Swapify Backend - Proyecto Final

**Swapify Docker** es el backend de la aplicación móvil **Swapify**, desarrollado con NestJS y desplegado mediante Docker. Gestiona toda la lógica del servidor, base de datos, autenticación, productos, usuarios y más.

---

## 🚀 ¿Cómo comenzar?

### 1. Clona el repositorio

```bash
git clone https://github.com/davidmunt/swapify-docker.git
```

### 2. Crea el archivo `.env`

En la raíz del proyecto, crea un archivo llamado `.env` y copia dentro la información del archivo `.env` proporcionado (contiene datos confidenciales).

### 3. Levanta el entorno con Docker

Abre una terminal dentro de la carpeta del proyecto y ejecuta:

```bash
docker-compose up -d
```

Esto iniciará el backend junto a los servicios necesarios como MongoDB y otros definidos en el archivo `docker-compose.yml`.

### 4. Carga los datos iniciales (seed)

Una vez esté corriendo el contenedor llamado `swapify-webserver`, ejecuta:

```bash
npm run seed
```

Esto cargará datos iniciales para facilitar el desarrollo o pruebas.

### 5. Ejecutar tests

Para correr los tests definidos en el proyecto:

```bash
npm run test
```

---

## 📦 Tecnologías usadas

- NestJS (TypeScript)
- Docker y Docker Compose
- MongoDB
- GridFS para almacenamiento de archivos
- JWT para autenticación
- Swagger para documentación de la API
- IA (Pollinations) para recomendaciones inteligentes

---

## 📌 Requisitos

- Docker y Docker Compose instalados
- Archivo `.env` correctamente configurado

---

## 🔐 Funcionalidades del backend

- Registro e inicio de sesión con JWT
- CRUD de productos, usuarios, categorías, estados y más
- Subida de imágenes con GridFS
- Filtros por búsqueda, precio, categoría y cercanía
- IA para ordenar productos según visitas o categorías
- Chats entre usuarios e historial de mensajes
- Sistema de valoraciones tras compras
- Sistema de notificaciones push (Firebase)

---

## 🧑‍💻 Desarrollado por

**David Muntean**
