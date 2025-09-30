// generateAdminPassword.js
const bcrypt = require('bcrypt');

const generateHash = async () => {
  const plainPassword = 'Admin@NayagaraLK'; 
  const hash = await bcrypt.hash(plainPassword, 10);
  
  console.log('Plain Password:', plainPassword);
  console.log('Hashed Password:', hash);
  console.log('\nCopy this hash and insert it into your database:');
  console.log(hash);
};

generateHash();