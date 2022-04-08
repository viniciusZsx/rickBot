import path from "path";

import { general } from "../configurations/general";
import { isAdmin, readJSON, writeJSON } from "../functions";
import { IAntiFake } from "../interfaces/IAntiFake";
import { IBotData } from "../interfaces/IBotData";

export default async (botData: IBotData) => {
  const { reply, remoteJid, args } = botData;

  if (!(await isAdmin(botData))) {
    return reply("🚫 Somente admins!");
  }

  if (!args || !["on", "off"].includes(args.trim())) {
    return reply(`🚫 Use: ${general.prefix}antifake on/off`);
  }

  const active = args.trim() === "on";

  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "antifake.json")
  ) as IAntiFake[];

  const antiFake = json.find(({ group_jid }) => group_jid === remoteJid);

  if (antiFake) {
    antiFake.active = active;
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

  await reply(`✅ Antifake ${active ? "ativado" : "desativado"} com sucesso!`);
};
