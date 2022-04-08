import path from "path";
import { general } from "./configurations/general";
import { connect } from "./connection";
import {
  contador,
  contadorM,
  detectLink,
  dinheiro,
  getBotData,
  getCommand,
  isCommand,
  re,
  readJSON,
} from "./functions";
import { IAlogin } from "./interfaces/IAlogin";
import { IAntiFake } from "./interfaces/IAntiFake";
import { IAregistro } from "./interfaces/IAregistro";

export default async () => {
  const socket = await connect();

  socket.ev.on("messages.upsert", async (message) => {
    const [webMessage] = message.messages;
    const { command, ...data } = getBotData(socket, webMessage);

    await detectLink({ command, ...data });

    if (!isCommand(command)) return await dinheiro({command, ...data})


    if (isCommand(command)){
      const json = readJSON(
        path.resolve(__dirname, "..", "cache", "registro.json")
      ) as IAregistro[];
      const dono = general.dono
      if (webMessage.key.participant !== dono){

        await contadorM({command, ...data})
        const registro = json.find(({ group_jid }) => group_jid === webMessage.key.remoteJid);

  
      if (!registro || !registro.active){
        return
      }
      }
      

    }

    if (!isCommand(command)) return;

    try {
      const action = await getCommand(command.replace(general.prefix, ""));
      await action({ command, ...data });
    } catch (error) {
      console.log(error);
      if (error) {
        await data.reply(`❌ ${error.message}`);
      }
    }
  });

  socket.ev.on("group-participants.update", async (data) => {
    const { id, action, participants } = data;

    if (action !== "add" || !participants.length) return;

    const [participant] = participants;

    const json = readJSON(
      path.resolve(__dirname, "..", "cache", "antifake.json")
    ) as IAntiFake[];

    const antiFake = json.find(({ group_jid }) => group_jid === id);

    if (!antiFake || !antiFake.active) return;

    const brazilianDDI = participant.startsWith("55");

    if (brazilianDDI) return;

    await socket.sendMessage(id, {
      text: "🤖 ℹ Devido a política de anti fakes, você número fake será removido, caso isso seja um engano, entre em contato com um administrador do grupo!",
    });

    try {
      await socket.groupParticipantsUpdate(id, [participant], "remove");
    } catch (error) {
      console.log(error);
    }
  });
};
