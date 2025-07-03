import { promises as fs } from 'fs';

/**
 * 
 * @param {string} file 
 * @returns {Promise<Object|Array>} 
 */
export const readJSON = async (file) => {
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data || '[]'); 
  } catch (err) {
    if (err.code === 'ENOENT') {
    
      return [];
    }
    console.error(`Error reading ${file}:`, err.message);
    throw new Error('Failed to read data');
  }
};

/**
 * 
 * @param {string} file 
 * @param {Object|Array} data 
 */
export const writeJSON = async (file, data) => {
  try {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(file, json);
  } catch (err) {
    console.error(`Error writing to ${file}:`, err.message);
    throw new Error('Failed to write data');
  }
};
