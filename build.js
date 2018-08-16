const path = require('path');
const assert = require('assert');
const Bundler = require('parcel-bundler');
const findCacheDir = require('find-cache-dir');
const pkg = require('./package.json');

const entryFile = path.resolve('src/index.js');

const clientConfig = {
  watch: false,
  hmr: false,
  autoinstall: false,
  logLevel: 1,
  cacheDir: findCacheDir({ name: pkg.name }),
  publicUrl: '/',
  outDir: path.resolve('dist/client'),
  target: 'browser',
  sourceMaps: false,
  cache: false,
};

const serverConfig = {
  ...clientConfig,
  outDir: path.resolve('dist/server'),
  target: 'node',
};

const clientBundler = new Bundler(entryFile, clientConfig);
const serverBundler = new Bundler(entryFile, serverConfig);

Promise.all([
  clientBundler.bundle(),
  serverBundler.bundle(), // <-- commenting out this line makes the assertion pass, resolution seems to be shared between compilers
]).then(([clientBundle, serverBundle]) => {
  // the debug/src/browser file is the "browser" entry for debug
  const debugBrowserLocation = require.resolve('debug/src/browser');
  const containsBrowserFile = !!Array.from(clientBundle.assets).find(item => item.name === debugBrowserLocation);
  assert(containsBrowserFile);
  // The process hangs when building both client and server, maybe due to managing a global worker-farm?
  process.exit();
});
