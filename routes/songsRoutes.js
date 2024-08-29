const SongsHandler = require("../handler/songs");
const pool = require("../service/database");
const songsHandler = new SongsHandler(pool);

const routes = [
  {
    method: "POST",
    path: "/songs",
    handler: songsHandler.addSong,
  },
  {
    method: "GET",
    path: "/songs",
    handler: songsHandler.getSongs,
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: songsHandler.getSongById,
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: songsHandler.editSongById,
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: songsHandler.deleteSongById,
  },
];

module.exports = routes;
