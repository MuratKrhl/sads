
import React from 'react';
import { Product } from '@/utils/types';

interface TopSellingProductsTableProps {
  products: Product[];
}

const TopSellingProductsTable: React.FC<TopSellingProductsTableProps> = ({ products }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Top Selling Products</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-4 py-3">Product Name</th>
              <th scope="col" className="px-4 py-3">Category</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">Sold</th>
              <th scope="col" className="px-4 py-3">Profit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-4 font-medium text-white">
                    <div className="flex items-center space-x-3">
                        <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-md object-cover"/>
                        <span>{product.name}</span>
                    </div>
                </td>
                <td className="px-4 py-4">{product.category}</td>
                <td className="px-4 py-4">{product.price}</td>
                <td className="px-4 py-4">{product.sold}</td>
                <td className="px-4 py-4 text-green-400">{product.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProductsTable;
