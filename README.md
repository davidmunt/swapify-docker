# Swapify Backend - Proyecto Final

**Swapify Docker** es el backend de la aplicación móvil **Swapify**, desarrollado con NestJS y desplegado mediante Docker. Gestiona toda la lógica del servidor, base de datos, autenticación, productos, usuarios, etc.

---

##  ¿Cómo comenzar?

### 1. Clona el repositorio

```bash
git clone https://github.com/davidmunt/swapify-docker.git
```

### 2. Crea el archivo `.env`

En la raíz del proyecto, copia y pega el `.env` proporcionado en la carpeta compartida.

### 3. Levanta el entorno con Docker

Abre una terminal dentro de la carpeta del proyecto y ejecuta:

```bash
docker-compose up -d
```

### 4. Carga los datos iniciales (seed)

Una vez haya terminado de cargar `swapify-webserver`, ejecuta:

```bash
npm run seed
```

### 5. Ejecutar tests

Para correr los tests definidos en el proyecto:

```bash
npm run test
```

---

##  Desarrollado por

**David Muntean**
