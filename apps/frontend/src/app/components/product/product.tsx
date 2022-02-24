import { useProductsQuery, useGetMyCityWithProductsQuery } from '@economics1k/data-access';
import React from 'react';

const Product = () => {
    const allProductsResult = useProductsQuery();
  const myCityResult = useGetMyCityWithProductsQuery();

  if (myCityResult.loading || allProductsResult.loading) {
    return <p>Loading...</p>;
  }
  if (myCityResult.error || allProductsResult.error) {
    return <p>Error :(</p>;
  }
  return (
    <table>
      <thead>
        <tr>
          <td>Product</td>
          <td>Amount</td>
          <td>Allow?</td>
        </tr>
      </thead>
      <tbody>
        {allProductsResult.data?.products.map(
          ({ id, name }) => {
            return (
              <tr key={id}>
                <td>{name}</td>
                <td>{myCityResult.data?.getMyCityWithProducts.products.find(cityProduct => cityProduct.product.id === id)?.amount ?? 0}</td>
                <td>[ ]</td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
};

export default Product;
