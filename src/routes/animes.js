import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath } from "url";
import path from 'path';

const routerAnime = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const animesFilePath = path.join(_dirname, "../../data/animes.json");

const leerAnimesFs = async () => {
    try {
        const animes = await fs.readFile(animesFilePath);
        return JSON.parse(animes);
    } catch (err) {
        throw new Error(`Error en la promesa ${err}`);
    }
};

const escribirAnimesFs = async (animes) => {
    await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2));
};

routerAnime.post("/", async (req, res) => {
    const animes = await leerAnimesFs();
    const nuevoAnime = {
        id: animes.length + 1,
        titulo: req.body.titulo,
        genero: req.body.genero
    };

    animes.push(nuevoAnime);
    await escribirAnimesFs(animes);
    res.status(201).send(`Anime creado exitosamente ${JSON.stringify(nuevoAnime)}`);
});

routerAnime.get("/", async (req, res) => {
    const animes = await leerAnimesFs();
    res.json(animes);
});

routerAnime.get("/:animeId", async (req, res) => {
    const animes = await leerAnimesFs();
    const anime = animes.find(a => a.id === parseInt(req.params.animeId));
    if (!anime) return res.status(404).send("Anime no encontrado");
    res.json(anime);
});

routerAnime.put("/:id", async (req, res) => {
    const animes = await leerAnimesFs();
    const indiceAnime = animes.findIndex(a => a.id === parseInt(req.params.id));
    if (indiceAnime === -1) return res.status(404).send("Anime no encontrado");
    const animeActualizado = {
        ...animes[indiceAnime],
        titulo: req.body.titulo,
        genero: req.body.genero
    };

    animes[indiceAnime] = animeActualizado;
    await escribirAnimesFs(animes);
    res.send(`Anime actualizado exitosamente ${JSON.stringify(animeActualizado)}`);
});

routerAnime.delete('/:id', async (req, res) => {
    const animes = await leerAnimesFs();
    const indiceAnime = animes.findIndex(anime => anime.id === parseInt(req.params.id));
    if (indiceAnime === -1) return res.status(404).send('Anime no encontrado');
    const animeEliminado = animes.splice(indiceAnime, 1);
    await escribirAnimesFs(animes);
    res.send('El anime ha sido eliminado');
});

export default routerAnime;
