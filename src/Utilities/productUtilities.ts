//utility function to get a data array of all the items in the current product catalog

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Product, Location, Category, Gender, Size } from "../types";

// (as an array of products)
export const getDataOfAllItemsInCatalog = async () => {
  const collectionRef = collection(db, "products");
  let querySnapshot;
  try {
    querySnapshot = await getDocs(collectionRef);
  } catch {
    throw new Error("DB read for all items in catalog failed.");
  }

  const docsData: Product[] = querySnapshot.docs.map((docSnap) => {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  });

  return docsData;
};

//helper function to verify that an item is a real item in the catalog
export const verifyItemIdInCatalog = async (productId: string) => {
  const allItemsInCart = await getDataOfAllItemsInCatalog();
  return allItemsInCart.some((product) => product.id === productId);
};

//helper function to get the price of an item with the given productId
export const getItemPrice = async (productId: string) => {
  const allItemsInCart = await getDataOfAllItemsInCatalog();
  const itemPrice = allItemsInCart.find(
    (product) => product.id === productId,
  )?.price;
  if (itemPrice) {
    return itemPrice;
  } else {
    throw new Error("Could not find price of item");
  }
};

//get sellers products
//given an id of a seller, returns a product[] of all products uploaded by this seller
export const getSellersProducts = async (sellerUserId: string) => {
  const collectionRef = collection(db, "products");
  const q = query(collectionRef, where("sellerId", "==", sellerUserId));
  let querySnapshot;
  try {
    querySnapshot = await getDocs(q);
  } catch {
    throw new Error("DB read for a specific seller's products failed");
  }
  const docsData: Product[] = querySnapshot.docs.map((docSnap) => {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  });

  return docsData;
};

// function to delete a product with given id from firestore
// (if the document never existed succeed silently)
export const deleteProduct = async (productId: string) => {
  const docRef = doc(db, "products", productId);
  await deleteDoc(docRef);
  console.log("document with id: " + productId + " deleted from firestore");
}


// function to upsert a product
// taking in
// id, image url, title, description, size, price, category, gender, sellerId,
export const upsertProductData = async (
  id: string,
  title: string,
  description: string,
  price: number,
  size: Size,
  category: Category,
  gender: Gender,
  location: Location,
  imageUrl: string,
  sellerId: string,
) => {
  const productToUpsert: Product = {
    id: id,
    title: title,
    description: description,
    price: price,
    size: size,
    category: category,
    gender: gender,
    location: location,
    imageUrl: imageUrl,
    sellerId: sellerId,
    sold: false,
  };
  const { id: productId, ...productDataWithoutId } = productToUpsert;
  const productDocRef = doc(db, "products", productId);
  try {
    await setDoc(productDocRef, productDataWithoutId);
    console.log("upserted into firestore (product id): " + id);
  } catch {
    throw new Error("Firestore db write new product error.");
  }
};

// utility function to turn a product's sold to true
export const flipSoldToTrueOrFalseProduct = async (productId: string, target: boolean) => {
  const productDocRef = doc(db, "products", productId);
  try {
    await updateDoc(productDocRef, {sold: target});
    console.log("flipped sold to true for product with product id: " + productId);
  } catch {
    throw new Error("Firestore db write flip sold to true product error");
  }
}