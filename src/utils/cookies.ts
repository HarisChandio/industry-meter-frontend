// Cookie utility functions

/**
 * Set a cookie with the given name, value, and expiration days
 */
export const setCookie = (name: string, value: string, days: number = 7): void => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=/; SameSite=Strict';
    document.cookie = name + '=' + cookieValue;
};

/**
 * Get a cookie by name
 */
export const getCookie = (name: string): string | null => {
    const nameWithEquals = name + '=';
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameWithEquals) === 0) {
            return decodeURIComponent(cookie.substring(nameWithEquals.length, cookie.length));
        }
    }

    return null;
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string): void => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
}; 