
import axios from 'axios'

const BASE_URL =
  'https://api.olhovivo.sptrans.com.br/v2.1'

  console.log(
  'TOKEN:',
  process.env.SPTRANS_TOKEN
  )

export async function autenticarSPTrans() {

  const token =
    process.env.SPTRANS_TOKEN

  const url =
    `${BASE_URL}/Login/Autenticar?token=${token}`

  console.log(url)

  const resposta =
    await axios.post(url)

  console.log(
    'STATUS:',
    resposta.status
  )

  console.log(
  'HEADERS:',
  resposta.headers
)

  console.log(
    'DATA:',
    resposta.data
  )

  return resposta

}