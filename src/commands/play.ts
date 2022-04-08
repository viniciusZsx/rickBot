import axios from "axios";
import path from "path";
import yts from "yt-search";
import { Youtube } from "ytdownloader.js"
import { readJSON, writeJSON } from "../functions";
import { general } from "../configurations/general";
import { IAcash } from "../interfaces/IAcash";

import { IBotData } from "../interfaces/IBotData";

export default async ({ reply, sendImage, sendAudio, userJid, args }: IBotData) => {

  if (!args) return reply(`Ex: ${general.prefix}play matue quer voar`)


  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "cash.json")
  ) as IAcash[];

  const money = json.find(({ id }) => id === userJid);

  if (money.dinheiro < 255) return reply(`Opa! vc não tem saldo suficiente para usar este comando. para ver seu saldo digite: ${general.prefix}perfil`)

  let preco = 255

  if (money.dinheiro >= 255) {
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

  const result = await yts(args);

  if (!result || !result.videos.length) {
    return await reply(`⚠ Nenhuma música encontrada!`);
  }

  const video = result.videos[0];

  const secondsT = video.duration.seconds

  const limite = 300

  if (secondsT > limite) {
    reply(`Este audio ultrapassou o limite de duração. limite permitido são de 5min
CashBack efetuado! saldo atual: ${money.dinheiro + preco}`)
    json.push({
      id: userJid,
      menns: money.menns,
      dinheiro: money.dinheiro + preco,
      level: money.level,
    });
    writeJSON(
      path.resolve(__dirname, "..", "..", "cache", "cash.json"),
      json
    );
    return
  }

  const response = await axios.get(video.image, {
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(response.data, "utf-8");

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

  await sendImage(
    buffer,
    `
▢ • Dados encontrados
  
▢ • Título: ${video.title}
▢ • Descrição: ${video.description}
▢ • Duração: ${video.timestamp}${dateText}

▢ • Realizando download...`
  );

  const audioV = await new Youtube().ytmp3(`${video.title}`, true)


  const resposta = await axios.get(audioV.dl_link, {
    responseType: "arraybuffer"
  })

  const bufferA = Buffer.from(resposta.data, "utf-8")

  reply("So um instante..")

  sendAudio(bufferA)

};

