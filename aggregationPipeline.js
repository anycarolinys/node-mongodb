const { MongoClient } = require('mongodb');

const database = "sample_airbnb";
const collection = "listingsAndReviews";

async function main() {
    const uri = "mongodb+srv://anycaroliny:<password>@cluster0.qs0q1ba.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        // The function below print the 20 cheapest suburb in the Sydney Australia market
        await returnCheapestSuburbs(client, "Australia", "Sydney", 20);
    } finally {
        await client.close();
    }
}

main().catch(console.error);


async function returnCheapestSuburbs(client, country, market, maxResults) {
    const pipeline = [
        {
            '$match': {
                'bedrooms': 1,
                'address.country': country,
                'address.market': market,
                'address.suburb': {
                    '$exists': 1,
                    '$ne': ''
                },
                'room_type': 'Entire home/apt'
            }
        }, {
            '$group': {
                '_id': '$address.suburb',
                'averagePrice': {
                    '$avg': '$price'
                }
            }
        }, {
            '$sort': {
                'averagePrice': 1
            }
        }, {
            '$limit': maxResults
        }
    ];

    const aggregationCursor = client.db(database).collection(collection).aggregate(pipeline);

    console.log(`The ${maxResults} cheapest suburbs in ${market}-${country} are:`)
    await aggregationCursor.forEach(airbnbListing => {
        console.log(`${airbnbListing._id}: ${airbnbListing.averagePrice};`)
    });
}