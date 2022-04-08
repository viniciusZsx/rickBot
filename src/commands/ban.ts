import { IBotData } from "../interfaces/IBotData";

import { isAdmin } from "../functions";

export default async (botData: IBotData) => {
  const { reply, sendText, remoteJid, socket, args, replyJid } = botData;

  if (!(await isAdmin(botData))) {
    return reply("🚫 Somente admins!");
  }

  const parameter = replyJid || args.replace("@", "");

  const { participants } = await socket.groupMetadata(remoteJid);

  const jids = participants.map(({ id }) => id);

  const jidToBan = jids.find((jid: string) => jid.includes(parameter));

  try {
    await socket.groupParticipantsUpdate(remoteJid, [jidToBan], "remove");

    await sendText("✅ Número banido com sucesso!");
  } catch (error) {
    await sendText("❌ Erro ao banir o usuário!");
  }
};
