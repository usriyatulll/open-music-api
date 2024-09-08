exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: { type: "varchar(1000)", notNull: true },
    year: { type: "integer", notNull: true },
  });

  pgm.createTable("songs", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    title: { type: "varchar(1000)", notNull: true },
    year: { type: "integer", notNull: true },
    genre: { type: "varchar(1000)", notNull: true },
    performer: { type: "varchar(1000)", notNull: true },
    duration: { type: "integer" },
    album_id: {
      type: "integer",
      references: "albums(id)",
      onDelete: "CASCADE",
    },
  });
};
