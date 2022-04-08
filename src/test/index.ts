import axios from "axios"
import cheerio from "cheerio"

(async () => {

  const { data } = await axios.get(`https://lista.mercadolivre.com.br/alexa#D[A:alexa]`)

  const b = cheerio.load(data)

  const l = b('div.slick-slide.slick-active').find('img.ui-search-result-image__element').attr('src')

  const audioV = l

  console.log(l)

})()