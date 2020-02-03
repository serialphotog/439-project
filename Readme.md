# Build Environment

The build environment for the project uses Gulp to handle building the Javascript resources. To use this, you need to first ensure that [NodeJS is installed](https://nodejs.org/en/). Next, ensure that the gulp-cli is installed on your system by running:

```
npm install -g gulp-cli
```

Afterward, simple clone the repository and enter the directory. Finally, install the dependencies from NPM:

```
git clone https://github.com/serialphotog/439-project.git
cd 439-project/
npm install
```

To run the build system, just run:

```
gulp
```

This will take care of bundling the Javascript resources, uglifying them, and generating the source maps.