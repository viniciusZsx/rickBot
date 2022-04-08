import fs from "fs";
import path from "path";
import { readJSON, writeJSON } from "../functions";
import { IAcash } from "../interfaces/IAcash";
import { general } from "../configurations/general";
import ffmpeg from "fluent-ffmpeg";
import { IBotData } from "../interfaces/IBotData";
import { downloadVideo, getRandomName } from "../functions";

export default async ({
    isVideo,
    webMessage,
    userJid,
    reply,
    sendAudio,
  }: IBotData) => {

    const json = readJSON(
      path.resolve(__dirname, "..", "..", "cache", "cash.json")
    ) as IAcash[];
  
    const money = json.find(({ id }) => id === userJid);
  
    if (money.dinheiro < 155) return reply(`Opa! vc não tem saldo suficiente para usar este comando. para ver seu saldo digite: ${general.prefix}perfil`)
  
    let preco = 155
  
    if (money.dinheiro >= 155) {
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

    if (!isVideo) {
      return await reply(`⚠ Por favor, envie ou marque um vídeo!`);
      
    }

    let nome = webMessage.pushName
  
    await reply(`Espera um minutinho ai ${nome}! to extraindo seu audio`);

    const resultPath = path.resolve(
        __dirname,
        "..",
        "..",
        "assets",
        "temp",
        getRandomName("mp3")
      );

    if (isVideo) {
        const videoPath = await downloadVideo(webMessage, getRandomName());

        ffmpeg(videoPath)
      .on("error", async (error) => {
        console.log(error);
        await reply(
          "❌ Ocorreu um erro ao extrair o audio"
        );
        fs.unlinkSync(videoPath);
      })
      .on("end", async () => {
        await sendAudio(resultPath);

        fs.unlinkSync(videoPath);
        fs.unlinkSync(resultPath);
      })
      .toFormat("mp3")
      .save(resultPath);

    }

}