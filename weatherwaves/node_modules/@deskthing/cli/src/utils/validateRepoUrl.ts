
export async function validateRepoUrl(url: string): Promise<boolean> {
    try {
        // Check if URL is valid
        const parsedUrl = new URL(url);
        
        // Check if it's a GitHub URL
        if (parsedUrl.hostname === 'github.com') {
            // Make a HEAD request to validate the repository exists
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        }

        // For non-GitHub URLs, just check if the URL is accessible
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        // Invalid URL format or network error
        return false;
    }
}
