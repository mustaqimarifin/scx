import { Options, defineConfig } from 'tsup';
import pkg from './package.json' assert { type: 'json' };

const baseConfig: Options = {
  entry: ['src/**/*'],
  external: [
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  target: 'es2020',
  platform: 'browser',
  format: ['esm'],
  treeshake: true,
  shims: false,
  dts: true,
};

export default defineConfig([
  /*   {
    ...baseConfig,
    outDir: 'build/dev',
    minify: false,
    sourcemap: false
  }, */
  {
    ...baseConfig,
    outDir: 'build',
    minify: false,
    sourcemap: false,
  },
]);
