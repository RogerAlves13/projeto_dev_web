import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rotaIA from './routes/ia'

dotenv.config()

console.log(
  'ENV TOKEN:',
  process.env.SPTRANS_TOKEN
)

import { autenticarSPTrans }
from './services/sptrans'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', rotaIA)

console.log(
  'OPENROUTER:',
  process.env.OPENROUTER_API_KEY
)

app.get(
  '/sptrans/login',

  async (_, res) => {

    console.log(
      'ROTA LOGIN CHAMADA'
    )

    try {

      const resposta =
        await autenticarSPTrans()

      res.json({
        autenticado: resposta.data
      })

    } catch (erro) {

      console.error(erro)

      res.status(500).json({
        sucesso: false
      })

    }

  }
)
const PORT =
  process.env.PORT || 3000

app.listen(PORT, () => {

  console.log(
    `Servidor rodando na porta ${PORT}`
  )

})