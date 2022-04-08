import { IBotData } from "../interfaces/IBotData";

export default async (botData: IBotData) => {

    const { reply } = botData

    await reply(`
▢ 
▢ • Semanal: 5R$ por grupo
▢ • Mensal: 15R$ por grupo
▢ 
▢ • Adquira ja o seu com https://wa.me/558181896518

`)
};
