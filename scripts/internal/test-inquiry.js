async function test() {
    try {
        const resp = await fetch('http://localhost:3000/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                email: "test@example.com",
                message: "Hello world"
            })
        });
        const data = await resp.json();
        console.log('Status:', resp.status);
        console.log('Body:', data);
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}
test();
