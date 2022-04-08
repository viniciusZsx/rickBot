import { IBotData } from "../interfaces/IBotData";

import { isAdmin, onlyNumbers } from "../functions";

export default async (botData: IBotData) => {
  const { reply, sendText, remoteJid, socket, args } = botData;

  if (!(await isAdmin(botData))) {
    return reply("🚫 Somente admins!");
  }

  try {
    await socket.groupParticipantsUpdate(
      remoteJid,
      [onlyNumbers(args) + "@s.whatsapp.net"],
      "add"
    );

    await sendText("✅ Número adicionado com sucesso!");
  } catch (error) {
    console.log(error);
    await sendText("❌ Erro ao adicionar o usuário!");
  }
};
