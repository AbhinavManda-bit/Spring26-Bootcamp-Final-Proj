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
import { useAuth } from '../context/AuthContext';
import { getDataOfAllItemsInCatalog } from '../Utilities/productUtilities';
import ProductCard from '../Components/ProductCard';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') ?? '';
  const navigate = useNavigate();
  const { currentUser, currentUserData } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women' | 'Unisex' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // TODO: fetch products from Firestore
    const setProductsOnLoad = async () => {
      setProducts(await getDataOfAllItemsInCatalog());
    };
    setProductsOnLoad();
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
              <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}