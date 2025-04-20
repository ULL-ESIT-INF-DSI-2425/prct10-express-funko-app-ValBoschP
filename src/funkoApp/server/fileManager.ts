import { promises as fs } from 'fs';
import path from 'path';
import { ResponseType } from '../utils/types.js';
import { Funko } from '../models/FunkoPop.js';

const BASE_DIR = './data';

function getUserDir(username: string): string {
  return path.join(BASE_DIR, username);
}

function getFunkoPath(username: string, id: string): string {
  return path.join(getUserDir(username), `${id}.json`);
}

export async function addFunko(username: string, funko: Funko): Promise<ResponseType> {
  const userDir = getUserDir(username);
  const funkoPath = getFunkoPath(username, funko.id);

  try {
    await fs.mkdir(userDir, { recursive: true });

    try {
      await fs.access(funkoPath);
      return { success: false, type: 'error', message: `Funko with ID ${funko.id} already exists.` };
    } catch {
      await fs.writeFile(funkoPath, JSON.stringify(funko, null, 2));
      return { success: true, type: 'add', message: `Funko with ID ${funko.id} added successfully.` };
    }
  } catch (err) {
    return { success: false, type: 'error', message: 'Error writing to file system.' };
  }
}

export async function updateFunko(username: string, funko: Funko): Promise<ResponseType> {
  const funkoPath = getFunkoPath(username, funko.id);

  try {
    // Leemos el archivo existente
    const content = await fs.readFile(funkoPath, 'utf-8');
    const existingFunko: Funko = JSON.parse(content);

    // Combinamos los datos, pero solo actualizamos los campos que vienen en la solicitud
    const updatedFunko: Funko = {
      id: funko.id || existingFunko.id,
      name: funko.name || existingFunko.name,
      description: funko.description || existingFunko.description,
      type: funko.type || existingFunko.type,
      genre: funko.genre || existingFunko.genre,
      franchise: funko.franchise || existingFunko.franchise,
      number: funko.number || existingFunko.number,
      exclusive: funko.exclusive || existingFunko.exclusive,
      specialFeatures: funko.specialFeatures || existingFunko.specialFeatures,
      marketValue: funko.marketValue || existingFunko.marketValue,
      Funko: funko.Funko || existingFunko.Funko,  // Mantener valor anterior si no se pasa en la solicitud
      printInfo: funko.printInfo || existingFunko.printInfo,  // Mantener valor anterior si no se pasa en la solicitud
    };

    // Escribimos el objeto actualizado en el archivo JSON
    await fs.writeFile(funkoPath, JSON.stringify(updatedFunko, null, 2));
    return { success: true, type: 'update', message: `Funko with ID ${funko.id} updated successfully.` };
  } catch (err) {
    return { success: false, type: 'error', message: `Funko with ID ${funko.id} does not exist.` };
  }
}




export async function deleteFunko(username: string, id: string): Promise<ResponseType> {
  const funkoPath = getFunkoPath(username, id);

  try {
    await fs.access(funkoPath);
    await fs.unlink(funkoPath);
    return { success: true, type: 'remove', message: `Funko with ID ${id} deleted successfully.` };
  } catch {
    return { success: false, type: 'error', message: `Funko with ID ${id} not found.` };
  }
}

export async function listFunkos(username: string): Promise<ResponseType> {
  const userDir = getUserDir(username);

  try {
    const files = await fs.readdir(userDir);
    const funkos: Funko[] = [];

    for (const file of files) {
      const content = await fs.readFile(path.join(userDir, file), 'utf-8');
      funkos.push(JSON.parse(content));
    }

    return { success: true, type: 'list', funkoPops: funkos };
  } catch {
    return { success: false, type: 'error', message: `No Funkos found for user "${username}".` };
  }
}

export async function getFunko(username: string, id: string): Promise<ResponseType> {
  const funkoPath = getFunkoPath(username, id);

  try {
    const content = await fs.readFile(funkoPath, 'utf-8');
    const funko: Funko = JSON.parse(content);
    return { success: true, type: 'read', funkoPops: [funko] };
  } catch {
    return { success: false, type: 'error', message: `Funko with ID ${id} not found.` };
  }
}
