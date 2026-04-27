/*
Page Description:
- Displays all products in a grid
- Features:
--> Search bar
--> Filters:
---> Category
---> Size
---> Pickup location
--> Clicking a product → ProductPage
*/

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Product, Location } from '../types';
import { filterProducts, type ProductFilters } from '../utils/filterProducts';
import LocationFilterBar from '../Components/LocationFilterBar';
import CatalogSidebar from '../Components/FilterSidebar';

const MOCK_PRODUCTS: Product[] = [];

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') ?? '';
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // TODO: fetch products from Firestore
    setProducts(MOCK_PRODUCTS);
  }, []);

  const filters: ProductFilters = {
    location: selectedLocation,
    gender: selectedGender,
    category: selectedCategory,
    size: null,
    searchTerm,
  };

  const filteredProducts = filterProducts(products, filters);

  return (
    <>
      <LocationFilterBar
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      <div className="flex" style={{ minHeight: 'calc(100vh - 112px)' }}>
        <CatalogSidebar
          selectedGender={selectedGender}
          selectedCategory={selectedCategory}
          onSelectGender={setSelectedGender}
          onSelectCategory={setSelectedCategory}
        />

        <main className="flex-1 p-8">
          {searchTerm && (
            <p className="mb-4 text-gray-600">
              Showing results for: <strong>{searchTerm}</strong>
            </p>
          )}

          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">
              {searchTerm ? `No items found for "${searchTerm}".` : 'No products yet.'}
            </p>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                  <h2 className="font-semibold text-gray-900">{product.title}</h2>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
