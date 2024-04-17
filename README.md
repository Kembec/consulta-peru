# Consulta RUC SUNAT Usando el padrón reducido

Este proyecto implementa una solución integrada en Python para el backend y React para el frontend, diseñada para permitir la consulta local de números de RUC sin depender de APIs externas, aprovechando el padrón reducido de la SUNAT.

## Componentes del Proyecto

### Backend

El backend se desarrolla utilizando Python y se orquesta mediante Docker para facilitar la implementación y la escalabilidad. La integración con ElasticSearch permite realizar búsquedas eficientes y rápidas dentro del padrón reducido.

#### Configuración

Antes de iniciar, copie el archivo `.env.template` a `.env` y ajuste las siguientes variables de entorno según su entorno de desarrollo o producción:

```plaintext
ELASTICSEARCH_USERNAME=elastic # Usuario por defecto de ElasticSearch, cambiar solo si es necesario
ELASTICSEARCH_PASSWORD= # Contraseña de ElasticSearch
URL= # URL del frontend para manejar CORS
PORT= # Puerto para el servidor API
DEBUG= # True para desarrollo, False para producción
```

#### Estructura de Archivos

- `indexer.py`: Script para indexar el padrón reducido en ElasticSearch. Es necesario descargar el archivo del padrón de SUNAT y colocarlo en la carpeta `data`.
- `searcher.py`: Módulo para realizar consultas de RUC desde la línea de comando, útil para depuración y pruebas.
- `app.py`: Servidor Flask que expone endpoints REST para las consultas de RUC.

#### Comandos para Docker

Utilice los siguientes comandos para construir y desplegar el backend:

```bash
docker-compose build && docker-compose up -d
docker-compose run app python /usr/src/app/indexer.py # Indexar base de datos
docker-compose run app python /usr/src/app/searcher.py # Prueba de la funcionalidad de búsqueda
docker-compose run app python /usr/src/app/app.py # Iniciar el servidor API
```

### Frontend

Desarrollado en React, el frontend proporciona una interfaz de usuario limpia y funcional para la interacción con el backend.

#### Configuración de Entorno

Configure el archivo `.env` en la raíz del directorio del frontend con la siguiente variable:

```plaintext
VITE_API_URL=http://localhost:5000 # Ajustar según el URL del backend
```

#### Despliegue

Para compilar y desplegar el frontend en un entorno de producción, ejecute:

```bash
pnpm run build # Compila el proyecto para producción
```

Para desarrollo, puede utilizar:

```bash
pnpm start # Inicia el servidor de desarrollo
```

### Licencia

Este proyecto se distribuye bajo la licencia AGPL-3.0, lo que garantiza que las modificaciones al código fuente permanezcan accesibles para la comunidad.

