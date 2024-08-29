const autoBind = require('auto-bind');
const Joi = require('joi');

class AlbumsHandler {
  constructor(pool) {
    this._pool = pool;
    autoBind(this);
  }

  async addAlbum(request, h) {
    const { name, year } = request.payload;

    const schema = Joi.object({
      name: Joi.string().required(),
      year: Joi.number().required(),
    });

    const { error } = schema.validate({ name, year });

    if (error) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan album. Mohon isi nama dan tahun album dengan benar',
      }).code(400);
    }

    try {
      const query = {
        text: 'INSERT INTO albums (name, year) VALUES($1, $2) RETURNING id',
        values: [name, year],
      };

      const result = await this._pool.query(query);

      return h.response({
        status: 'success',
        data: {
          albumId: result.rows[0].id,
        },
      }).code(201);
    } catch (err) {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server.',
      }).code(500);
    }
  }

  async getAlbumDetailsById(request, h) {
    const { id } = request.params;

    try {
      // Query untuk mendapatkan album
      const albumQuery = {
        text: 'SELECT * FROM albums WHERE id = $1',
        values: [id],
      };

      const albumResult = await this._pool.query(albumQuery);

      if (!albumResult.rows.length) {
        return h.response({
          status: 'fail',
          message: 'Album tidak ditemukan',
        }).code(404);
      }

      // Query untuk mendapatkan lagu-lagu dari album
      const songsQuery = {
        text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
        values: [id],
      };

      const songsResult = await this._pool.query(songsQuery);

      return {
        status: 'success',
        data: {
          album: {
            ...albumResult.rows[0],
            songs: songsResult.rows,
          },
        },
      };
    } catch (err) {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server.',
      }).code(500);
    }
  }

  async editAlbumById(request, h) {
    const { id } = request.params;
    const { name, year } = request.payload;

    const schema = Joi.object({
      name: Joi.string().required(),
      year: Joi.number().required(),
    });

    const { error } = schema.validate({ name, year });

    if (error) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui album. Mohon isi nama dan tahun album dengan benar',
      }).code(400);
    }

    try {
      const query = {
        text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
        values: [name, year, id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui album. Id tidak ditemukan',
        }).code(404);
      }

      return h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server.',
      }).code(500);
    }
  }

  async deleteAlbumById(request, h) {
    const { id } = request.params;

    try {
      const query = {
        text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        return h.response({
          status: 'fail',
          message: 'Gagal menghapus album. Id tidak ditemukan',
        }).code(404);
      }

      return h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server.',
      }).code(500);
    }
  }
}

module.exports = AlbumsHandler;
