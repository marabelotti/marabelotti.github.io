// GitHub Pages serves `/404.html` for unknown paths. Analog prerenders the
// custom not-found route to `404/index.html`, so mirror it to `404.html`.
import { copyFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const publicDir = join(process.cwd(), 'dist', 'analog', 'public');
const from = join(publicDir, '404', 'index.html');
const to = join(publicDir, '404.html');

try {
  await access(from);
  await copyFile(from, to);
  console.log('postbuild: wrote 404.html');
} catch (err) {
  console.warn('postbuild: skipped 404.html —', err.message);
}
