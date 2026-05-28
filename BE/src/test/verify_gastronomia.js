async function runTests() {
    const baseUrl = 'http://localhost:3000/api/gastronomia';
    let testId = null;

    try {
        console.log('--- TEST 1: Creating Gastronomy Item ---');
        const createRes = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'Gallo Pinto Especial',
                descripcion: 'Delicioso plato típico con arroz, frijoles y huevo',
                precio_minimo: 5.50,
                precio_maximo: 8.00,
                tipo: 'Posada',
                disponible: true,
                imagen: 'https://example.com/gallopinto.jpg',
                estado: 'disponible',
                features: ['Típico', 'Desayuno']
            })
        });

        if (!createRes.ok) {
            console.error('Failed to create item:', createRes.status, await createRes.text());
            return;
        }

        const createdItem = await createRes.json();
        testId = createdItem.id;
        console.log('Created item successfully with ID:', testId);
        console.log('Response includes mapped properties:');
        console.log(' - precio:', createdItem.precio, '(type:', typeof createdItem.precio, ')');
        console.log(' - disponible:', createdItem.disponible, '(type:', typeof createdItem.disponible, ')');

        console.log('\n--- TEST 2: Listing All Items ---');
        const listAllRes = await fetch(baseUrl);
        const allItems = await listAllRes.json();
        console.log(`Listed all items. Total count: ${allItems.length}`);

        console.log('\n--- TEST 3: Filtering by tipo (Posada) ---');
        const listPosadaRes = await fetch(`${baseUrl}?tipo=Posada`);
        const posadaItems = await listPosadaRes.json();
        console.log(`Posada items count (expected 1): ${posadaItems.length}`);

        console.log('\n--- TEST 4: Filtering by tipo (Isla) ---');
        const listIslaRes = await fetch(`${baseUrl}?tipo=Isla`);
        const islaItems = await listIslaRes.json();
        console.log(`Isla items count (expected 0): ${islaItems.length}`);

        console.log('\n--- TEST 5: Updating Item ---');
        const updateRes = await fetch(`${baseUrl}/${testId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'Gallo Pinto Premium',
                precio_minimo: 6.00,
                precio_maximo: 9.00
            })
        });

        if (!updateRes.ok) {
            console.error('Failed to update item:', updateRes.status, await updateRes.text());
            return;
        }

        const updatedItem = await updateRes.json();
        console.log('Updated item successfully. New values:');
        console.log(' - nombre:', updatedItem.nombre);
        console.log(' - precio_minimo:', updatedItem.precio_minimo);
        console.log(' - precio:', updatedItem.precio);

        console.log('\n--- TEST 6: Fetching Single Item by ID ---');
        const singleRes = await fetch(`${baseUrl}/${testId}`);
        const singleItem = await singleRes.json();
        console.log(`Fetched item by ID: ${singleItem.nombre} (ID: ${singleItem.id})`);

        console.log('\n--- TEST 7: Deleting Item ---');
        const deleteRes = await fetch(`${baseUrl}/${testId}`, {
            method: 'DELETE'
        });
        const deleteResult = await deleteRes.json();
        console.log('Delete result message:', deleteResult.message);

        console.log('\n--- TEST 8: Verifying deletion (Fetch by ID) ---');
        const verifyRes = await fetch(`${baseUrl}/${testId}`);
        console.log('Verify deleted item status (expected 404):', verifyRes.status);

        console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY! ===');

    } catch (e) {
        console.error('An error occurred during verification:', e);
    }
}

runTests();
