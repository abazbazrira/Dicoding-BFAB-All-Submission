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

module.exports = {
  mapDBToAlbumModel, mapDBToSongModel,
};
