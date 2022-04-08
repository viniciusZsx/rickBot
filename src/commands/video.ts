import { IBotData } from "../interfaces/IBotData";
import { Youtube } from "ytdownloader.js";
import yts from "yt-search";
import axios from "axios";
import { readJSON, writeJSON } from "../functions";
import path from "path";
import { general } from "../configurations/general";
import { IAcash } from "../interfaces/IAcash";

export default async (botData: IBotData) => {

  const { sendVideo, reply, args, userJid, sendImage } = botData

  if (!args) return reply("Digite o nome do video")

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

  const maxLength = 100;

  if (!args || args.length > 100) {
    return await reply(`⚠ Limite de ${maxLength} caracteres por pesquisa!`);
  }

  if (args.includes("https://youtu") || args.includes("https://")) return reply("Opa! temos problemas em buscar por link. Por favor digite o nome do video")

  reply("Pesquisando...")

  const result = await yts(args);

  if (!result || !result.videos.length) {
    return await reply(`⚠ Nenhuma música encontrada!`);
  }

  const video = result.videos[0];

  const secondsT = video.duration.seconds

  const limite = 900

  if (secondsT > limite) return reply(`Este video ultrapassou o limite de duração. limite permitido são de 15min`)

  const vider = await new Youtube().ytmp4(`${video.title}`, true)

  let dateText = "";

  if (video.ago) {
    dateText = `\n▢ • Data: ${video.ago
      .replace("days", "dias")
      .replace("day", "dia")
      .replace("year", "ano")
      .replace("month", "mês")
      .replace("ago", "atrás")
      .replace("years", "anos")
      .replace("months", "meses")}`;
  }

  const response = await axios.get(video.image, {
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(response.data, "utf-8");

  await sendImage(
    buffer,
    `
▢ • Dados encontrados
▢ • Título: ${video.title}
▢ • Descrição: ${video.description}
▢ • Duração: ${video.timestamp}${dateText}    
▢ • Realizando download...`
  );

  try {
    const resposta = await axios.get(vider.dl_link, {
      responseType: "arraybuffer"
    })

    const bufferI = Buffer.from(resposta.data, "utf-8")

    await reply("Carregando...")

    await sendVideo(bufferI,
      `▢ • Título: ${video.title}
▢ • Descrição: ${video.description}
${dateText}
▢ • Fonte: ${video.url}
        `
    )

  } catch {
    await reply("Tive um erro ao baixar o video, tente novamente")
  }

}
