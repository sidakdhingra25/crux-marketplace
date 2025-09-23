// Simple script to update user to founder role
const { Pool } = require('pg');

async function updateUserToFounder() {
  // Use environment variable or default connection string
  const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/fivem_marketplace';
  const pool = new Pool({ connectionString });

  try {
    const userId = '549568266549460992';
    const newRoles = ['founder'];
    
    console.log(`🔄 Updating user ${userId} to founder role...`);
    
    // Update the user's roles directly
    const query = `
      UPDATE users 
      SET roles = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, roles, email
    `;
    
    const result = await pool.query(query, [newRoles, userId]);
    
    if (result.rows.length > 0) {
      console.log('✅ User role updated successfully!');
      console.log('📋 User details:', {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        roles: result.rows[0].roles
      });
    } else {
      console.log('❌ User not found with ID:', userId);
    }
  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the update
updateUserToFounder();
