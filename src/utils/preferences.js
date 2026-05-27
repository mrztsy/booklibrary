export const CATALOG_PREFERENCES_STORAGE_KEY = "aksarahub-catalog-preferences";

export const DEFAULT_CATALOG_PREFERENCES = {
  defaultTopic: "Semua",
  sort: "default",
  viewMode: "grid",
  itemsPerPage: 10,
  availableOnly: false,
};

export function normalizeCatalogPreferences(candidate = {}) {
  const preferences = candidate || {};
  const parsedItemsPerPage = Number(preferences.itemsPerPage);
  const itemsPerPage = [8, 10, 12, 16].includes(parsedItemsPerPage)
    ? parsedItemsPerPage
    : DEFAULT_CATALOG_PREFERENCES.itemsPerPage;

  return {
    ...DEFAULT_CATALOG_PREFERENCES,
    ...preferences,
    viewMode: preferences.viewMode === "list" ? "list" : "grid",
    itemsPerPage,
    availableOnly: Boolean(preferences.availableOnly),
  };
}
