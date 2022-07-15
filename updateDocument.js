const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://anycaroliny:<password>@cluster0.qs0q1ba.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        // await updateListingByName(client, "Ribeira Charming Duplex", { bedrooms: 6, beds: 6 });
        /* await upsertListingByname(client, "Cozy House", {
            name: "Lovely House",
            bedrooms: 4,
            bathrooms: 1
        }); */
        await updateAllListingsPropertyType(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);



async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne(
        { name: nameOfListing },
        { $set: updatedListing });

    console.log(`${result.matchedCount} documents matched the query filter.`);
    console.log(`${result.modifiedCount} documents were updated.`);
}

async function upsertListingByname(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne(
        { name: nameOfListing },
        { $set: updatedListing },
        { upsert: true });

    console.log(`${result.matchedCount} documents matched the query filter.`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} documents were updated.`);
    }
}

async function updateAllListingsPropertyType(client) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany(
        { property_type: { $exists: false } },
        { $set: { property_type: "Unknown" } }
    );

    console.log(`${result.matchedCount} documents matched the query filter`);
    console.log(`${result.modifiedCount} documents were updated.`);
}
