import express from 'express'

import { perguntarIA }
from '../services/openRouter'

const router = express.Router()

router.post(
  "/ia",
  async (req, res) => {

    try {

      const {
        pergunta,
        contexto
      } = req.body

      const resposta =
        await perguntarIA(
          pergunta,
          contexto
        )

      res.json({
        resposta
      })

    } catch (erro) {

      console.error(erro)

      res.status(500).json({
        erro: "Erro ao consultar IA"
      })

    }

  }
)

export default router