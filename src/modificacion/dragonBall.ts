import request from "request";

export type DBCharacter = {
  name?: string;
  genre?: string;
  race?: string;
  affiliation?: string;
}

const baseUrl = "https://www.dragonball-api.com/api/characters";

function findCharacter(character: DBCharacter): Promise<request.Response> {

  return new Promise<request.Response> ((resolve, reject) => {
    let queryFilters = "";
    for (const key in character) {
      const value = character[key as keyof DBCharacter];
      if (value) {
        queryFilters += `${key}=${encodeURIComponent(value)}&`;
      }
    }

    const url = `${baseUrl}?${queryFilters.toString()}`;

    request({ url: url, json: true }, (error: Error, response) => {
      if (error) {
        reject(error.message);
      }
      if (response.body && response.body.length > 0) {
        resolve(response);
      }
      else {
        reject("No se encontro información del personaje")
      }
    })
  })
}

findCharacter({genre: "Male"})
  .then((data) => {
    console.log("Personaje encontrado:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });