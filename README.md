# ServiceNetGateway

This application was generated using JHipster 6.7.1, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v6.7.1](https://www.jhipster.tech/documentation-archive/v6.7.1).

This is a "gateway" application intended to be part of a microservice architecture, please refer to the [Doing microservices with JHipster][] page of the documentation for more information.

This application is configured for Service Discovery and Configuration with Consul. On launch, it will refuse to start if it is not able to connect to Consul at [http://localhost:8500](http://localhost:8500). For more information, read our documentation on [Service Discovery and Configuration with Consul][].

## Running Docker Hub hosted images

You can run ServiceNet with Docker Hub hosted Docker images with following commands.

With external DB and env variables setup:

    docker-compose -f src/main/docker/app-docker-registry.yml up -d

With Postgres in a container:

    docker-compose -f src/main/docker/app-docker-registry.yml -f src/main/docker/postgresql.yml up -d

With 'staging' version tag:

    SN_VERSION_TAG=staging docker-compose -f src/main/docker/app-docker-registry.yml up -d

Or set SN_VERSION_TAG inside .env file

## Running Docker Hub hosted images in Docker Swarm

Running with `docker-compose` as pre-processor of `.env` file:

     docker stack deploy -c <(docker-compose -f src/main/docker/app-docker-registry.yml config) sn

Running in a subshell with `.profile` file env variables configuration:

    (. ~/.profile && docker stack deploy -c src/main/docker/app-docker-registry.yml sn)

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    npm install

We use npm scripts and [Webpack][] as our build system.

Database: we are using postgres and database "ServiceNet". Each service in architecture should use its own schema. 
ServiceNet backend service is using 'public'. ServiceNetGateway is using schema 'gateway'. Create required schema 
for this service (if you don't have it). 

If you are using hazelcast as a cache, you will have to launch a cache server.
To start your cache server, run:

```
docker-compose -f src/main/docker/hazelcast-management-center.yml up -d
```

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

    docker-compose -f src/main/docker/app-dev-dependencies.yml up -d
    ./mvnw
    npm start

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all of the scripts available to run for this project.

### Backend services
After starting the docker containers using app-dev-dependencies.yml, you can simply run `./mvnw` in any backend service. It should register to the gateway and be available under `/services/<service_name>` url.
You can also build a docker image of these services, add them to `src/main/docker/app-dev.yml` and start the containers with:

   ``` 
   ./docker-compose.sh -f src/main/docker/app-dev.yml up -d
   ```
Please note that `docker-compose.sh` script was used in the above example to set the `HOST_IP` environment variable.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is commented out by default. To enable it, uncomment the following code in `src/main/webapp/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function() {
      console.log('Service Worker Registered');
    });
  }
</script>
```

Note: [Workbox](https://developers.google.com/web/tools/workbox/) powers JHipster's service worker. It dynamically generates the `service-worker.js` file.

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

    npm install --save --save-exact leaflet

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

    npm install --save-dev --save-exact @types/leaflet

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

## Building for production

### Packaging as jar

To build the final jar and optimize the ServiceNetGateway application for production, run:

    ./mvnw -Pprod clean verify

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

    java -jar target/*.jar

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

    ./mvnw -Pprod,war clean verify

## Testing

To launch your application's tests, run:

    ./mvnw verify

### Client tests

Unit tests are run by [Jest][] and written with [Jasmine][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

    npm test

For more information, refer to the [Running tests page][].

### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar
```

or

For more information, refer to the [Code quality page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a postgresql database in a docker container, run:

    docker-compose -f src/main/docker/postgresql.yml up -d

To stop it and remove the container, run:

    docker-compose -f src/main/docker/postgresql.yml down

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

    ./mvnw -Pprod verify jib:dockerBuild

Then run:

    docker-compose -f src/main/docker/app.yml up -d

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[jhipster homepage and latest documentation]: https://www.jhipster.tech
[jhipster 6.7.1 archive]: https://www.jhipster.tech/documentation-archive/v6.7.1
[doing microservices with jhipster]: https://www.jhipster.tech/documentation-archive/v6.7.1/microservices-architecture/
[using jhipster in development]: https://www.jhipster.tech/documentation-archive/v6.7.1/development/
[service discovery and configuration with consul]: https://www.jhipster.tech/documentation-archive/v6.7.1/microservices-architecture/#consul
[using docker and docker-compose]: https://www.jhipster.tech/documentation-archive/v6.7.1/docker-compose
[using jhipster in production]: https://www.jhipster.tech/documentation-archive/v6.7.1/production/
[running tests page]: https://www.jhipster.tech/documentation-archive/v6.7.1/running-tests/
[code quality page]: https://www.jhipster.tech/documentation-archive/v6.7.1/code-quality/
[setting up continuous integration]: https://www.jhipster.tech/documentation-archive/v6.7.1/setting-up-ci/
[node.js]: https://nodejs.org/
[yarn]: https://yarnpkg.org/
[webpack]: https://webpack.github.io/
[angular cli]: https://cli.angular.io/
[browsersync]: https://www.browsersync.io/
[jest]: https://facebook.github.io/jest/
[jasmine]: https://jasmine.github.io/2.0/introduction.html
[protractor]: https://angular.github.io/protractor/
[leaflet]: https://leafletjs.com/
[definitelytyped]: https://definitelytyped.org/

## End to End testing (optional)

End to end testing is run with protractor (https://www.protractortest.org/#/tutorial)

Required components:
1. Protractor 7
2. Chrome browser ver 84 (required by Protractor 7)

### Installation
To run tests first install protractor (might require to be installed globally):

    npm install -g protractor@7.0.0
    
Update webdriver manager:

    webdriver-manager update  

### Tests config

Required config is in the src/test/javascript/e2e/conf.js

Ensure that the same port for webdriver-manager server is specified in config file (4444 by default)

### Setup

Before performing tests, all microservices (core, gateway and auth) should be up and running.

Start webdriver manager in separate console:

    webdriver-manager start
    
To run ServiceNet demo tests type in console:

    protractor src/test/javascript/e2e/spec.js
