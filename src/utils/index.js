const mapDBToAlbumModel = ({ id, name, year, songs }) => ({
  id,
  name,
  year,
  songs,
});

const mapDBToSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

const mapDBToPlaylistModel = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = {
  mapDBToAlbumModel,
  mapDBToSongModel,
  mapDBToPlaylistModel,
};
