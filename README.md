# portal

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Docker Setup

## Step 1: Build Local Docker Image
```
docker build -t servu_portal .
```

## Step 2: Run Locally Build Docker Image
```
docker run -it -v /${PWD}:/app -v /app/node_modules -p 8080:8080 --rm servu_portal
```