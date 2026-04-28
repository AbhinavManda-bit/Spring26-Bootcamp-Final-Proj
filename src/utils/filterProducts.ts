import type { Product, Location } from '../types';

export interface ProductFilters {
  location: Location | null;
  gender: 'Men' | 'Women' | 'Unisex' | null;
  category: string | null;
  size: string | null;
  searchTerm: string;
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const { location, gender, category, size, searchTerm } = filters;
  const search = searchTerm.toLowerCase();

  return products.filter((p) => {
    if (location && p.location !== location) return false;
    if (gender && p.gender !== gender) return false;
    if (category && p.category !== category) return false;
    if (size && p.size !== size) return false;
    if (
      search &&
      !p.title.toLowerCase().includes(search) &&
      !p.description.toLowerCase().includes(search) &&
      !p.category.toLowerCase().includes(search)
    ) return false;
    return true;
  });
}
