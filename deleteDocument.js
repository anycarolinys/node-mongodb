const { MongoClient } = require('mongodb');
const database = "sample_airbnb";
const collection = "listingsAndReviews";

async function main() {
    const uri = "mongodb+srv://anycaroliny:<password>@cluster0.qs0q1ba.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        // await deleteListingByName(client, "Horto flat with small garden");

        await deleteListingScrapedBeforeDate(client, new Date("2019-06-19"));
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function deleteListingByName(client, listingName) {
    const result = await client.db(database).collection(collection).deleteOne({ name: listingName });
    
    console.log(`${result.deletedCount} documents were deleted.`);
}

async function deleteListingScrapedBeforeDate(client, date) {
    const result = await client.db(database).collection(collection).deleteMany({ "last_scraped": { $lt: date } });

    console.log(`${result.deletedCount} documents were deleted`);
}
