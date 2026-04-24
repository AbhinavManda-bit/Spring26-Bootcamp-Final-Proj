/*
Component Description:
- Displays a past order in the Profile page.
- Shows order summary like items, total price, pickup location, and date.
*/

import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const items = Object.values(order.items);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Order #{order.id}</span>
        <span className="font-semibold">${order.total.toFixed(2)}</span>
      </div>
      <p className="text-sm text-gray-500 mb-2">Pickup: {order.location}</p>
      <ul className="space-y-1">
        {items.map((product) => (
          <li key={product.id} className="text-sm text-gray-700">
            {product.title} — ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
