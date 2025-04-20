// routes/funkos.ts
import express from 'express';
import { addFunko, updateFunko, deleteFunko, listFunkos, getFunko } from '../server/fileManager.js';
import { Funko } from '../models/FunkoPop.js';

const router: express.Router = express.Router();

/**
 * POST /funkos/:user
 * Añadir un Funko a la lista de un usuario
 */
router.post('/:user', async (req, res) => {
  const username = req.params.user;
  const funko = req.body;

  try {
    const result = await addFunko(username, funko);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

/**
 * PATCH /funkos/:user/:id
 * Modificar un Funko existente
 */
router.patch('/:user/:id', async (req, res) => {
  const user = req.params.user;
  const id = Number(req.params.id);

  // Construimos el objeto FunkoPop a partir del body de la petición
  const funko: Funko = {
    id: String(id),
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    genre: req.body.genre,
    franchise: req.body.franchise,
    exclusive: req.body.exclusive,
    specialFeatures: req.body.specialFeatures,
    marketValue: req.body.marketValue,
    number: req.body.number,
    Funko: req.body.Funko || '', 
    printInfo: req.body.printInfo || (() => ''), 
  };

  try {
    const result = await updateFunko(user, funko);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


/**
 * DELETE /funkos/:user/:id
 * Eliminar un Funko
 */
router.delete('/:user/:id', async (req, res) => {
  const { user, id } = req.params;

  try {
    const result = await deleteFunko(user, String(id));
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

/**
 * GET /funkos/:user
 * Listar Funkos de un usuario
 */
router.get('/:user', async (req, res) => {
  const username = req.params.user;

  try {
    const result = await listFunkos(username);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

/**
 * GET /funkos/:user/:id
 * Obtener info de un Funko por ID
 */
router.get('/:user/:id', async (req, res) => {
  const { user, id } = req.params;

  try {
    const result = await getFunko(user, String(id));
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

export default router;
