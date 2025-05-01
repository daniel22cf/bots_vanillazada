const { execSync } = require('child_process');

// Função para instalar pacotes caso não estejam instalados
function instalarDependencias() {
  const pacotes = ['mineflayer', 'mineflayer-pathfinder', 'mineflayer-armor-manager', 'mineflayer-pvp', 'vec3', 'axios', 'node_characterai', 'minecraft-data']; // não são nescesarias todas as dependencias, porém coloquei todas porque outros projetos que eu uso usam essas. e em breve eles estarão aqui
  pacotes.forEach(pacote => {
    try {
      require.resolve(pacote);
      console.log(`O pacote "${pacote}" já está instalado.`);
    } catch (err) {
      console.log(`O pacote "${pacote}" não está instalado. Instalando...`);
      try {
        execSync(`npm install ${pacote}`, { stdio: 'inherit' });
        console.log(`Pacote "${pacote}" instalado com sucesso.`);
      } catch (installErr) {
        console.error(`Erro ao instalar o pacote "${pacote}":`, installErr.message);
      }
    }
  });
}

// Instalar dependências antes de iniciar o bot
instalarDependencias();
// Função para adicionar um delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função assíncrona para iniciar os bots com delay
async function startBots() {
  console.log("Inciando bot...");
  require('./bot'); // Inicia o vanillazada
  await delay(10000); // Espera 10 segundos (10.000 ms)

// Chama a função para iniciar os bots
startBots();
