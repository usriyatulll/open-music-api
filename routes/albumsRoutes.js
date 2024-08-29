const AlbumsHandler = require("../handler/albums");
const pool = require("../service/database");
const albumsHandler = new AlbumsHandler(pool);

const routes = [
  {
    method: "POST",
    path: "/albums",
    handler: albumsHandler.addAlbum,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: albumsHandler.getAlbumDetailsById,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: albumsHandler.editAlbumById,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: albumsHandler.deleteAlbumById,
  },
];

module.exports = routes;
