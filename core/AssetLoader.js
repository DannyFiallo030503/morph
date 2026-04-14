/**
 * AssetLoader - Handles loading and caching of images and sounds.
 */
export class AssetLoader {
    constructor() {
        this.images = new Map();
        this.sounds = new Map();
    }

    /**
     * Load an image and store it under the given key.
     * @param {string} key - Identifier for the image.
     * @param {string} src - Image source URL.
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { this.images.set(key, img); resolve(img); };
            img.onerror = reject;
            img.src = src;
        });
    }

    /**
     * Retrieve a previously loaded image.
     * @param {string} key - Image identifier.
     * @returns {HTMLImageElement | undefined}
     */
    getImage(key) { return this.images.get(key); }

    /**
     * Load an audio file and store it under the given key.
     * @param {string} key - Identifier for the sound.
     * @param {string} src - Audio source URL.
     * @returns {Promise<HTMLAudioElement>}
     */
    loadSound(key, src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(src);
            audio.addEventListener('canplaythrough', () => {
                this.sounds.set(key, audio);
                resolve(audio);
            });
            audio.onerror = reject;
            audio.src = src;
        });
    }

    /**
     * Retrieve a previously loaded sound.
     * @param {string} key - Sound identifier.
     * @returns {HTMLAudioElement | undefined}
     */
    getSound(key) { return this.sounds.get(key); }
}