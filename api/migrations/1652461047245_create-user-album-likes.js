exports.up = (pgm) => {
  pgm.createTable('useralbumlikes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('useralbumlikes');
};
