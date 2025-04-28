const mineflayer = require("mineflayer")
const Vec3 = require("vec3").Vec3
const { execSync } = require('child_process');
const { assert } = require("console");

let bot
createBot()
function createBot() {
  bot = mineflayer.createBot({
    host: "192.168.0.01", //pode ser o dominio ou ip numerico, e ate mesmo localhost
    port: 25565,
    username: "bot_sword", //nome do bot
    auth: "offline"
  })

  let loginDone = false
  let target = null // Aqui guardamos quem atacou o bot
  let justAttacked = false
  let timer = 0

  bot.on("spawn", () => {
    if (!loginDone) { //esta funcção foi feita para entrar com auth: "offiline" caso mude para online. nao é nessesario alteração
      bot.chat("/login password")
      console.log("/login password")
      loginDone = true
    }
    bot.chat("/sword")
    console.log("/sword")
    bot.setControlState("sprint", true)
  })

  bot.on("message", (message) => {
    console.log(message.toAnsi())
  })

  // Evento quando o bot leva dano
  bot.on("entityHurt", (entity) => {
    if (entity === bot.entity) {
      // Se o próprio bot levou dano, pega quem está mirando nele
      const attacker = bot.nearestEntity((e) => e.type === 'player' || e.type === 'mob')
      if (attacker) {
        console.log("Fui atacado por", attacker.username || attacker.name)
        target = attacker
      }
    }
  })

  // Se o bot morrer, limpa o alvo
  bot.on("death", () => {
    console.log("Fui morto! Parando o ataque.")
    target = null
  })

  bot.on("physicsTick", () => {
    if (target && target.isValid) {
        // Calcula distância e mira no alvo (cabeça)
        const distance = bot.entity.position.distanceTo(target.position);
        const headPos = new Vec3(target.position.x, target.position.y + 1.75, target.position.z);
        bot.lookAt(headPos);

        bot.setControlState("sprint", false);

        // Pulo se o alvo estiver MUITO perto (< longe blocos)
        if (distance <= 2.9 && distance >= 2.8) {
            bot.setControlState("jump", true);
            bot.setControlState("back", true);
            setTimeout(() => bot.setControlState("jump", false), 200);
            setTimeout(() => bot.setControlState("back", false), 200);
            }
        if (distance <= 2.7 && distance >= 2.1) {
              setTimeout(() => bot.setControlState("jump", false), 200);
              setTimeout(() => bot.setControlState("back", false), 200);
              bot.setControlState("sprint", true);
            }

        if (distance <= 2 && !justAttacked) {
          setTimeout(() => justAttacked = (false), 600, bot.setControlState("jump", false), 400)
          bot.setControlState("jump", true);
          bot.setControlState("sprint", true);
          bot.attack(target);

 }

        // Define alcance de ataque dinâmico (entre 2.8 e 3.2 blocos)
        const canAttack = distance <= 2.95 && distance >= 0.5;
        const isLookingAtTarget = bot.entityAtCursor(3.2)?.uuid === target.uuid;

        if (canAttack && isLookingAtTarget) {
            // Movimento tático: alterna entre esquerda/direita
            
            bot.setControlState("left", Math.random() > 0.5);
            bot.setControlState("back", true);
            setTimeout(() => bot.setControlState("back", false), 200);
            bot.setControlState("right", !bot.controlState.left);
            bot.setControlState("forward", true);
            bot.setControlState("sprint", true);
             // Para de correr

            // Ataca com cooldown
            if (!justAttacked) {
                bot.attack(target);
                justAttacked = true;
                setTimeout(() => justAttacked = false,600); // Cooldown de 0.6s
                bot.setControlState("back", true);
                bot.setControlState("back", false)
                bot.setControlState("forward", true);
                bot.setControlState("sprint", true);
            }
             if (!justAttacked) {
                bot.attack(target);
                justAttacked = true;
                setTimeout(() => justAttacked = false,600); // Cooldown de 0.6s
                setTimeout(() => bot.setControlState("back", false), 100);
                bot.setControlState("back", false)
                bot.setControlState("forward", true);
                bot.setControlState("sprint", true);
            }
        } else {
            // Persegue o alvo se estiver fora do alcance
            bot.setControlState("sprint", true);
            bot.setControlState("forward", true);
            bot.setControlState("left", Math.random() > 0.5, 600);
            bot.setControlState("right", !bot.controlState.left);
            
        }
    } else {
        // Sem alvo, fica parado
        bot.clearControlStates();
    }
});

  // Eventos para reconectar se cair
  bot.on("end", () => {
    console.log("Bot desconectado! Tentando reconectar em 5 segundos...")
    setTimeout(createBot, 5000)
  })

  bot.on("error", (err) => {
    console.log("Erro no bot:", err)
    console.log("Tentando reconectar em 5 segundos...")
    setTimeout(createBot, 5000)
  })

  bot.on("kicked", (reason) => {
    console.log("Bot foi kickado:", reason)
    console.log("Tentando reconectar em 5 segundos...")
    setTimeout(createBot, 5000)
  })
}
