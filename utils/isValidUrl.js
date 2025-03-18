export default function isValidUrl(urlString) {
    try {
        const url = new URL(urlString);
        return true;
    } catch {
        return false;
    }
}