import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';
import { Mystery } from './models/Mystery.js';
import { reserveGeneration, runGeneration } from './services/mysteryGenerationService.js';

if (!env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY. Copy .env.example to .env and add your server-side Google AI key.');
  process.exit(1);
}

try {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const interrupted = await Mystery.find({ status: { $in: ['GENERATING','VALIDATING','GENERATING_MEDIA'] } }).select('_id').lean();
  for (const [index, item] of interrupted.entries()) {
    if (index < env.MAX_ACTIVE_GENERATIONS && reserveGeneration()) {
      setImmediate(() => runGeneration(item._id).catch((error) => console.error('Recovered generation error:', error.message)));
    } else {
      await Mystery.findByIdAndUpdate(item._id, { status: 'FAILED', failureMessage: 'This case was interrupted while the server was offline. Please retry it.' });
    }
  }
  const server = app.listen(env.PORT, () => console.log(`AI Mystery Room API listening on port ${env.PORT}`));
  const shutdown = async () => { server.close(); await mongoose.disconnect(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch (error) {
  console.error('Could not connect to MongoDB. Check MONGODB_URI and confirm the database is reachable.');
  console.error(error.message);
  process.exit(1);
}
