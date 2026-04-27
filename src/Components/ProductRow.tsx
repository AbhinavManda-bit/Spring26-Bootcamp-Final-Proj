import {
  type Product,
  type Location,
  type Size,
  type Gender,
  type Category,
} from "../types";
import TrashIcon from "../assets/trash_icon.png";
import PenIcon from "../assets/pen_icon.png";
import CheckIcon from "../assets/checkmark_icon.png";
import { useState, type ChangeEvent } from "react";
// func comp to be used as a product in the seller dashboard - seller catalog

const ProductRow = ({
  product,
  editDefault,
  onDeleteProduct,
  onSubmitProduct,
}: {
  product: Product;
  editDefault: boolean;
  onDeleteProduct: (productId: string) => Promise<void>;
  onSubmitProduct: (
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
  ) => Promise<void>;
}) => {
  const [editing, setEditing] = useState(editDefault);

  const [newImageUrl, setNewImageUrl] = useState(product.imageUrl);
  const [newTitle, setNewTitle] = useState(product.title);
  const titleValid = newTitle.length >= 3 && newTitle.length <= 30;
  const [newDescription, setNewDescription] = useState(product.description);
  const descriptionValid =
    newDescription.length >= 20 && newTitle.length <= 200;
  const [newGender, setNewGender] = useState(product.gender);
  const genderValid = newGender != "";
  const [newCategory, setNewCategory] = useState(product.category);
  const categoryValid = newCategory != "";
  const [newSize, setNewSize] = useState(product.size);
  const sizeValid = newSize != "";
  const [newPrice, setNewPrice] = useState(product.price);
  const priceValid =
    /^[0-9]{1,5}(\.[0-9]{2})?/.test(newPrice.toString()) &&
    newPrice >= 0.01 &&
    newPrice <= 99999.99;
  const [newLocation, setNewLocation] = useState(product.location);
  const locationValid = newLocation != "";

  const toggleEditing = () => {
    if (product.sold) {
      alert("You can't edit an item that has already been sold!");
    } else {
      setEditing(!editing);
      console.log("set editing to " + !editing);
    }
  };

  const cloudinaryUploadPreset: string = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryCloudName: string = import.meta.env
    .VITE_CLOUDINARY_CLOUD_NAME;

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    if (!image) return;

    const apiCallBody = new FormData();
    apiCallBody.append("file", image);
    apiCallBody.append("upload_preset", cloudinaryUploadPreset);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: apiCallBody,
      },
    );
    const dataFromResponse = await response.json();
    setNewImageUrl(dataFromResponse.secure_url);
  };

  const onTrashClick = async () => {
    await onDeleteProduct(product.id);
  };

  const onCheckmarkClick = async () => {
    if (
      titleValid &&
      descriptionValid &&
      genderValid &&
      categoryValid &&
      sizeValid &&
      priceValid &&
      locationValid
    ) {
      await onSubmitProduct(
        product.id,
        newTitle,
        newDescription,
        newPrice,
        newSize,
        newCategory,
        newGender,
        newLocation,
        newImageUrl,
        product.sellerId,
      );
      setEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.5fr_1fr] py-6 border-b items-center">
      {/* div for the product image and product title (going in product column) */}
      <div className="flex items-center gap-4 min-w-0">
        {!editing ? (
          <img
            className="w-20 h-20 object-contain shrink-0"
            src={product.imageUrl}
          />
        ) : (
          // div to hold preview of new image plus an image upload
          <div className="flex flex-col gap-2">
            <img
              className="w-20 h-20 object-contain shrink-0"
              src={newImageUrl}
            />
            <input
              type="file"
              accept="image/*"
              id="imageUploader"
              onChange={handleImageUpload}
              className="hidden"
            />
            {/* built a custom label for the image uploader. because we hate 
            how we can't change it's format! */}
            <label
              htmlFor="imageUploader"
              className="w-20 h-20 border border-gray-300 bg-white rounded-lg 
                        px-3 py-2 text-sm focus:outline-none text-center"
            >
              Upload New Image
            </label>
          </div>
        )}
        {!editing ? (
          <p>{product.title}</p>
        ) : (
          // div to hold name edit text box and error message for input
          <div className="flex flex-col justify-center gap-2 w-35 text-center">
            <input
              type="text"
              className={`w-35 min-w-0 border bg-white
                        rounded-lg px-3 py-2 text-sm focus:outline-none
                        ${titleValid ? "border-gray-300" : "border-red-500 bg-red-50"}`}
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              minLength={3}
              maxLength={30}
              placeholder="3-30 characters"
            />
            {!titleValid && (
              <p className="text-red-500 text-xs mt-1">
                Title must be 3-30 characters
              </p>
            )}
            <textarea
              className={`w-35 h-30 min-w-0 border bg-white
                        rounded-lg px-3 py-2 text-sm focus:outline-none
                        ${descriptionValid ? "border-gray-300" : "border-red-500 bg-red-50"}`}
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              minLength={20}
              maxLength={200}
              placeholder="20-200 characters"
            />
            {!descriptionValid && (
              <p className="text-red-500 text-xs mt-1">
                Description must be 20-200 characters
              </p>
            )}
          </div>
        )}
      </div>
      {/* category and gender (going in category column) */}
      {!editing ? (
        <p>
          {product.gender} - {product.category}
        </p>
      ) : (
        // div to hold gender selection and category selection
        <div className="flex flex-col gap-2">
          {/* div to hold gender selection and error message */}
          <div className="flex flex-col justify-center gap-2">
            <select
              value={newGender}
              onChange={(event) => setNewGender(event.target.value as Gender)}
              className="w-25 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
            {!genderValid && (
              <p className="text-red-500 text-xs mt-1">Select a gender.</p>
            )}
          </div>
          {/* div to hold category and error message */}
          <div className="flex flex-col justify-center gap-2">
            <select
              value={newCategory}
              onChange={(event) =>
                setNewCategory(event.target.value as Category)
              }
              className="w-26 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Accessories">Accessories</option>
            </select>
            {!categoryValid && (
              <p className="text-red-500 text-xs mt-1">Select a category.</p>
            )}
          </div>
        </div>
      )}
      {/* product size */}
      {!editing ? (
        <p>{product.size}</p>
      ) : (
        // div for product size selection plus error message
        <div className="flex flex-col justify-center gap-2">
          {/* // product size selection */}
          <select
            value={newSize}
            onChange={(event) => setNewSize(event.target.value as Size)}
            className="w-18 border border-gray-300 bg-white rounded-lg 
                  px-3 py-2 text-sm focus:outline-none"
          >
            <option value="XXS">XXS</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
          {!sizeValid && (
            <p className="text-red-500 text-xs mt-1">Select a size.</p>
          )}
        </div>
      )}
      {/* product price */}
      {!editing ? (
        <p>
          {/^[0-9]+\.[0-9]{2}$/.test(product.price.toString())
            ? "$" + product.price
            : "$" + product.price + ".00"}
        </p>
      ) : (
        // div for a dollar sign plus price selection plus potential error message
        <div className="flex flex-col items-center gap-1 w-22 text-center">
          {/* inner div for price selection plus dollar sign message */}
          <div className="flex items-center gap-2">
            <p>$</p>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="99999.99"
              value={newPrice}
              onChange={(event) => setNewPrice(Number(event.target.value))}
              className="w-25 border border-gray-300 bg-white rounded-lg 
                        px-3 py-2 text-sm focus:outline-none"
            ></input>
          </div>
          {!priceValid && (
            <p className="text-red-500 text-xs mt-1">
              Price must be a number 0.01 - 99999.99 with 0 or 2 decimal digits.
            </p>
          )}
        </div>
      )}
      {/* product availability (in stock or not) */}
      {product.sold ? (
        <p className="text-red-500">NO</p>
      ) : (
        <p className="text-green-500">YES</p>
      )}
      {/* product pickup location */}
      {!editing ? (
        <p>{product.location.toUpperCase()}</p>
      ) : (
        // div to hold product location selection and error message
        <div className="flex flex-col justify-start">
          {/* // product location selection */}
          <select
            value={newLocation}
            onChange={(event) => setNewLocation(event.target.value as Location)}
            className="w-35 border border-gray-300 bg-white rounded-lg 
                  px-3 py-2 text-sm focus:outline-none"
          >
            <option value="Van Munching">Van Munching</option>
            <option value="McKeldin">McKeldin</option>
            <option value="Clarice">Clarice</option>
          </select>
          {!locationValid && (
            <p className="text-red-500 text-xs mt-1">Select a location.</p>
          )}
        </div>
      )}
      {/* actions column */}
      {!editing ? (
        // div to hold images for toggling editing and removing an item
        <div>
          {!product.sold && (
            <div className="flex gap-4">
              <img
                className="w-6 h-6"
                src={PenIcon}
                onClick={toggleEditing}
                style={{ cursor: "pointer" }}
              />
              <img
                className="w-6 h-6"
                src={TrashIcon}
                onClick={() => onTrashClick()}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      ) : (
        // div to hold images for toggling editing and submitting item info
        <div>
          {!product.sold && (
            <div className="flex gap-4">
              <img
                className="w-6 h-6"
                src={PenIcon}
                onClick={toggleEditing}
                style={{ cursor: "pointer" }}
              />
              <img
                className="w-6 h-6"
                src={CheckIcon}
                onClick={() => onCheckmarkClick()}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductRow;
