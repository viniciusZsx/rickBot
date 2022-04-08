import { IBotData } from "../interfaces/IBotData";
import speed from "performance-now"

export default async ({ reply, webMessage }: IBotData) => {

  const timeSt = speed()

  const timFn = speed() - timeSt

  function timeT(seconds){
    function timeSd(s){
      return (s < 10 ? '0' : '') + s;
    }
    var horaT = Math.floor(seconds / (60*60));
    var minuT = Math.floor(seconds % (60*60) / 60);
    var secunT = Math.floor(seconds % 60);
    
    return `
▢ • Status: Ativo
▢ • Velocidade de resposta: ${timFn.toFixed(4)}
▢ • Online a: ${timeSd(horaT)}:${timeSd(minuT)}:${timeSd(secunT)}
▢ • Usuario: ${webMessage.pushName}`
  }

  const timeE = process.uptime()

  await reply(timeT(timeE))
};
