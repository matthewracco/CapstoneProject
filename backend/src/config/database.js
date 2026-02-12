const mongoose = require('mongoose');

const tenantDatabases = {};

async function connectPlatformDB() {
  try {
    const uri = process.env.PLATFORM_DB_URI || 'mongodb://localhost:27017/locker_platform';
    
    if (mongoose.connections[0].readyState === 1) {
      console.log('Platform DB already connected');
      return mongoose.connections[0];
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Platform DB connected:', uri);
    return conn;
  } catch (error) {
    console.error('Failed to connect to platform DB:', error.message);
    throw error;
  }
}

async function getTenantDB(tenantId) {
  if (tenantDatabases[tenantId]) {
    return tenantDatabases[tenantId];
  }

  try {
    const baseUri = process.env.TENANT_DB_URI || 'mongodb://localhost:27017';
    const dbName = `locker_tenant_${tenantId}`;
    const uri = baseUri.includes('{tenantId}') 
      ? baseUri.replace('{tenantId}', tenantId)
      : `${baseUri}/${dbName}`;

    const conn = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    tenantDatabases[tenantId] = conn;
    console.log(`Tenant DB connection created for ${tenantId}`);
    return conn;
  } catch (error) {
    console.error(`Failed to connect to tenant DB (${tenantId}):`, error.message);
    throw error;
  }
}

module.exports = {
  connectPlatformDB,
  getTenantDB,
};
