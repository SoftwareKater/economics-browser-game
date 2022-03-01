import React from 'react';
import {
  useProductsQuery,
  useGetMyCityWithProductsQuery,
} from '@economics1k/data-access';
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
  Content,
  ProgressCircle,
  Checkbox,
} from '@adobe/react-spectrum';

interface CityProductTableItem {
  id: number;
  name: string;
  amount: number;
  allow: boolean;
}

interface CityProductsTableColumn {
  name: string;
  uid: keyof CityProductTableItem;
}

/**
 * @todo make table multiselectable and add action like "disallow/allow" as action buttons below the table.
  */
const Product = () => {
  const myCityResult = useGetMyCityWithProductsQuery();

  if (myCityResult.loading) {
    return <ProgressCircle aria-label="Loading Products" isIndeterminate />;
  }

  if (myCityResult.error) {
    return <p>Error :(</p>;
  }

  if (!myCityResult.data) {
    return <p>Not Found :/</p>;
  }

  const columns: CityProductsTableColumn[] = [
    { name: 'Name', uid: 'name' },
    { name: 'Amount', uid: 'amount' },
    { name: 'Allow?', uid: 'allow' },
  ];

  const rows: CityProductTableItem[] = myCityResult.data.getMyCityWithProducts.products.map(
    (cityProduct, index) => ({
      id: index,
      name: cityProduct.product.name,
      amount: cityProduct.amount,
      allow: true,
    })
  );

  function changeAllowItem(tableRow: CityProductTableItem): void {
    const row = rows.find((row) => row.id === tableRow.id);
    if (!row) {
      return;
    }
    const currentAllowState = row.allow;
    row.allow = !currentAllowState;

    console.log('change the allow state of the product');
  }

  console.log(columns, rows);

  return (
    <Content>
      <TableView
        aria-label="Table of all products of the city."
        maxWidth="size-6000"
      >
        <TableHeader columns={columns}>
          {(column) => <Column key={column.uid}>{column.name}</Column>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <Row>
              <Cell>{item.name}</Cell>
              <Cell>{item.amount}</Cell>
              <Cell>
                <Checkbox
                  isSelected={item.allow}
                  onChange={() => changeAllowItem(item)}
                ></Checkbox>
              </Cell>
            </Row>
          )}
        </TableBody>
      </TableView>
    </Content>
  );
};

export default Product;
