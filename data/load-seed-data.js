const client = require('../lib/client');
// import our seed data:
const { categories, characters } = require('./characters.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );

    const user = users[0].rows[0];

    await Promise.all(
      categories.map(category => {
        return client.query(`
        INSERT INTO categories (category)
        VALUES ($1);
        `,
        [category.category]);
      })
    );

    await Promise.all(
      characters.map(character => {
        return client.query(`
                    INSERT INTO characters (name, cool_factor, category_id, owner_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [character.name, character.cool_factor, character.category_id, user.id]);
      })
    );


    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
