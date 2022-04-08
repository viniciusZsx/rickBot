import { IBotData } from "../interfaces/IBotData";
import { y2mateV } from "../y2mate";
import axios from "axios"
import { getBuffer } from "../functions";
import yts from "yt-search";

export default async (botData: IBotData) => {

    const { reply, args, sendAudio } = botData

    let res = await yts(args)

    let es = await y2mateV(res.all[0].url)

    let bufferA = await getBuffer(es[0].link) 
    //@ts-ignore
      sendAudio(bufferA)
};
