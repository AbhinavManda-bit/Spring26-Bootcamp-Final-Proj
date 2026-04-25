/*
Component Description:
- Displays a past order in the Profile page.
- Shows order summary like items, total price, pickup location, and date.
*/

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase"; 
import { useAuth } from "../context/AuthContext"; 

interface Order {
  id: string;
  itemName: string;
  price: number;
  imageUrl: string;
}

function OrderCard() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      try {
        const orderDoc = await getDoc(doc(db, "orders", currentUser.uid));
        if (orderDoc.exists()) {
          const data = orderDoc.data();
          setOrders(data.orders ?? []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 w-full overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200">
        <h3 className="font-bold text-sm tracking-widest text-gray-800">
          ORDER HISTORY
        </h3>
      </div>

      {orders.length === 0 ? (
        <p className="p-5 text-sm text-gray-500">No past orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0"
          >
            <img
              src={order.imageUrl}
              alt={order.itemName}
              className="w-16 h-16 object-cover rounded-md bg-gray-50"
            />
            <span className="flex-1 text-base font-medium text-gray-800">
              {order.itemName}
            </span>
            <span className="text-base font-semibold text-gray-800">
              ${order.price.toFixed(2)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderCard;