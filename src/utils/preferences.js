export const CATALOG_PREFERENCES_STORAGE_KEY = "aksarahub-catalog-preferences";

export const DEFAULT_CATALOG_PREFERENCES = {
  defaultTopic: "Semua",
  sort: "default",
  viewMode: "grid",
  availableOnly: false,
};

export function normalizeCatalogPreferences(candidate = {}) {
  const preferences = candidate || {};
  return {
    ...DEFAULT_CATALOG_PREFERENCES,
    ...preferences,
    viewMode: preferences.viewMode === "list" ? "list" : "grid",
    availableOnly: Boolean(preferences.availableOnly),
  };
}
