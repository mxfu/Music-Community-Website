// Functions for posts
const mongoCollections = require("../config/mongoCollections");
const playlists = mongoCollections.posts;
const { ObjectId } = require("mongodb");
const validation = require("../helpers");

// data functions for playlists

/**
 *
 * @param {*} userId : ObjectId of user who created playlist - string
 * @param {*} name : Playlist title - string
 * @param {*} description : Playlist description - string
 * @param {*} songs : List of songs in the playlist - array
 * @returns Playlist creation with its information
 */
const createPlaylist = async (userId, name, description, songs) => {
  validation.checkId(userId, "ID");
  validation.checkString(name, "name");
  validation.checkString(description, "description");
  validation.checkStringArray(songs, "songs");
  const playlistCollection = await playlists();
  let newPlaylist = {
    userId: userId,
    name: name,
    description: description,
    songs: songs,
  };
  const newInsert = await playlistCollection.insertOne(newPlaylist);
  if (newInsert.insertedCount === 0) throw "Insert failed!";
  return await this.getPlaylistById(newInsert.insertedId.toString());
};

/**
 *
 * @param {*} id : ObjectId of playlist - string
 * @returns Playlist with searched ID
 */
const getPlaylistById = async (id) => {
  id = validation.checkId(id, "ID");
  const playlistCollection = await playlists();
  const playlist = await playlistCollection.findOne({ _id: ObjectId(id) });
  if (!playlist) throw "Playlist not found";
  return playlist;
};

/**
 * @param {*} playlistId : ObjectId of playlist - string
 * @param {*} userId : ObjectId of user who created and is updating the playlist - string
 * @param {*} n_Name : new name of the playlist - string
 * @param {*} n_Description : new description of the playlist - string
 * @param {*} n_Songs : new list of songs for the playlist - array
 * @returns updated playlist
 */
const updatePlaylist = async (
  playlistId,
  userId,
  n_Name,
  n_Description,
  n_Songs
) => {
  playlistId = validation.checkId(playlistId, "playlist ID");
  userId = validation.checkId(userId, "user ID");
  n_Name = validation.checkString(n_Name, "new name");
  n_Description = validation.checkString(n_Description, "new description");
  n_Songs = validation.checkStringArray(n_Songs, "new songs");
  const playlistCollection = await playlists();
  let updatedPlaylist = {
    userId: userId,
    playlistId: playlistId,
    name: n_Name,
    description: n_Description,
    songs: n_Songs,
  };
  const updatedInfo = await playlistCollection.updateOne(
    { _id: ObjectId(playlistId) },
    { $set: updatedPlaylist }
  );
  if (!updatedInfo.modifiedCount === 0)
    throw "Could not update playlist successfully";
  let playlist = await getPlaylistById(playlistId);
  return playlist;
};

/**
 * @param {*} playlistId : ObjectId of playlist - string
 * @param {*} userId : ObjectId of user who created and is updating the playlist - string
 * @returns message confirming deletion of playlist
 */
const deletePlaylist = async (userId, playlistId) => {
  userId = validation.checkId(userId, "userID");
  playlistId = validation.checkId(playlistId, "playlistID");
  const playlistCollection = await playlists();
  const playlist = await getPlaylistById(playlistId);
  const name = playlist.name;
  const description = playlist.description;
  const songs = playlist.songs;
  const deletionInfo = await playlistCollection.deleteOne({
    _id: ObjectId(playlistId),
  });
  if (deletionInfo.deletedCount === 0)
    throw `Could not delete playlist with id of ${playlistId}`;

  const message = `${name} has been successfully deleted`;
  return message;
};

module.exports = {
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
};
