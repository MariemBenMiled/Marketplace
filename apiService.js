// src/services/apiService.js

const fetchData = async () => {
    // eslint-disable-next-line no-undef
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    // eslint-disable-next-line no-undef
    const apiKey = process.env.REACT_APP_API_KEY;

    try {
        const response = await fetch(`${backendUrl}/some-endpoint`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export { fetchData };
