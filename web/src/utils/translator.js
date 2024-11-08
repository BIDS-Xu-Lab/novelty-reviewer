export const translator = {
    translate: async function(text, target='zh') {
        const rsp = await fetch(
            'http://127.0.0.1:5000/translate',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: target,
                    format: 'html'
                })
            }
        );

        const data = await rsp.json();

        return data;
    }
}