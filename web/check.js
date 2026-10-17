const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
try {
  const s = c.split('<script>')[1].split('</script>')[0];
  new Function(s);
  console.log('JS syntax: OK');
} catch(e) {
  console.log('JS Error:', e.message);
}
console.log('Has HTTP:', /https?:/.test(c));
console.log('Has @import:', c.includes('@import'));
console.log('Has floatOrb:', c.includes('floatOrb'));
console.log('Has bg-gradient var:', c.includes('--bg-gradient'));
console.log('Has .bg:', c.includes('.bg'));
console.log('Has School Clicker:', c.includes('School Clicker'));