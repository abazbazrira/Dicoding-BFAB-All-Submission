const mapDBToAlbumModel = ({ id, name, year, songs, coverurl }) => ({
  id,
  name,
  year,
  songs,
  coverUrl: coverurl,
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

const mapDBToActivitiesModel = ({ username, title, action, time }) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  mapDBToAlbumModel,
  mapDBToSongModel,
  mapDBToPlaylistModel,
  mapDBToActivitiesModel,
};
