import fs from "fs";
import path from "path";

import ffmpeg from "fluent-ffmpeg";
import { IBotData } from "../interfaces/IBotData";
import { downloadVideo, getRandomName } from "../functions";

export default async ({
    isVideo,
    webMessage,
    reply,
    sendVideo,
  }: IBotData) => {
    if (!isVideo) {
      return await reply(`⚠ Por favor, envie ou marque um vídeo!`);
      
    }

    let nome = webMessage.pushName
  
    await reply(`Espera um minutinho ai ${nome}! to transformando seu gif em video`);

    const resultPath = path.resolve(
        __dirname,
        "..",
        "..",
        "assets",
        "temp",
        getRandomName("mp4")
      );

    if (isVideo) {
        const videoPath = await downloadVideo(webMessage, getRandomName());

        ffmpeg(videoPath)
      .on("error", async (error) => {
        console.log(error);
        await reply(
          "❌ Ocorreu um erro ao gif transformar em video"
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