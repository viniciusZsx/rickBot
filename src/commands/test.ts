import { IBotData } from "../interfaces/IBotData";
import axios from "axios"
import cheerio from "cheerio"

export default async (botData: IBotData) => {

    const { reply, args, sendFile, socket, sendImage } = botData

    reply("preocessando...")

    const { data } = await axios.get(`${args}`)

    const b = cheerio.load(data)

    const l = b('div#download_link').find('a#downloadButton').attr('href')

    const audioV = l


    const resposta = await axios.get(audioV, {
      responseType: "arraybuffer"
    })
  
    const bufferA = Buffer.from(resposta.data, "utf-8")

    reply("aguarde....")

    let p = {

        mimitype: 'file/zip',
    }
    
    sendFile(bufferA)


};
