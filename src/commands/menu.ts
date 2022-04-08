import path from "path";
import { general } from "../configurations/general";
import { IBotData } from "../interfaces/IBotData";
import moment from "moment-timezone"
import { send } from "process";
import _template from "./_template";

const prefix = general.prefix

export default async ({ sendImage, socket, remoteJid, webMessage }: IBotData) => {

  const nome = webMessage.pushName

  let sla = ""

  let datT = () => {
    let h = new Date().getHours()
    if (h <= 5) return "Boa madrugada"
    
    if (h < 12) return "Bom dia"
    
    if (h < 18) return "Boa tarde"

    return sla = "Boa noite"
  }

  const hora = moment.tz('America/Sao_Paulo').format('HH:mm')

  const data = moment.tz('America/Sao_Paulo').format('DD/MM')

  const menu = `
󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩┏󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩󠀩━━「 ${datT()}👋 」 ━━━
┣ 𖠁 
┣ 𖠁 | Prazer, ${nome}. Seja bem-vindo! Me chamo Rick MD👋
┣ 𖠁 | Prefixo:「 ${general.prefix} 」
┣ 𖠁 | Criador:「 Vinicius 」
┣ 𖠁 | Contato:「 https://wa.me/558181896518 ]
┣ 𖠁 
┗━━━━━━━━━━━━
  
┏━━「 Data/Hora 」 ━━━​
┣ 𖠁 
┣ 𖠁 | Usuario: ${nome}
┣ 𖠁 | Data: ${data}
┣ 𖠁 | Hora: ${hora}
┣ 𖠁 
┗━━━━━━━━━━━━

━━「 Comandos 」 ━━━

┏━━ 「 Mídia 」 ━━━​
┣ 𖠁 
┣ 𖠁 | ${prefix}video
┣ 𖠁 | Preço: 250$
┣ ⇒ Ex: ${prefix}video tente não rir
┣ 𖠁 
┣ 𖠁 | ${prefix}extrair
┣ 𖠁 | Preço: 155$
┣ 𖠁 
┣ 𖠁 | ${prefix}play
┣ 𖠁 | Preço: 250$
┣ ⇒ Ex: ${prefix}play matue - quer voar
┣ 𖠁 
┣ 𖠁 | ${prefix}sticker
┣ 𖠁 | Preço: 350$
┣ ⇒ Obs: marque um video/imagem/gif com a mensagem: ?sticker, ou envie com a legenda: ${prefix}sticker
┣ 𖠁 
┗━━━━━━━━━━━━━━━━━━

┏━━ 「 Segurança 」 ━━━​
┣ 𖠁 
┣ 𖠁 | ${prefix}printsite
┣ 𖠁 | Preço: 275$
┣ ⇒ Ex: ${prefix}printsite https://www.google.com
┣ 𖠁 
┗━━━━━━━━━━━━━━━━━━━━━

┏━━ 「 Contato 」 ━━━​
┣ 𖠁 
┣ 𖠁 | ${prefix}linkme
┣ 𖠁 | Preço: 155$
┣ ⇒ Ex: ${prefix}linkme Oii tudo bom
┣ 𖠁 
┗━━━━━━━━━━━━━━━━━━━━

┏━━ 「 Pesquisas 」 ━━━​
┣ 𖠁 
┣ 𖠁 | ${prefix}netshoes
┣ 𖠁 | Preço: 155$
┣ ⇒ Ex: ${prefix}netshoes tenis nike
┣ 𖠁 
┗━━━━━━━━━━━━━━━━━━━━

┏━━ 「 Status 」 ━━━​
┣ 𖠁 
┣ 𖠁 | ${prefix}Status
┣ 𖠁 | Preço: 0$
┣ ⇒ Informações de status do bot
┣ 𖠁 
┗━━━━━━━━━━━━━━━━━━━

┏━━ 「 Plano de contrato 」 ━━━​
┣ 𖠁 
┣ 𖠁 | ${prefix}plano
┣ 𖠁 | Preço: 0$
┣ ⇒ Planos de contrato do bot
┣ 𖠁 
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
 await sendImage(
    path.resolve(__dirname, "..", "..", "assets", "images", "info.jpg"),
    menu
  ); return


};
