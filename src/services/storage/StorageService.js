const fs = require('fs');
const { Pool } = require('pg');

class StorageService {
  constructor(folderPath, albumService) {
    this._pool = new Pool();
    this._albumService = albumService;
    this._folderPath = folderPath;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {
        recursive: true
      });
    }
  }

  async updateCoverAlbum(albumId, pictureUrl) {
    await this._albumService.putAlbumCovers(albumId, pictureUrl);
  }

  writeFile(file, meta) {
    const filename = `${+new Date()}-${meta.filename}`;
    const path = `${this._folderPath}/${filename}`;
    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
