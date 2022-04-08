import path from "path";

import { general } from "../configurations/general";
import { isAdmin, readJSON, writeJSON } from "../functions";
import { IAntiLink } from "../interfaces/IAntiLink";
import { IBotData } from "../interfaces/IBotData";

export default async (botData: IBotData) => {
  const { reply, remoteJid, args } = botData;

  if (!(await isAdmin(botData))) {
    return reply("🚫 Somente admins!");
  }

  if (!args || !["on", "off"].includes(args.trim())) {
    return reply(`🚫 Use: ${general.prefix}antilink on/off`);
  }

  const active = args.trim() === "on";

  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "antilink.json")
  ) as IAntiLink[];

  const antiLink = json.find(({ group_jid }) => group_jid === remoteJid);

  if (antiLink) {
    antiLink.active = active;
  } else {
    json.push({
      group_jid: remoteJid,
      active,
    });
  }

  writeJSON(
    path.resolve(__dirname, "..", "..", "cache", "antilink.json"),
    json
  );

  await reply(`✅ Antilink ${active ? "ativado" : "desativado"} com sucesso!`);
};
