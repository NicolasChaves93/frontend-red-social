# Red Social - Frontend

Aplicación frontend de una red social moderna desarrollada con React, TypeScript y Vite. Esta aplicación permite a los usuarios registrarse, iniciar sesión, publicar contenido, dar likes y gestionar sus perfiles.

## Características

- **Autenticación de usuarios**: Registro e inicio de sesión con JWT
- **Gestión de perfil**: Ver y editar información de perfil
- **Publicaciones**: Crear, ver y dar likes a publicaciones
- **Diseño responsive**: Interfaz adaptable a diferentes dispositivos
- **Componentes reutilizables**: Botones, inputs, tarjetas, etc.
- **Gestión de estado**: Implementación con Zustand para un estado global eficiente

## Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (Manejo de estado)
- React Router v6
- Axios (Peticiones HTTP)
- date-fns (Formateo de fechas)

## Instalación

### Requisitos previos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos para instalar

1. Clona el repositorio:

```bash
git clone https://github.com/NicolasChaves93/frontend-red-social.git
cd frontend-red-social
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

4. Abre tu navegador en `http://localhost:5173`

## Despliegue con Docker

### Construir la imagen

```bash
docker build -t frontend-red-social .
```

### Ejecutar el contenedor

```bash
docker run -p 80:80 frontend-red-social
```

### Usando Docker Compose

```bash
docker-compose up -d
```

Para detener los contenedores:

```bash
docker-compose down
```

## Estructura del proyecto

```
src/
├── app/                    # Configuración global
│   ├── router.tsx          # Configuración de rutas
│   └── layout/             # Layouts de la aplicación
│
├── features/               # Organización por dominio funcional
│   ├── auth/               # Autenticación
│   ├── posts/              # Publicaciones
│   └── profile/            # Perfiles de usuario
│
├── shared/                 # Utilidades reutilizables
│   ├── components/         # Componentes compartidos
│   ├── hooks/              # Hooks personalizados
│   ├── types/              # Tipos compartidos
│   └── utils/              # Utilidades
│
└── styles/                 # Estilos globales
```

## API Backend

La aplicación se conecta a un API REST con las siguientes características:

- URL Base: `http://localhost:3000/api`
- Endpoints principales:
  - Autenticación: `/auth/login`, `/auth/register`
  - Perfil: `/users/profile`, `/users/:id`
  - Publicaciones: `/posts`, `/posts/:id/like`

## Licencia

[MIT](LICENSE)
