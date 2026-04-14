/**
 * EntityManager - Simple entity-component storage.
 * Entities are plain objects stored by ID.
 */
export class EntityManager {
    constructor() {
        this.entities = new Map();
        this.nextId = 1;
    }

    /**
     * Create a new entity with the given components.
     * @param {Object} components - Key-value pairs to attach.
     * @returns {number} The entity ID.
     */
    createEntity(components = {}) {
        const id = this.nextId++;
        this.entities.set(id, { id, ...components });
        return id;
    }

    /**
     * Retrieve an entity by ID.
     * @param {number} id
     * @returns {Object | undefined}
     */
    getEntity(id) {
        return this.entities.get(id);
    }

    /**
     * Update components of an existing entity.
     * @param {number} id
     * @param {Object} components - Properties to merge.
     */
    updateEntity(id, components) {
        const entity = this.entities.get(id);
        if (entity) Object.assign(entity, components);
    }

    /**
     * Remove an entity.
     * @param {number} id
     */
    removeEntity(id) {
        this.entities.delete(id);
    }

    /**
     * Query entities that have all the specified component names.
     * @param {string[]} componentNames
     * @returns {Object[]} Array of matching entities.
     */
    query(componentNames) {
        const result = [];
        for (const entity of this.entities.values()) {
            if (componentNames.every(name => name in entity)) {
                result.push(entity);
            }
        }
        return result;
    }

    /**
     * Get all entities as an array.
     * @returns {Object[]}
     */
    getAll() {
        return Array.from(this.entities.values());
    }
}