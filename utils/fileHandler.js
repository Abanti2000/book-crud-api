// import { promises as fs } from 'fs';

// export const readJSON = async (file) => JSON.parse(await fs.readFile(file));
// export const writeJSON = async (file, data) => await fs.writeFile(file, JSON.stringify(data, null, 2));


import { promises as fs } from 'fs';

/**
 * Reads and parses a JSON file
 * @param {string} file - Path to the JSON file
 * @returns {Promise<Object|Array>} Parsed JSON data
 */
export const readJSON = async (file) => {
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data || '[]');  // Default to [] if file is empty
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File not found — treat as empty array
      return [];
    }
    console.error(`Error reading ${file}:`, err.message);
    throw new Error('Failed to read data');
  }
};

/**
 * Writes data to a JSON file
 * @param {string} file - Path to the JSON file
 * @param {Object|Array} data - Data to write
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
