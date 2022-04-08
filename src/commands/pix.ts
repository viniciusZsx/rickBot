import { IBotData } from "../interfaces/IBotData";
import { readJSON, writeJSON } from "../functions"
import { IAcash } from "../interfaces/IAcash"
import moment from "moment-timezone";
import path from "path";

export default async (botData: IBotData) => {

  const { reply, userJid, args, socket, webMessage, remoteJid } = botData

  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "cash.json")
  ) as IAcash[];

  const hora = moment.tz('America/Sao_Paulo').format('HH:mm')

  const data = moment.tz('America/Sao_Paulo').format('DD/MM')

  const money = json.find(({ id }) => id === userJid);

  let cahvePix = args.split("|")[0].trim().replace("@", "")

  let pix = args.split("|")[1].trim()

  let pi2 = parseInt(pix)
  //@ts-ignore
  if (money.dinheiro < pix) return reply(`Opa! vc não tem saldo suficiente para efetuar o pix`)
  //@ts-ignore
  if (money.dinheiro >= pix) {


    reply(`
Comprovante de transferencia

Eviado de: ${webMessage.pushName}
Para  chave Pix: ${cahvePix}
Valor: ${pix}
Horario: ${hora}
Data: ${data}`)


  }

  const pixA = json.find(({ id }) => id === cahvePix + "@s.whatsapp.net");

  if (money) {
    //@ts-ignore
    money.dinheiro = money.dinheiro - pix;
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

  let chaveP = cahvePix + "@s.whatsapp.net"
  if (pixA) {
    //@ts-ignore
    pixA.dinheiro = pixA.dinheiro + pi2;
  } else {
    json.push({
      id: chaveP,
      menns: pixA.menns,
      dinheiro: pixA.dinheiro,
      level: pixA.level,
     
    });
  }

  writeJSON(
    path.resolve(__dirname, "..", "..", "cache", "cash.json"),
    json
  );
};