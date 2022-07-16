const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://anycaroliny:<password>@cluster0.qs0q1ba.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        // await listDatabases(client);
        /* await createProperty(client, {
            name: "House next to the mall",
            summary: "Located in Rio de Janeiro",
            bedroom: 3,
            bathrooms: 2
        }); */
        await createMultipleProperties(client,
            [
                {
                    name: "Room 1",
                    summary: "Located in Aracaju",
                    bedrooms: 1,
                    bathrooms: 1,
                    property_type: "House",
                },
                {
                    name: "Room 2",
                    summary: "Located in Recife",
                    bedrooms: 2,
                    bathrooms: 1,
                    property_type: "Apartment",
                },
                {
                    name: "Room 3",
                    summary: "Located in Salvador",
                    bedrooms: 3,
                    bathrooms: 1,
                    last_review: new Date()
                }
            ]);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


main().catch(console.error);


async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}

async function createProperty(client, newProperty) {
    const result = await client.db("sample_test").collection("propertiesAndReviews").insertOne(newProperty);

    console.log(`New property created with the following id: ${result.insertedId}`);
}

async function createMultipleProperties(client, newProperties) {
    const result = await client.db("sample_test").collection("propertiesAndReviews").insertMany(newProperties);

    console.log(`${result.insertedCount} new properties created with the following id(s)`);
    console.log(result.insertedIds);
}
