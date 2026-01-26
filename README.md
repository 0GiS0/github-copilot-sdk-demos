Vamos a generar la imagen:

```bash
docker build -t github-copilot-cli-server-mode:v3 .
```

Y luego creamos un contenedor basado en esa imagen al que le pasamos el .env con la variable de entorno necesaria:

```bash
docker run --name github-copilot-cli-server-mode --env-file .env -p 8080:8080 --rm github-copilot-cli-server-mode:v3
```

# Desplegar en Azure
