import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

// Crear una nueva instancia de la aplicación Express
const app = express();

// Usar body-parser para analizar las solicitudes con JSON
app.use(bodyParser.json());

// Datos de ejemplo (en un entorno real usarías una base de datos o un archivo)
let funkos: any[] = [];  // Aquí guardaremos los Funkos temporalmente

// Ruta para obtener todos los Funkos
app.get('/funkos', (req: Request, res: Response) => {
  res.json(funkos);  // Devolver todos los Funkos en formato JSON
});

// Ruta para obtener un Funko por su ID
app.get('/funkos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const funko = funkos.find(f => f.id === id);

  if (funko) {
    res.json(funko);  // Si lo encuentra, devolverlo
  } else {
    res.status(404).json({ message: 'Funko no encontrado' });  // Si no lo encuentra, error 404
  }
});

// Ruta para crear un nuevo Funko
app.post('/funkos', (req: Request, res: Response) => {
  const { name, id, description, type, genre, franchise, number, exclusive, specialEdition, price } = req.body;

  if (!name || !id) {
    return res.status(400).json({ message: 'Nombre e ID son obligatorios' });
  }

  // Crear el nuevo Funko
  const newFunko = { name, id, description, type, genre, franchise, number, exclusive, specialEdition, price };
  funkos.push(newFunko);

  res.status(201).json({ message: 'Funko creado exitosamente', funko: newFunko });
});

// Ruta para actualizar un Funko
app.patch('/funkos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const funkoIndex = funkos.findIndex(f => f.id === id);

  if (funkoIndex === -1) {
    return res.status(404).json({ message: 'Funko no encontrado' });
  }

  // Actualizar los datos del Funko
  const updatedFunko = { ...funkos[funkoIndex], ...req.body };
  funkos[funkoIndex] = updatedFunko;

  res.json({ message: 'Funko actualizado exitosamente', funko: updatedFunko });
});

// Ruta para eliminar un Funko
app.delete('/funkos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const funkoIndex = funkos.findIndex(f => f.id === id);

  if (funkoIndex === -1) {
    return res.status(404).json({ message: 'Funko no encontrado' });
  }

  // Eliminar el Funko
  funkos.splice(funkoIndex, 1);

  res.json({ message: 'Funko eliminado exitosamente' });
});

// Iniciar el servidor en el puerto 4000
const port = 4000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
