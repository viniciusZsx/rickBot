import fs from "fs";
import path from "path";
import { readJSON, writeJSON } from "../functions";
import { IAcash } from "../interfaces/IAcash";
import ffmpeg from "fluent-ffmpeg";
import { general } from "../configurations/general";

import { IBotData } from "../interfaces/IBotData";

import { downloadImage, downloadVideo, getRandomName } from "../functions";

export default async ({
  isImage,
  userJid,
  isVideo,
  webMessage,
  reply,
  sendSticker,
}: IBotData) => {

  if (!isImage && !isVideo) {
    return await reply(`⚠ Por favor, envie uma imagem ou um vídeo!`);
  }

  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "cash.json")
  ) as IAcash[];

  const money = json.find(({ id }) => id === userJid);

  if (money.dinheiro < 350) return reply(`Opa! vc não tem saldo suficiente para usar este comando. para ver seu saldo digite: ${general.prefix}perfil`)

  let preco = 350

  if (money.dinheiro >= 350) {
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

  await reply("Aguarde... Gerando figurinha... ⌛");

  const resultPath = path.resolve(
    __dirname,
    "..",
    "..",
    "assets",
    "temp",
    getRandomName("webp")
  );

  if (isImage) {
    const imagePath = await downloadImage(webMessage, getRandomName());

    ffmpeg(imagePath)
      .input(imagePath)
      .on("error", async (error: any) => {
        console.log(error);
        await reply(
          "❌ Ocorreu um erro ao gerar o seu sticker! Tente novamente mais tarde!"
        );
        fs.unlinkSync(imagePath);
      })
      .on("end", async () => {
        await sendSticker(resultPath);
        fs.unlinkSync(imagePath);
        fs.unlinkSync(resultPath);
      })
      .addOutputOptions([
        `-vcodec`,
        `libwebp`,
        `-vf`,
        `scale='min(200,iw)':min'(200,ih)':force_original_aspect_ratio=decrease,fps=15, pad=200:200:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
      ])
      .toFormat("webp")
      .save(resultPath);
  } else {
    const videoPath = await downloadVideo(webMessage, getRandomName());

    const sizeSeconds = 10;

    const isOKSecondsRules =
      (isVideo && webMessage?.message?.videoMessage?.seconds <= sizeSeconds) ||
      (isVideo &&
        webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.videoMessage?.seconds <= sizeSeconds);

    if (!isOKSecondsRules) {
      fs.unlinkSync(videoPath);

      await reply(
        `⚠ Esse vídeo tem mais de ${sizeSeconds} segundos ... Diminui ai!`
      );
    }

    ffmpeg(videoPath)
      .on("error", async (error) => {
        console.log(error);
        await reply(
          "❌ Ocorreu um erro ao gerar o seu sticker! Tente novamente mais tarde!"
        );
        fs.unlinkSync(videoPath);
      })
      .on("end", async () => {
        await sendSticker(resultPath);

        fs.unlinkSync(videoPath);
        fs.unlinkSync(resultPath);
      })
      .addOutputOptions([
        `-vcodec`,
        `libwebp`,
        `-vf`,
        `scale='min(200,iw)':min'(200,ih)':force_original_aspect_ratio=decrease,fps=30, pad=200:200:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
      ])
      .toFormat("webp")
      .save(resultPath);
  }
};
