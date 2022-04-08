import path from "path";
import axios from "axios";
import cheerio from "cheerio"
import { IBotData } from "../interfaces/IBotData";
import { general } from "../configurations/general";
import { writeJSON, readJSON } from "../functions";
import { IAcash } from "../interfaces/IAcash";

export default async (botData: IBotData) => {

  const { sendImage, args, reply, userJid, remoteJid, command } = botData

  if (!args) return reply("Digite algo para a busca")


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

  if (userJid === general.dono) {

    if (!args) return reply("Digite algo para a busca")

    reply(general.aguarde)

    const maxLength = 50;

    if (!args || args.length > 50) {
      return await reply(`⚠ Limite de ${maxLength} caracteres por pesquisa!`);
    }


    const url = `https://www.netshoes.com.br/busca?nsCat=Natural&q=${args}`

    const { data } = await axios.get(url)

    const $ = cheerio.load(data)

    try {
      let title = $("div.wrapper > a").attr("title")

      let link = $("div.wrapper > a").attr("href")

      let img = $("div.item-card__images__image-link > img").attr("data-src")

      let star = $("div.item-card__description__stars > span > i").text()

      let linkL = "https:" + link


      const resposta = await axios.get(img, {
        responseType: "arraybuffer"
      })

      const bufferI = Buffer.from(resposta.data, "utf-8")

      reply("Quase la..")

      sendImage(bufferI,
        `
╭━━ ⪩ *RESULTADO* ⪨━━
▢ • Netshoes "${args}"
▢ •
▢ • Titulo: ${title}
▢ • Estrelas: ${star[0]}
▢ • Link: ${linkL}
`)

    } catch {

      reply("Não encontramos resultados para sua pesquisa")

    } return
  }



};
