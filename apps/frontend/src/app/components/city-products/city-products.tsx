import React, { useState } from 'react';
import { useGetMyCityProductsQuery } from '@economics1k/data-access';
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
  Content,
  ProgressCircle,
  ActionGroup,
  Item,
} from '@adobe/react-spectrum';
import LockClosed from '@spectrum-icons/workflow/LockClosed';
import LockOpen from '@spectrum-icons/workflow/LockClosed';

interface CityProductTableItem {
  id: string;
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
const CityProducts = () => {
  const myCityProductsResult = useGetMyCityProductsQuery();

  const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(
    new Set()
  );

  if (myCityProductsResult.loading) {
    return <ProgressCircle aria-label="Loading Products" isIndeterminate />;
  }

  if (myCityProductsResult.error) {
    return <p>Error :(</p>;
  }

  if (!myCityProductsResult.data) {
    return <p>Not Found :/</p>;
  }

  const columns: CityProductsTableColumn[] = [
    { name: 'Name', uid: 'name' },
    { name: 'Amount', uid: 'amount' },
    { name: 'Allow?', uid: 'allow' },
  ];

  const rows: CityProductTableItem[] = myCityProductsResult.data.getMyCityProducts.map(
    (cityProduct, index) => ({
      id: '' + (index + 1),
      name: cityProduct.product.name,
      amount: cityProduct.amount,
      allow: cityProduct.allow,
    })
  );

  function changeAllowItem(rowKeys: Set<React.Key>): CityProductTableItem[] {
    const newRows: CityProductTableItem[] = [];
    rowKeys.forEach((key) => {
      const row = rows.find((row) => row.id === key);
      if (!row) {
        console.warn(`Cannot find row with key ${key}`);
        return;
      }
      const currentAllowState = row.allow;
      row.allow = !currentAllowState;
      newRows.push(row);
    });
    return newRows;
  }

  function onActionPress(action: React.Key) {
    if (action === 'allow') {
      const res = changeAllowItem(selectedKeys);
      console.error(`Not implemented API call to persist `, res);
    }
  }

  function onSelectionChange(selection: unknown) {
    const keys = selection as Set<React.Key>;
    setSelectedKeys(keys);
  }

  return (
    <Content>
      <TableView
        aria-label="Table of all products of the city."
        maxWidth="size-6000"
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
      >
        <TableHeader columns={columns}>
          {(column) => <Column key={column.uid}>{column.name}</Column>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <Row key={item.id}>
              <Cell>{item.name}</Cell>
              <Cell>{item.amount}</Cell>
              <Cell>
                {item.allow
                  ? // <LockOpen size="S" aria-label="Allowed" />
                    'yes'
                  : // <LockClosed size="S" aria-label="Locked" />
                    'no'}
              </Cell>
            </Row>
          )}
        </TableBody>
      </TableView>
      <ActionGroup onAction={onActionPress}>
        <Item key="allow">Allow/Disallow</Item>
      </ActionGroup>
    </Content>
  );
};

export default CityProducts;
