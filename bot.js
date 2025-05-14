const mineflayer = require("mineflayer")
const Vec3 = require("vec3").Vec3
const { execSync } = require('child_process')
const { assert } = require("console")

let bot
createBot()
function createBot() {
  bot = mineflayer.createBot({
    host: "192.168.0.97",
    port: 25565,
    username: "bot_sword",
    version: '1.21',
    auth: "offline"
  })

  let loginDone = false
  let target = null
  let justAttacked = false
  let timer = 0
  let shouldLookAtPlayers = true // Novo booleano para controle

  bot.on("spawn", () => {
    if (!loginDone) {
      bot.chat("/login password")
      bot.chat("/skin daniel22cf")
      console.log("/login password")
      loginDone = true
    }
    bot.chat("/sword")
    console.log("/sword")
    bot.setControlState("sprint", true)
  })

  function lookAtNearestPlayer() {
    if (!shouldLookAtPlayers) return // Só executa se o modo estiver ativado

    const playerFilter = (entity) => entity.type === 'player'
    const playerEntity = bot.nearestEntity(playerFilter)
    if (!playerEntity) return

    const pos = playerEntity.position.offset(0, playerEntity.height, 0)
    bot.lookAt(pos)
  }

  bot.on("entityHurt", (entity) => {
    if (entity === bot.entity) {
      const attacker = bot.nearestEntity((e) => e.type === 'player' || e.type === 'mob')
      if (attacker) {
        target = attacker
        shouldLookAtPlayers = false // Desativa o modo "olhar para jogadores"
        console.log(`Alvo definido: ${target.username || target.name}`)
      }
    }
  })

  bot.on("death", () => {
    console.log("Fui morto! Parando o ataque.")
    target = null
    shouldLookAtPlayers = true // Volta a olhar para jogadores ao morrer
  })

  bot.on("physicsTick", () => {
    if (target && target.isValid) {
      const distance = bot.entity.position.distanceTo(target.position)
      const headPos = new Vec3(target.position.x, target.position.y + 1.75, target.position.z)
      bot.lookAt(headPos)

      bot.setControlState("sprint", false)

      if (distance <= 2.9 && distance >= 2.8) {
        bot.setControlState("jump", true)
        bot.setControlState("back", true)
        setTimeout(() => bot.setControlState("jump", false), 200)
        setTimeout(() => bot.setControlState("back", false), 200)
      }
      if (distance <= 2.7 && distance >= 2.1) {
        setTimeout(() => bot.setControlState("jump", false), 200)
        setTimeout(() => bot.setControlState("back", false), 200)
        bot.setControlState("sprint", true)
      }

      if (distance <= 2 && !justAttacked) {
        setTimeout(() => justAttacked = (false), 600, bot.setControlState("jump", false), 400)
        bot.setControlState("jump", true)
        bot.setControlState("sprint", true)
        bot.attack(target)
      }

      const canAttack = distance <= 2.95 && distance >= 0.5
      const isLookingAtTarget = bot.entityAtCursor(3.2)?.uuid === target.uuid

      if (canAttack && isLookingAtTarget) {
        bot.setControlState("left", Math.random() > 0.5)
        bot.setControlState("back", true)
        setTimeout(() => bot.setControlState("back", false), 200)
        bot.setControlState("right", !bot.controlState.left)
        bot.setControlState("forward", true)
        bot.setControlState("sprint", true)

        if (!justAttacked) {
          bot.attack(target)
          justAttacked = true
          setTimeout(() => justAttacked = false, 600)
          bot.setControlState("back", true)
          bot.setControlState("back", false)
          bot.setControlState("forward", true)
          bot.setControlState("sprint", true)
        }
        if (!justAttacked) {
          bot.attack(target)
          justAttacked = true
          setTimeout(() => justAttacked = false, 600)
          setTimeout(() => bot.setControlState("back", false), 100)
          bot.setControlState("back", false)
          bot.setControlState("forward", true)
          bot.setControlState("sprint", true)
        }
      } else {
        bot.setControlState("sprint", true)
        bot.setControlState("forward", true)
        bot.setControlState("left", Math.random() > 0.5, 600)
        bot.setControlState("right", !bot.controlState.left)
      }
    } else {
      // Sem alvo: limpa controles e reativa o modo "olhar para jogadores"
      bot.clearControlStates()
      shouldLookAtPlayers = true
      lookAtNearestPlayer() // Chama diretamente em vez de adicionar novo listener
    }
  })

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
