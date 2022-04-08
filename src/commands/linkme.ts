import { IBotData } from "../interfaces/IBotData";
import { readJSON, writeJSON } from "../functions";
import { general } from "../configurations/general";
import { IAcash } from "../interfaces/IAcash";
import path from "path";

export default async (botData: IBotData) => {

  const { reply, remoteJid, userJid, args } = botData

  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "cash.json")
  ) as IAcash[];

  const money = json.find(({ id }) => id === userJid);

  if (money.dinheiro < 250) return reply(`Opa! vc não tem saldo suficiente para usar este comando. para ver seu saldo digite: ${general.prefix}perfil`)

  let preco = 250

  if (money.dinheiro >= 250) {
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

  let msg = args
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")
    .replace(" ", "%20")

  if (!args) {
    msg = "Iae"
  }

  const tamanho = 150

  if (args.length > tamanho) return reply("Opa! limite de caracteres atingido")

  let numero = remoteJid

  if (numero.includes("@g")) {
    numero = userJid
  }

  const wame = `Link gerado com sucesso!!
▢ • Link:https://api.whatsapp.com/send?phone=${numero.split("@")[0]}&text=${msg}`

  reply(`${wame}`)

};