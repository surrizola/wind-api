# Gaucho wind

Estra información de viento desde pilote norden

## Running Locally

requerimientos [Node.js](http://nodejs.org/) andinstalled.

```sh
$ npm install
$ npm start
```

Se ingreso por [localhost:5000](http://localhost:5000/).




## Docker

  Start your application by running → docker compose up --build
  Your application will be available at http://localhost:5001

para correr en background
docker compose up --build -d

para apagarla desde el background
 docker compose down

Para build de docker
docker build -t surrizola/wind-api .

docker push surrizola/wind-api
docker push surrizola/wind-api:tagname


docker tag local-image:tagname new-repo:tagname
docker push new-repo:tagname