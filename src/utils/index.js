const mapDBToAlbumModel = ({ id, name, year }) => ({
  id,
  name,
  year,
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
