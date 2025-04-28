const { execSync } = require('child_process');

// Função para instalar pacotes caso não estejam instalados
function instalarDependencias() {
  const pacotes = ['mineflayer', 'mineflayer-pathfinder', 'mineflayer-armor-manager', 'mineflayer-pvp', 'vec3', 'axios', 'node_characterai', 'minecraft-data'];
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
//async function startBots() {
 // console.log("Inciando bot_admin...");
  //require('./0bot_admin'); // Inicia o vanillazada
  //await delay(10000); // Espera 10 segundos (10.000 ms)

  //console.log("Iniciando bot_sword...");
  //require('./1bot_sword'); // Inicia o sword
  //await delay(10000); // Espera 10 segundos
    
  //console.log("Iniciando bot_smp...");
  //require('./2bot_smp'); // Inicia o smp
  //await delay(10000); // Espera 10 segundos
  
 //console.log("Iniciando bot_netherit_pot...");
 //require('./3bot_netherit_pot'); // Inicia o bot2
 //await delay(10000); // Espera 10 segundos

  //console.log("Iniciando bot_diamond_pot...");
  //require('./4bot_diamond_pot'); // Inicia o bot3 */
//}

// Chama a função para iniciar os bots
//startBots();
