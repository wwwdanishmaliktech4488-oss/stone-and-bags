// This grabs the base URL from your api.js (e.g., https://stone-and-bags.vercel.app/api)
// Then it removes the "/api" part so it can point directly to the images.
const API_BASE_URL = 'https://stone-and-bags.vercel.app'; 

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300'; // Fallback image
  
  // If the path already starts with http, just return it
  if (imagePath.startsWith('http')) return imagePath;
  
  // Otherwise, append it to the live backend URL
  return `${API_BASE_URL}${imagePath}`;
};