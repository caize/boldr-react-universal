# Boldr React Universal

A **bold** React starter project for your next great universal application.

## Features
- Lightweight / easy on dependencies
- A pleasant developer experience conductive to getting things done
- Webpack 2
- Hot module replacement

## Demo

## Usage

### Development
Getting up and running for development is easy.  

```bash
git clone git@github.com:strues/boldr-react-universal.git  
cd boldr-react-universal  
```

Install the dependencies `npm install` and `cp example.env .env`.  

Start the development process with `npm run dev`

### Production
Running the two commands below will compile your application and serve the production ready build.

```bash
  $ npm run build  
  $ npm start
```

Your application will start running on port 3000. This is configurable from the package.json. Modify the betterScripts start command's port.


## Notes
- There is a [problem with postcss-import](https://github.com/postcss/postcss-import/issues/220) and Webpack. It's important that you do **not** update `postcss-import` past version 8.1.0 until it is resolved.

## Resources
-
-

## Alternatives
- [`React Universally`](https://github.com/ctrlplusb/react-universally)  
An ultra low dependency node v6 universal react boilerplate with an amazing dev experience.
- [`React Webpack Node`](https://github.com/choonkending/react-webpack-node)  
Your One-Stop solution for a full-stack app with ES6/ES2015 React.js featuring universal Redux, React Router, React Router Redux Hot reloading, CSS modules, Express 4.x, and multiple ORMs.


## Contributing
