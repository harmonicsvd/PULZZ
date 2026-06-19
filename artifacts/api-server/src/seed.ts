import { runSeed, artists, songs } from "./lib/seedData";

runSeed()
  .then(() => {
    console.log(`Seeded ${artists.length} artists and ${songs.length} songs.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
