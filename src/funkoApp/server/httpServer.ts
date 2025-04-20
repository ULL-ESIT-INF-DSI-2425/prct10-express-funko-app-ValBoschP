// server/httpServer.ts
import express from 'express';
import funkosRouter from '../routes/funkos.js';

const app = express();
app.use(express.json());

app.use('/funkos', funkosRouter); 

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${PORT}`);
});
