import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable DNS resolution for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailureTime: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null, lastFailureTime: 0 };

if (!global.mongoose) {
  global.mongoose = cached;
}

// Circuit breaker cooldown (30 seconds) if DB is unreachable
const FAILURE_COOLDOWN_MS = 30000;

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  // If DB recently failed, skip connection attempt immediately to avoid blocking
  if (Date.now() - cached.lastFailureTime < FAILURE_COOLDOWN_MS) {
    throw new Error('MongoDB circuit breaker active - using instant local DB fallback');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1500, // Short timeout (1.5s) to prevent API lag
      connectTimeoutMS: 1500,
    };

    // Fast-connect promise with 1.2s timeout race
    const connectPromise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('✅ MongoDB connected successfully');
      return m;
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB connection timeout (1.2s)')), 1200)
    );

    cached.promise = Promise.race([connectPromise, timeoutPromise]);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.lastFailureTime = Date.now(); // Record failure timestamp
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
