const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://anycaroliny:<password>@cluster0.qs0q1ba.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        // await findOneListingByName(client, "House 1");
        // const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({}, { $rename: {"description":"summary"} });
        /* await findListings(client, {
            minBedrooms: 4, 
            minBathrooms: 2, 
            maxResults: 20
        }); */
        await findListingsBedrooms(client, 3);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing with the name ${nameOfListing}`);
        console.log(result);
    } else {
        console.log(`No listing found with the name ${nameOfListing}`);
    }
}

async function findListings(client, { 
    minBedrooms = 0,
    minBathrooms = 0,
    maxResults = Number.MAX_SAFE_INTEGER }) {
    
    // The result here is a cursor
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: { $gte: minBedrooms },
        bathrooms: { $gte: minBathrooms },
    }).sort({ last_review: -1 }).limit(maxResults);

    // The result here is a promise, so use await
    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`The following listings were found with at least ${minBedrooms} bedrooms and ${minBathrooms} bathrooms:`);

        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log(`${i+1}. Name: ${result.name}`);
            console.log(`_id: ${result._id}`);
            console.log(`Number of bedrooms: ${result.bedrooms}`);
            console.log(`Number of bathrooms: ${result.bathrooms}`);
            console.log(`Most recent review: ${date}`);
            console.log();
        });
    } else {
        console.log(`No listing(s) found with at least ${minBedrooms} bedrooms and ${minBathrooms} bathrooms.`);
    }
}

async function findListingsBedrooms(client, bedrooms) {
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find(
        { bedrooms:bedrooms },
    );

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`The following listings were found with ${bedrooms} bedrooms.`);

        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log(`${i+1}. Name: ${result.name}`);
            console.log(`_id: ${result._id}`);
            console.log(`Number of bedrooms: ${result.bedrooms}`);
            console.log(`Number of bathrooms: ${result.bathrooms}`);
            console.log(`Most recent review: ${date}`);
            console.log();
        });
    } else {
        console.log(`No listing(s) found with ${bedrooms} bedrooms.`);
    }
}
