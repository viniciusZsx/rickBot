import { IBotData } from "../interfaces/IBotData";
import { isAdmin } from "../functions"

export default async (botData: IBotData) => {

    const { reply, socket, remoteJid } = botData

    if (!isAdmin) throw reply("Somente admins")

    let link = socket.groupInviteCode(remoteJid)

    reply("Link: " + link)
};
