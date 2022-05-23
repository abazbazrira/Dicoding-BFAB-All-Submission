exports.up = (pgm) => {
  pgm.createTable('playlistsongactivities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'TEXT',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
    'playlistsongactivities',
    'fk_playlistsongactivities.playlist_id_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlistsongactivities', 'fk_playlistsongactivities.playlist_id_playlists.id');
  pgm.dropTable('playlistsongactivities');
};
