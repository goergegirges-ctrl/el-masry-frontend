/**
 * Formats a category name for the UI layer by appending brand context.
 * This is applied ONLY on the rendering layer to keep backend data clean.
 * 
 * @param {string} category - The raw category name from the database.
 * @returns {string} - The formatted category name for display.
 */
export const formatCategoryName = (category) => {
  if (!category) return "";

  const mappings = {
    "كوفات": "كوفات المصرى",
    "ليدات": "ليدات المصرى",
    "تيكونات": "تيكونات المصرى",
    "بورد": "بورد المصرى",
    "مساطر شاشات": "مساطر شاشات المصرى",
    "شاشات": "شاشات المصرى"
  };

  return mappings[category] || category;
};
