import { generateRegistrationNode } from "@adiwajshing/baileys";
import path from "path";

import { general } from "../configurations/general";
import { readJSON, writeJSON } from "../functions";
import { IAregistro } from "../interfaces/IAregistro";
import { IBotData } from "../interfaces/IBotData";

export default async (botData: IBotData) => {
  const { reply, remoteJid, args, userJid } = botData;

  if (userJid !== general.dono) return reply("oxi kkk te conheço?")

  if (!args || !["on", "off"].includes(args.trim())) {
    return reply(`🚫 Use: ${general.prefix}registrar on/off`);
  }

  const active = args.trim() === "on";

  const json = readJSON(
    path.resolve(__dirname, "..", "..", "cache", "registro.json")
  ) as IAregistro[];

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
    path.resolve(__dirname, "..", "..", "cache", "registro.json"),
    json
  );

  await reply(`✅ Grupo ${active ? "ativado" : "desativado"}`);
};
