const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function cleanup() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to DB');

        // Get duplicates for product 19
        const productId = 19;

        // 1. Get all variants for this product
        const [variants] = await connection.execute(
            "SELECT * FROM product_variants WHERE product_id = ? ORDER BY variant_id ASC",
            [productId]
        );

        console.log(`Found ${variants.length} total variants.`);

        // 2. Identify duplicates (same attributes)
        const seenAttributes = new Map();
        const idsToDelete = [];

        // Process from NEWEST to OLDEST (reverse order) so we keep the latest
        for (let i = variants.length - 1; i >= 0; i--) {
            const v = variants[i];

            // Normalize attributes string for comparison
            // The DB stores it as a JSON string, but order might vary if re-serialized. 
            // Assuming consistent formatting for now or parsing/sorting keys.
            let attrKey = v.attributes;
            try {
                const parsed = typeof v.attributes === 'string' ? JSON.parse(v.attributes) : v.attributes;
                // Sort keys to ensure '{"a":1,"b":2}' == '{"b":2,"a":1}'
                const sortedKeys = Object.keys(parsed).sort();
                const startObj = {};
                sortedKeys.forEach(k => startObj[k] = parsed[k]);
                attrKey = JSON.stringify(startObj);
            } catch (e) {
                console.warn('Error parsing attributes, using raw string:', v.attributes);
            }

            if (seenAttributes.has(attrKey)) {
                // We already saw the newest version of this attribute set.
                // This current 'v' is an OLDER duplicate. Delete it.
                console.log(`Found duplicate (older): ID ${v.variant_id} - ${attrKey}. Keeping ID ${seenAttributes.get(attrKey)}`);
                idsToDelete.push(v.variant_id);
            } else {
                // This is the newest one so far (since we are iterating backwards)
                seenAttributes.set(attrKey, v.variant_id);
            }
        }

        // 3. Delete duplicates
        if (idsToDelete.length > 0) {
            console.log('Deleting IDs:', idsToDelete);
            const placeholders = idsToDelete.map(() => '?').join(',');
            await connection.execute(
                `DELETE FROM product_variants WHERE variant_id IN (${placeholders})`,
                idsToDelete
            );
            console.log('Deletion complete.');
        } else {
            console.log('No duplicates found needing deletion.');
        }

        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

cleanup();
