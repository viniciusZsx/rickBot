import {
  DownloadableMessage,
  downloadContentFromMessage,
  generateWAMessage,
  generateWAMessageFromContent,
  GroupParticipant,
  isJidGroup,
  proto,
} from "@adiwajshing/baileys";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { general } from "./configurations/general";
import { IAntiLink } from "./interfaces/IAntiLink";
import moment from "moment-timezone";
import { IBotData } from "./interfaces/IBotData";
import { IAregistro } from "./interfaces/IAregistro";
import fetch from "node-fetch"
import { IAcash } from "./interfaces/IAcash";
import { IAlogin } from "./interfaces/IAlogin";


export const getBotData = (
  socket: any,
  webMessage: proto.IWebMessageInfo
): IBotData => {
  const { remoteJid } = webMessage.key;

  const sendText = async (text: string) => {
    return socket.sendMessage(remoteJid, {
      text: `${general.prefixEmoji} ${text}`,
    });
  };

  const sendImage = async (
    pathOrBuffer: string | Buffer,
    caption = "",
    isReply = true
  ) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const image =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    const params = caption
      ? {
        image,
        caption: `${general.prefixEmoji} ${caption}`,
      }
      : { image };

    return await socket.sendMessage(remoteJid, params, options);
  };

  const sendSticker = async (pathOrBuffer: string | Buffer, isReply = true) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const sticker =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    return await socket.sendMessage(remoteJid, { sticker }, options);
  };

  const sendVideo = async (
    pathOrBuffer: string | Buffer,
    caption: "",
    isReply = true,
    ptt = true
  ) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const video =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    const params = caption
      ? {
        video,
        caption: `${general.prefixEmoji} ${caption}`,
      }
      : { video };

    if (pathOrBuffer instanceof Buffer) {
      return await socket.sendMessage(
        remoteJid,
        params,
        {
          video,
          ptt,
          mimetype: "video/mp4",
        },
        options
      );
    }

    options = { ...options, url: pathOrBuffer };

    return await socket.sendMessage(
      remoteJid,
      {
        video: { url: pathOrBuffer },
        ptt,
        mimetype: "video/mp4",
      },
      options
    );

  };

  const sendAudio = async (
    pathOrBuffer: string | Buffer,
    isReply = true,
    ptt = true
  ) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const audio =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    if (pathOrBuffer instanceof Buffer) {
      return await socket.sendMessage(
        remoteJid,
        {
          audio,
          ptt,
          mimetype: "audio/mpeg",
        },
        options
      );
    }

    options = { ...options, url: pathOrBuffer };

    return await socket.sendMessage(
      remoteJid,
      {
        audio: { url: pathOrBuffer },
        ptt,
        mimetype: "audio/mpeg",
      },
      options
    );
  };

  const reply = async (text: string) => {
    return socket.sendMessage(
      webMessage.key.remoteJid,
      { text: `${general.prefixEmoji} ${text}` },
      { quoted: webMessage }
    );
  };

  const sendFile = async (
    pathOrBuffer: string | Buffer,
    isReply = true,
  ) => {
    let options = {};

    if (isReply) {
      options = {
        quoted: webMessage,
      };
    }

    const audio =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);

    if (pathOrBuffer instanceof Buffer) {
      return await socket.sendMessage(
        remoteJid,
        {
          audio,
          mimetype: "document/apk",
        },
        options
      );
    }

    options = { ...options, url: pathOrBuffer };

    return await socket.sendMessage(
      remoteJid,
      {
        audio: { url: pathOrBuffer },
        mimetype: "document/apk",
      },
      options
    );
  };

  const {
    messageText,
    isImage,
    isVideo,
    isSticker,
    isAudio,
    isDocument,
    userJid,
    replyJid,
  } = extractDataFromWebMessage(webMessage);

  const { command, args } = extractCommandAndArgs(messageText);

  return {
    sendText,
    sendImage,
    sendFile,
    sendSticker,
    sendVideo,
    sendAudio,
    reply,
    remoteJid,
    userJid,
    replyJid,
    socket,
    webMessage,
    command,
    args,
    isImage,
    isVideo,
    isSticker,
    isAudio,
    isDocument,
  };
};

export const getCommand = (commandName: string) => {
  const pathCache = path.join(__dirname, "..", "cache", "commands.json");
  const pathCommands = path.join(__dirname, "commands");

  const cacheCommands = readJSON(pathCache);

  if (!commandName) return;

  const cacheCommand = cacheCommands.find(
    (name: string) => name === commandName
  );

  if (!cacheCommand) {
    const command = fs
      .readdirSync(pathCommands)
      .find((file) => file.includes(commandName));

    if (!command) {
      const hora = moment.tz('America/Sao_Paulo').format('HH:mm')

      const data = moment.tz('America/Sao_Paulo').format('DD/MM')
      throw new Error(
        `
▢ • Status: 404
▢ • Tipo de erro: comando inexistente
▢ • Data: ${data}
▢ • Hora: ${hora}
▢ • Digite: ${general.prefix}menu para ver os comandos
`);
    }

    writeJSON(pathCache, [...cacheCommands, commandName]);

    return require(`./commands/${command}`).default;
  }

  return require(`./commands/${cacheCommand}`).default;
};

export const readJSON = (pathFile: string) => {
  // @ts-ignore
  return JSON.parse(fs.readFileSync(pathFile));
};

export const writeJSON = (pathFile: string, data: any) => {
  fs.writeFileSync(pathFile, JSON.stringify(data));
};

export const extractDataFromWebMessage = (message: proto.IWebMessageInfo) => {
  let remoteJid: string;
  let messageText: string | null | undefined;

  let isReply = false;

  let replyJid: string | null = null;
  let replyText: string | null = null;

  const {
    key: { remoteJid: jid, participant: tempUserJid },
  } = message;

  if (jid) {
    remoteJid = jid;
  }

  if (message) {
    const extendedTextMessage = message.message?.extendedTextMessage;
    const buttonTextMessage = message.message?.buttonsResponseMessage;
    const listTextMessage = message.message?.listResponseMessage;

    const type1 = message.message?.conversation;

    const type2 = extendedTextMessage?.text;

    const type3 = message.message?.imageMessage?.caption;

    const type4 = buttonTextMessage?.selectedButtonId;

    const type5 = listTextMessage?.singleSelectReply?.selectedRowId;

    const type6 = message?.message?.videoMessage?.caption;

    messageText = type1 || type2 || type3 || type4 || type5 || type6 || "";

    isReply =
      !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

    replyJid =
      extendedTextMessage && extendedTextMessage.contextInfo?.participant
        ? extendedTextMessage.contextInfo.participant
        : null;

    replyText = extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
  }

  const userJid = tempUserJid?.replace(/:[0-9][0-9]|:[0-9]/g, "");

  const tempMessage = message?.message;

  const isImage =
    !!tempMessage?.imageMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.imageMessage;

  const isVideo =
    !!tempMessage?.videoMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.videoMessage;

  const isAudio =
    !!tempMessage?.audioMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.audioMessage;

  const isSticker =
    !!tempMessage?.stickerMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.stickerMessage;

  const isDocument =
    !!tempMessage?.documentMessage ||
    !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.documentMessage;

  let mentionedJid = "";

  let mentionedJidObject =
    tempMessage?.extendedTextMessage?.contextInfo?.mentionedJid;

  if (mentionedJidObject) {
    mentionedJid = mentionedJidObject[0];
  }

  return {
    userJid,
    remoteJid,
    messageText,
    isReply,
    replyJid,
    replyText,
    isAudio,
    isImage,
    isSticker,
    isVideo,
    isDocument,
    mentionedJid,
    webMessage: message,
  };
};

export const extractCommandAndArgs = (message: string) => {
  if (!message) return { command: "", args: "" };

  const [command, ...tempArgs] = message.trim().split(" ");

  const args = tempArgs.reduce((acc, arg) => acc + " " + arg, "").trim();

  return { command, args };
};

export const isCommand = (message: string) =>
  message.length > 1 && message.startsWith(general.prefix);

export const getRandomName = (extension?: string) => {
  const fileName = Math.floor(Math.random() * 10000);

  if (!extension) return fileName.toString();

  return `${fileName}.${extension}`;
};

export const downloadImage = async (
  webMessage: proto.IWebMessageInfo,
  fileName: string,
  folder: string | null = null,
  ...subFolders: string[]
) => {
  const content = (webMessage?.message?.imageMessage ||
    webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.imageMessage) as DownloadableMessage;

  if (!content) return null;

  const stream = await downloadContentFromMessage(content, "image");

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  let directory = [__dirname, "..", "assets"];

  if (!folder) {
    directory = [...directory, "temp"];
  }

  if (folder) {
    directory = [...directory, folder];
  }

  if (subFolders.length) {
    directory = [...directory, ...subFolders];
  }

  const filePath = path.resolve(...directory, `${fileName}.jpg`);

  await writeFile(filePath, buffer);

  return filePath;
};

export const downloadVideo = async (
  webMessage: proto.IWebMessageInfo,
  fileName: string,
  folder: string | null = null,
  ...subFolders: string[]
) => {
  const content = (webMessage?.message?.videoMessage ||
    webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.videoMessage) as DownloadableMessage;

  if (!content) return null;

  const stream = await downloadContentFromMessage(content, "video");

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  let directory = [__dirname, "..", "assets"];

  if (!folder) {
    directory = [...directory, "temp"];
  }

  if (folder) {
    directory = [...directory, folder];
  }

  if (subFolders.length) {
    directory = [...directory, ...subFolders];
  }

  const filePath = path.resolve(...directory, `${fileName}.mp4`);

  await writeFile(filePath, buffer);

  return filePath;
};

export const downloadAudio = async (
  webMessage: proto.IWebMessageInfo,
  fileName: string,
  folder: string | null = null,
  ...subFolders: string[]
) => {
  const content = (webMessage?.message?.audioMessage ||
    webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.audioMessage) as DownloadableMessage;

  if (!content) return null;

  const stream = await downloadContentFromMessage(content, "audio");

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  let directory = [__dirname, "..", "assets"];

  if (!folder) {
    directory = [...directory, "temp"];
  }

  if (folder) {
    directory = [...directory, folder];
  }

  if (subFolders.length) {
    directory = [...directory, ...subFolders];
  }

  const filePath = path.resolve(...directory, `${fileName}.mp4`);

  await writeFile(filePath, buffer);

  return filePath;
};

export const downloadSticker = async (
  webMessage: proto.IWebMessageInfo,
  fileName: string,
  folder: string | null = null,
  ...subFolders: string[]
) => {
  const content = (webMessage?.message?.stickerMessage ||
    webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.stickerMessage) as DownloadableMessage;

  if (!content) return null;

  const stream = await downloadContentFromMessage(content, "sticker");

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  let directory = [__dirname, "..", "assets"];

  if (!folder) {
    directory = [...directory, "temp"];
  }

  if (folder) {
    directory = [...directory, folder];
  }

  if (subFolders.length) {
    directory = [...directory, ...subFolders];
  }

  const filePath = path.resolve(...directory, `${fileName}.webp`);

  await writeFile(filePath, buffer);

  return filePath;
};

export const isSuperAdmin = async (botData: IBotData) => {
  return await validate("superadmin", botData);
};

export const getBuffer = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': 'okhttp/4.5.0' }, method: 'GET' })
  const buff = await res.arrayBuffer()
  if (buff)
    return { type: res.headers.get('content-type'), result: buff }
}

export const isAdmin = async (botData: IBotData) => {
  return (
    (await validate("admin", botData)) ||
    (await validate("superadmin", botData))
  );
};

export const contador = async (botData: IBotData) => {

  const { remoteJid, command, reply, userJid } = botData

}

export const isDono = async (botData: IBotData) => {
  const { reply } = botData
  return reply("OUSH QUEM É TU??? kkkkkkk")
}

export const validate = async (
  type: string,
  { remoteJid, socket, userJid }: IBotData
) => {
  if (!isJidGroup(remoteJid)) return true;

  const { participants } = await socket.groupMetadata(remoteJid);

  const participant = participants.find(
    (participant: GroupParticipant) => participant.id === userJid
  );

  return participant && participant.admin === type;
};

export const onlyNumbers = (text: string) => {
  return text.replace(/[^0-9]/g, "");
};

export const Nregistrado = async (botData: IBotData) => {
  const { reply } = botData

  return reply(general.grupo)
}

export const contadorM = async (botData: IBotData) => {
  const { remoteJid, reply, webMessage } = botData

  if (webMessage.message.conversation === '?planos') return await reply(`
▢ 
▢ • Semanal: 5R$ por grupo
▢ • Mensal: 15R$ por grupo
▢ 
▢ • Adquira já o seu com https://wa.me/558181896518
`)

  if (!remoteJid.endsWith('@g.us')) return reply("Opa não executo comandos no pv")

  const json = readJSON(
    path.resolve(__dirname, "..", "cache", "registro.json")
  ) as IAregistro[];

  const registroo = json.find(({ group_jid }) => group_jid === remoteJid);

  const nome = webMessage.pushName

  if (!registroo || !registroo.active) return reply(`Ola ${nome}!! este grupo não esta registrado`)


}

export const sendButton = async (botData: IBotData) => {

  const { socket, remoteJid } = botData

  let menu = "kkk"

  const sendBimg = async (id, text1, desc1, but = [], vr) => {
    let buttonMessage = {
      caption: text1,
      footerText: desc1,
      buttons: but,
      headerType: 4
    }
    //@ts-ignore
    sendBimg(remoteJid, `K`, menu, "Leia com atenção", [
      { buttonId: `brincadeiras`, buttonText: { displayText: `🤡 MENU DE BRINCADEIRAS 🤡` }, type: 1 }, { buttonId: `$logos`, buttonText: { displayText: `💥 MENU DE LOGOS ⚡` }, type: 1 }, { buttonId: `infodono`, buttonText: { displayText: `🔸 INFORMAÇÕES DO DONO 🔸` }, type: 1 }])
  }
  socket.sendMessage(remoteJid, sendBimg)

}

export const re = async (botData:IBotData) => {

  const { userJid, reply} = botData

  reply("Você não esta registrado, use: ?login homem/mulher | 15 ")
}

export const dinheiro = async (botData: IBotData) => {

  const { userJid, reply, socket, webMessage } = botData

  const dinheiro = readJSON(
    path.resolve(__dirname, "..", "cache", "cash.json")
  ) as IAcash[];

  const money = dinheiro.find(({ id }) => id === userJid);

  if (money) {
    money.id = userJid;
  } else {
    dinheiro.push({
        id: userJid,
        menns: 0 + 1,
        dinheiro: 0,
        level: 0,
    });

    writeJSON(
      path.resolve(__dirname, "..", "cache", "cash.json"),
      dinheiro
    )

  }
  
  const add_dinheiro = (userJid, amount) => {

    let position = false

    Object.keys(dinheiro).forEach((i) => {
      if (dinheiro[i].id === userJid) {
        //@ts-ignore
        position = i
      }
    })

    if (position !== false) {

      dinheiro[position].dinheiro += amount
      writeJSON(
        path.resolve(__dirname, "..", "cache", "cash.json"),
        dinheiro
      );
    }
  }

  const add_Ms = (userJid, amount) => {

    let position = false

    Object.keys(dinheiro).forEach((i) => {
      if (dinheiro[i].id === userJid) {
        //@ts-ignore
        position = i
      }
    })

    if (position !== false) {

      dinheiro[position].menns += amount
      writeJSON(
        path.resolve(__dirname, "..", "cache", "cash.json"),
        dinheiro
      );
    }
  }

  const verificar_dinheiro = (userJid) => {

    let position = false
    Object.keys(dinheiro).forEach((i) => {
      if (dinheiro[i].id === userJid) {
        //@ts-ignore
        position = i
      }
    })

    if (position !== false) {

      dinheiro[position].dinheiro
    }
  }

  const confirmar_dinheiro = (userJid, amount) => {

    let position = false
    Object.keys(dinheiro).forEach((i) => {

      if (dinheiro[i].id === userJid) {
        //@ts-ignore
        position = i
      }
    })

    if (position !== false) {
      dinheiro[position].dinheiro -= amount
      writeJSON(
        path.resolve(__dirname, "..", "cache", "cash.json"),
        dinheiro
      );
    }
  }

  const dindin = Math.floor(Math.random() * 14) + 55
  add_dinheiro(userJid, dindin)
  let mm = Math.floor(Math.random() * 0) + 1
  add_Ms(userJid, mm)

  const add_Lev = (userJid, amount) => {

    let position = false

    Object.keys(dinheiro).forEach((i) => {
      if (dinheiro[i].id === userJid) {
        //@ts-ignore
        position = i
      }
    })

    if (position !== false) {

      dinheiro[position].level += amount
      writeJSON(
        path.resolve(__dirname, "..", "cache", "cash.json"),
        dinheiro
      );
    }
  }
}

export const detectLink = async (botData: IBotData) => {
  const { remoteJid, socket, userJid, sendText, webMessage, command, args } =
    botData;

  if (await isAdmin(botData)) return;

  const json = readJSON(
    path.resolve(__dirname, "..", "cache", "antilink.json")
  ) as IAntiLink[];

  const antiLink = json.find(({ group_jid }) => group_jid === remoteJid);

  if (!antiLink || !antiLink.active) return;

  const expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  const regex = new RegExp(expression);

  let messageTest: string;

  if (command || args) {
    messageTest = (command ?? "" + " " + args ?? "").trim();
  } else if (
    webMessage.message?.extendedTextMessage &&
    webMessage.message?.extendedTextMessage?.text
  ) {
    messageTest = webMessage.message.extendedTextMessage.text;
  } else if (
    webMessage.message?.imageMessage &&
    webMessage.message?.imageMessage?.caption
  ) {
    messageTest = webMessage.message?.imageMessage.caption;
  }

  if (!messageTest) return;

  const test =
    regex.test(messageTest) ||
    messageTest.includes(".com") ||
    messageTest.includes(".net") ||
    messageTest.includes(".xyz");

  const isBurledCommand =
    messageTest.includes("ī") && messageTest.includes(".com");

  if (!test && !isBurledCommand) return;

  await sendText("Antilink ativado! Banindo meliante... ⌛");

  await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");

  await sendText("Banido por envio de link! ⛔");
};

