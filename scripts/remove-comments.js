const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Remove multi-line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove single-line comments (careful not to break URLs)
  // This regex matches // but NOT when preceded by : (to avoid http://)
  content = content.replace(/(?<!:)\/\/.*/g, '');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Cleaned: ${file}`);
});
