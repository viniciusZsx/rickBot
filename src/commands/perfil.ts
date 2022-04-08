import { IBotData } from "../interfaces/IBotData";
import { readJSON } from "../functions";
import path from "path";
import { IAcash } from "../interfaces/IAcash";

export default async (botData: IBotData) => {

  const { userJid, webMessage, args, reply } = botData

  let parms = ""

  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "cash.json")
  ) as IAcash[];

  parms = args.replace("@", "") + "@s.whatsapp.net"

  if (!args) parms = userJid

  try {

    const money = json.find(({ id }) => id === parms);
    let sla = ""

    let situa = () => {
      let h = money.dinheiro
      if (h <= 100) return "Passando fome"

      if (h < 600) return "Mendigo"

      if (h < 1600) return "Pobre"

      if (h < 5200) return "Humilde"

      if (h < 6100) return "Rico"

      if (h < 10000) return "Empresario"


      return sla = "Pura riqueza"
    }

    let nome = webMessage.pushName

    let perfil = `
┏━━━━━「 Perfil 」━━━━
┣ 𖠁 
┣ 𖠁 | Usuario: ${webMessage.pushName}
┣ 𖠁 | Chave Pix: ${userJid.split("@")[0]}
┣ 𖠁 | Saldo: ${money.dinheiro}
┣ 𖠁 | Mensagens: ${money.menns}
┣ 𖠁 | Situação:  ${situa()}
┣ 𖠁
┗━━━━━━━━━━━━`
    if (args) perfil = `
┏━━━━━「 Solicitação de Perfil 」━━━━
┣ 𖠁 
┣ 𖠁 | Solicitado por: ${webMessage.pushName}
┣ 𖠁 | Chave Pix: ${userJid.split("@")[0]}
┣ 𖠁 | Saldo: ${money.dinheiro}
┣ 𖠁 | Mensagens: ${money.menns}
┣ 𖠁 | Situação:  ${situa()}
┣ 𖠁
┗━━━━━━━━━━━━`

    await reply(perfil)
  } catch {
    reply("Usuario não encontrado no meu banco de dados")
  }


};

