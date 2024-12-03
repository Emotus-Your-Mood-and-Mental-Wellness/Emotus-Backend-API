const { db } = require('../config/firebase');

class FirebaseUtils {
  static async runTransaction(callback) {
    try {
      return await db.runTransaction(callback);
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new Error('Database transaction failed');
    }
  }

  static async batchWrite(operations) {
    try {
      const batch = db.batch();
      operations.forEach(op => {
        const { type, ref, data } = op;
        switch (type) {
          case 'set':
            batch.set(ref, data);
            break;
          case 'update':
            batch.update(ref, data);
            break;
          case 'delete':
            batch.delete(ref);
            break;
        }
      });
      await batch.commit();
    } catch (error) {
      console.error('Batch write failed:', error);
      throw new Error('Database batch operation failed');
    }
  }

  static createQuery(collection, filters = [], orderBy = null, limit = null) {
    let query = db.collection(collection);

    // If collection path contains slashes, use the correct reference
    if (collection.includes('/')) {
      query = db.doc(collection.substring(0, collection.lastIndexOf('/')))
               .collection(collection.substring(collection.lastIndexOf('/') + 1));
    }

    filters.forEach(filter => {
      const { field, operator, value } = filter;
      query = query.where(field, operator, value);
    });

    if (orderBy) {
      const { field, direction = 'asc' } = orderBy;
      query = query.orderBy(field, direction);
    }

    if (limit) {
      query = query.limit(limit);
    }

    return query;
  }
}

module.exports = FirebaseUtils;