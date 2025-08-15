// Este script é responsável por iniciar a aplicação utilizando npm
// Certifique-se de que o Node.js e o npm estão instalados corretamente

const { exec } = require('child_process');

// Comando para iniciar a aplicação
exec('npm run dev', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao iniciar a aplicação: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Erro: ${stderr}`);
    return;
  }
  console.log(`Saída: ${stdout}`);
});