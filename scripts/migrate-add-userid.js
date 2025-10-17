/**
 * Migration Script: Add userId to existing chats
 * 
 * This script migrates existing chats that don't have a userId field.
 * It creates a default user and assigns all orphaned chats to that user.
 * 
 * Usage:
 *   node scripts/migrate-add-userid.js
 */

const { MongoClient } = require('mongodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function migrate() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db('chat_app');
    const chatsCollection = db.collection('chats');
    const usersCollection = db.collection('users');

    // Count orphaned chats
    const orphanedCount = await chatsCollection.countDocuments({
      userId: { $exists: false }
    });

    console.log(`📊 Found ${orphanedCount} chats without userId`);

    if (orphanedCount === 0) {
      console.log('✅ No migration needed. All chats have userId.');
      return;
    }

    // Create a default "legacy" user for orphaned chats
    console.log('👤 Creating legacy user for orphaned chats...');
    
    const legacyUser = {
      deviceId: 'legacy-migration-user',
      deviceInfo: {
        browser: 'Migration Script',
        note: 'Created during migration for orphaned chats'
      },
      createdAt: new Date(),
      lastSeen: new Date()
    };

    const userResult = await usersCollection.insertOne(legacyUser);
    const legacyUserId = userResult.insertedId;

    console.log(`✅ Legacy user created: ${legacyUserId}`);

    // Update all orphaned chats
    console.log('🔄 Updating orphaned chats...');
    
    const updateResult = await chatsCollection.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: legacyUserId } }
    );

    console.log(`✅ Updated ${updateResult.modifiedCount} chats`);
    console.log('');
    console.log('📋 Migration Summary:');
    console.log(`   - Orphaned chats found: ${orphanedCount}`);
    console.log(`   - Chats updated: ${updateResult.modifiedCount}`);
    console.log(`   - Legacy user ID: ${legacyUserId}`);
    console.log('');
    console.log('✨ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrate().catch(console.error);
