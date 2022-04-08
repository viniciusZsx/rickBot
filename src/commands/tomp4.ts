import fs from "fs";
import path from "path";

import ffmpeg from "fluent-ffmpeg";
import { IBotData } from "../interfaces/IBotData";
import { downloadAudio, downloadVideo, getRandomName } from "../functions";

export default async ({
    isAudio,
    webMessage,
    reply,
    sendVideo,
  }: IBotData) => {
    if (!isAudio) {
      return await reply(`⚠ Por favor, envie ou marque um vídeo!`);
      
    }

    let nome = webMessage.pushName
  
    await reply(`Espera um minutinho ai ${nome}! to transformando seu audio em video`);

    const resultPath = path.resolve(
        __dirname,
        "..",
        "..",
        "assets",
        "temp",
        getRandomName("mp4")
      );

    if (isAudio) {
        const videoPath = await downloadAudio(webMessage, getRandomName());

        ffmpeg(videoPath)
      .on("error", async (error) => {
        console.log(error);
        await reply(
          "❌ Ocorreu um erro ao transformar audio em video"
        );
        fs.unlinkSync(videoPath);
      })
      .on("end", async () => {
        await sendVideo(resultPath);

        fs.unlinkSync(videoPath);
        fs.unlinkSync(resultPath);
      })
      .toFormat("mp4")
      .save(resultPath);

    }

}