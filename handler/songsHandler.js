const pool = require("../service/database");
const Joi = require("joi");
const autoBind = require("auto-bind");

class SongsHandler {
  constructor() {
    this._pool = pool;
    autoBind(this);
  }

  async addSong(request, h) {
    const { title, year, genre, performer, duration, albumId } = request.payload;

    // Validasi data
    const schema = Joi.object({
      title: Joi.string().required(),
      year: Joi.number().required(),
      genre: Joi.string().required(),
      performer: Joi.string().required(),
      duration: Joi.number(),
      albumId: Joi.number().allow(null), // Mengubah tipe menjadi number
    });

    const { error } = schema.validate({ title, year, genre, performer, duration, albumId });

    if (error) {
      return h
        .response({
          status: "fail",
          message: "Gagal menambahkan lagu. Mohon isi data lagu dengan benar",
        })
        .code(400);
    }

    try {
      const query = {
        text: "INSERT INTO songs (title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
        values: [title, year, genre, performer, duration, albumId],
      };

      const result = await this._pool.query(query);

      return h
        .response({
          status: "success",
          data: {
            songId: result.rows[0].id,
          },
        })
        .code(201);
    } catch (err) {
      console.error("Error adding song:", err); // Menambahkan logging kesalahan
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kesalahan pada server.",
        })
        .code(500);
    }
  }

  async getSongById(request, h) {
    const { id } = request.params;

    try {
      const query = {
        text: "SELECT * FROM songs WHERE id = $1",
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        return h
          .response({
            status: "fail",
            message: "Lagu tidak ditemukan",
          })
          .code(404);
      }

      return {
        status: "success",
        data: {
          song: result.rows[0],
        },
      };
    } catch (err) {
      console.error("Error retrieving song:", err); // Menambahkan logging kesalahan
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kesalahan pada server.",
        })
        .code(500);
    }
  }

  async editSongById(request, h) {
    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } = request.payload;

    // Validasi data
    const schema = Joi.object({
      title: Joi.string().required(),
      year: Joi.number().required(),
      genre: Joi.string().required(),
      performer: Joi.string().required(),
      duration: Joi.number(),
      albumId: Joi.number().allow(null),
    });

    const { error } = schema.validate({ title, year, genre, performer, duration, albumId });

    if (error) {
      return h
        .response({
          status: "fail",
          message: "Gagal memperbarui lagu. Mohon isi data lagu dengan benar",
        })
        .code(400);
    }

    try {
      const query = {
        text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id",
        values: [title, year, genre, performer, duration, albumId, id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        return h
          .response({
            status: "fail",
            message: "Gagal memperbarui lagu. Id tidak ditemukan",
          })
          .code(404);
      }

      return h
        .response({
          status: "success",
          message: "Lagu berhasil diperbarui",
        })
        .code(200);
    } catch (err) {
      console.error("Error updating song:", err); // Menambahkan logging kesalahan
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kesalahan pada server.",
        })
        .code(500);
    }
  }

  async getSongs(request, h) {
    const { title, performer } = request.query;

    try {
      let queryText = "SELECT * FROM songs";
      const queryValues = [];

      if (title || performer) {
        queryText += " WHERE";
        if (title) {
          queryText += " title ILIKE $1";
          queryValues.push(`%${title}%`);
        }
        if (performer) {
          if (title) queryText += " AND";
          queryText += " performer ILIKE $" + (queryValues.length + 1);
          queryValues.push(`%${performer}%`);
        }
      }

      const result = await this._pool.query(queryText, queryValues);

      return {
        status: "success",
        data: {
          songs: result.rows,
        },
      };
    } catch (err) {
      console.error("Error retrieving songs:", err); 
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kesalahan pada server.",
        })
        .code(500);
    }
  }

  async deleteSongById(request, h) {
    const { id } = request.params;

    try {
      const query = {
        text: "DELETE FROM songs WHERE id = $1 RETURNING id",
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        return h
          .response({
            status: "fail",
            message: "Gagal menghapus lagu. Id tidak ditemukan",
          })
          .code(404);
      }

      return h
        .response({
          status: "success",
          message: "Lagu berhasil dihapus",
        })
        .code(200);
    } catch (err) {
      console.error("Error deleting song:", err); 
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kesalahan pada server.",
        })
        .code(500);
    }
  }
}

module.exports = SongsHandler;
