import { PGlite } from 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js'

// const db = new PGlite('idb://my-pgdata')
const db = new PGlite();

async function init() {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS todo (
          id SERIAL PRIMARY KEY,
          task TEXT,
          done BOOLEAN DEFAULT false
        );
        
        CREATE TABLE IF NOT EXISTS todo2 (
          id SERIAL PRIMARY KEY,
          task TEXT,
          done BOOLEAN DEFAULT false
        );

        
        `);


    await db.transaction(async (tx) => {
        for (var i = 0; i < 500; i++) {
            await tx.exec(`
                INSERT INTO todo (task, done) VALUES ('${i}', true);
              `)
        }
    });

    const ret = await db.query(`
        SELECT count(*) from todo ;
      `)
    console.log(ret.rows[0])

    const ret2 = await db.query("COPY todo TO '/dev/blob' WITH (FORMAT csv, HEADER, DELIMITER ',');")
    console.log(ret2);
    console.log(ret2.blob.text())
    // ret.blob is a `Blob` object with the data from the copy.

    await db.query("COPY todo2 FROM '/dev/blob' WITH (FORMAT csv, HEADER, DELIMITER ',');", [], {
        blob: ret2.blob,
    })

    const ret3 = await db.query(`
        SELECT count(*) from todo2 ;
      `)
    console.log(ret3.rows[0])

}

init();