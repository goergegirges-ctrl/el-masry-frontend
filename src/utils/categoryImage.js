import fallback from '../assets/logo-mark.svg';
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' });
// Legacy database asset paths remain usable without embedding any category slugs.
export const categoryImage = value => {
    if (typeof value !== 'string') return fallback;
    if (/^https?:\/\//.test(value)) return value;
    return images[`../assets/${value.split('/').pop()}`] || fallback;
};
