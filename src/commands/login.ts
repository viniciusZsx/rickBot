import { IBotData } from "../interfaces/IBotData";
import { readJSON, writeJSON } from "../functions";
import path from "path";
import { IAlogin } from "../interfaces/IAlogin";
import moment from "moment-timezone";
import { IAcash } from "../interfaces/IAcash";

export default async (botData: IBotData) => {

    const { reply, userJid, args, webMessage, socket } = botData

    const data = moment.tz('America/Sao_Paulo').format('DD/MM')

    console.log(args)

    if (args.length < 2) return reply("Para fazer login ex: ?login homem/mulher | 15")

    let genero = args.split("|")[0]

    let idade = args.split("|")[1]

    const json = readJSON(
        path.resolve(__dirname, "..", "..", "cache", "login.json")
    ) as IAlogin[];

    const login = json.find(({ id }) => id === userJid);

    if (!login) {
        json.push({
        id: userJid,
        data: data,
        genero: genero,
        idade: idade
    });
    writeJSON(
        path.resolve(__dirname, "..", "..", "cache", "login.json"),
        json
    );
    } else {
    reply("Você ja esta logado")
    }

    const dinheiro = readJSON(
        path.resolve(__dirname, "..", "..", "cache", "cash.json")
    ) as IAcash[];

    const money = dinheiro.find(({ id }) => id === userJid);

    if (money) {
        money.id = userJid;
    } else {
        dinheiro.push({
            id: userJid,
            menns: 0,
            dinheiro: 0,
            level: 0,
        });

        writeJSON(
            path.resolve(__dirname, "..", "..", "cache", "cash.json"),
            dinheiro
        )

    }

    await reply("Login efetuado")
};