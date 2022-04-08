import { IBotData } from "../interfaces/IBotData";
import web from "web-screenshot.js"
import { readJSON, writeJSON } from "../functions";
import { general } from "../configurations/general";
import path from "path";
import { IAcash } from "../interfaces/IAcash";

export default async (botData: IBotData) => {

  const { sendImage, reply, userJid, args } = botData

  if (!args) return reply("Opa! cade o link?")

  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "cash.json")
  ) as IAcash[];

  const money = json.find(({ id }) => id === userJid);

  if (money.dinheiro < 275) return reply(`Opa! vc não tem saldo suficiente para usar este comando. para ver seu saldo digite: ${general.prefix}perfil`)

  let preco = 275

  if (money.dinheiro >= 275) {
    await reply(`Pagamento efetuado! saldo anterior: ${money.dinheiro}, saldo atual: ${money.dinheiro - preco}`)

  }


  if (money) {
    money.dinheiro = money.dinheiro - preco;
  } else {
    json.push({
      id: userJid,
      menns: money.menns,
      dinheiro: money.dinheiro,
      level: money.level,
      
    });
  }

  writeJSON(
    path.resolve(__dirname, "..", "..", "cache", "cash.json"),
    json
  );

  const tamanho = 100

  if (args.length > tamanho) return reply("Opa amigão! seu link é muito grande, limite de caracteres atingido!!")

  let rl = args

  if (!args.includes("https://")) {
    reply("Formatando o seu link...")
    rl = "https://" + args
  }

  reply("Aguarde...")

  console.log(rl)

  let imagem = await web.capture(rl)


  sendImage(imagem,
    "Print tirado com sucesso!")


};
