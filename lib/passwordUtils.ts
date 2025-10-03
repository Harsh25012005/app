/**
 * Simple hash function using built-in JavaScript (no external dependencies)
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password with salt
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Ensure password is a string and not empty
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  
  try {
    // Generate a random salt
    const salt = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    
    // Combine password with salt
    const saltedPassword = password + salt;
    
    // Simple hash using built-in functions (for development - consider stronger hashing for production)
    let hash = 0;
    for (let i = 0; i < saltedPassword.length; i++) {
      const char = saltedPassword.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and make it longer/more secure
    const hexHash = Math.abs(hash).toString(16) + salt.split('').reverse().join('');
    
    // Return hash with salt appended (separated by :)
    return `${hexHash}:${salt}`;
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param storedHash - Hashed password from database (format: hash:salt)
 * @returns Promise<boolean> - True if password matches
 */
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  try {
    if (!password || !storedHash) {
      return false;
    }
    
    // Split the stored hash to get hash and salt
    const [storedHashValue, salt] = storedHash.split(':');
    
    if (!storedHashValue || !salt) {
      return false;
    }
    
    // Hash the provided password with the stored salt using same method
    const saltedPassword = password + salt;
    
    // Apply same hashing algorithm
    let hash = 0;
    for (let i = 0; i < saltedPassword.length; i++) {
      const char = saltedPassword.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and make it longer/more secure (same as hashPassword)
    const hexHash = Math.abs(hash).toString(16) + salt.split('').reverse().join('');
    
    // Compare hashes
    return hexHash === storedHashValue;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};
