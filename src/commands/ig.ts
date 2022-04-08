import { IBotData } from "../interfaces/IBotData";
import axios from "axios";

export default async (botData: IBotData) => {

    const { reply, args, sendImage } = botData

    function igstalk(nome) {
        return new Promise(async (resolve, reject) => {
            let {
                data
            } = await axios('https://www.instagram.com/' + nome + '/?__a=1', {
                'method': 'GET',
                'headers': {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
                    'cookie': 'isi sendiri cokie igeh'
                }
            })
            let user = data.graphql.user
            let json = {
                status: 'online',
                code: 200,
                nome: user.username,
                nome_todo: user.full_name,
                verificado: user.is_verified,
                videos: user.highlight_reel_count,
                seguidores: user.edge_followed_by.count,
                seguindo: user.edge_follow.count,
                conta_business: user.is_business_account,
                conta_profissional: user.is_professional_account,
                categoria: user.category_name,
                capa: user.profile_pic_url_hd,
                bio: user.biography,
                info_conta: data.seo_category_infos
            }
            resolve(json)
            console.log(resolve(json))
        })
    }

    let imageH = await igstalk(args)
};
