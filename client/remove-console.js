const fs = require('fs');
const path = require('path');

function removeConsoleLogs(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'node_modules') {
      removeConsoleLogs(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Remove console.log, console.error, console.warn, console.debug, console.info
      // Handle both single and multiline console statements
      content = content.replace(/console\.(log|error|warn|debug|info)\s*\([^)]*\);?/g, '');

      // Remove empty lines left behind
      content = content.replace(/^\s*[\r\n]/gm, match => match.length > 2 ? '\n' : '');

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Processed: ${filePath}`);
    }
  });
}

const srcDir = path.join(__dirname, 'src');
removeConsoleLogs(srcDir);
console.log('All console statements removed!');
