## Scope

6element is a open innovation project of waste optimisation.
[Learn more](http://ants.builders/pages/6element.html)


### Contributing

#### Getting started

Initialization

You can install [npm](https://github.com/nodesource/distributions#install-nodejs) 
and [docker](https://docs.docker.com/installation/ubuntulinux/#installing-docker-on-ubuntu)


````
git clone git@github.com:anthill/6element.git
cd 6element
npm install
docker pull postgres:9.4
````

Then, you must copy create the missing file

````
cp client/src/mapbox-credentials.json.example client/src/mapbox-credentials.json
````

Sign up to [mapbox](https://www.mapbox.com/)

Copy your default API access token and paste it in `/client/srcmapbox-creadentials.json` 

Create a new map (or use the default one) and copy its map ID and paste it in the same file.


````
npm run watch
````

In a new console

````
npm run start-db-container
npm run sql-generate
npm start
````

You can now open the returned URL



