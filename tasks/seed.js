const connection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const songs = data.songs;

async function main() {
    //first two lines
    const db = await connection.dbConnection();
    await db.dropDatabase();

    const user1 = await users.createUser("Mya", "Phu", "mxfu", "KevinsucksD32!", "KevinsucksD32!");
    let parseUser1 = user1["_id"].toString();
    await users.createAdmin(parseUser1);

    const user2 = await users.createUser("Serena", "Lee", "cargi", "Meow123!", "Meow123!");
    let parseUser2 = user2["_id"].toString();
    await users.createAdmin(parseUser2);

    //check for faulty urls : "hwww.youtube.com/watch?v=p6U7zIY6zkA"
    let song1 = await songs.postSong(parseUser1, "Ghost", "Justin Bieber", ["Pop", "Rap"], [["Youtube", "https://www.youtube.com/watch?v=p6U7zIY6zkA"]])

    let parseSong1 = song1["_id"].toString();
    let comment1 = await users.createComment(parseSong1, parseUser1, "I love this song", 5);
    let comment2 = await users.createComment(parseSong1, parseUser2, "I have this song", 3);
    let comment3 = await users.createComment(parseSong1, parseUser2, "It's mid, this song", 2);

    //last two lines
    await connection.closeConnection();
    console.log("Done!");

}


main().catch((error) => {
    console.log(error);
});
