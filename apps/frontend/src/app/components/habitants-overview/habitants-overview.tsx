import React, { useState } from 'react';
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
  useAsyncList,
} from '@adobe/react-spectrum';
import { useGetMyCityQuery } from '@economics1k/data-access';
import { useCollator } from '@react-aria/i18n';

export type TableKey = 'name' | 'housing' | 'employer';

export interface HabitantsTableItem {
  id: number;
  name: string;
  housing: string;
  employer: string;
  starving: number;
}

/**
 * @todo add row actions to change accommodation and workplace
 * @returns
 */
export const HabitantsOverview = () => {
  const collator = useCollator({ numeric: true });

  const { loading, error, data } = useGetMyCityQuery();

  const columns = [
    { name: 'Name', uid: 'name' },
    { name: 'Houseing', uid: 'housing' },
    { name: 'Employer', uid: 'employer' },
    { name: 'Starving For (in rounds)', uid: 'starving' },
  ];

  const list = useAsyncList({
    async load({ signal }) {
      if (!data) {
        return { items: [] };
      }
      return {
        items: data?.getMyCity.habitants.map((habitant, index) => ({
          id: index,
          name: habitant.name,
          housing: habitant.accommodation?.building.name ?? '',
          employer: habitant.employment?.building.name ?? '',
          starving: habitant.starving,
        })),
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: HabitantsTableItem, b: HabitantsTableItem) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          let cmp = collator.compare(first, second);
          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  if (!data) {
    return <div></div>;
  }
  const rows = data?.getMyCity.habitants.map((habitant, index) => ({
    id: index,
    name: habitant.name,
    housing: habitant.accommodation?.building.name ?? '',
    employer: habitant.employment?.building.name ?? '',
    starving: habitant.starving,
  }));

  return (
    <TableView
      aria-label="Table of all habitants"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      maxWidth="size-8000"
      height="size-5000"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <Column key={column.uid} minWidth={200} allowsSorting>
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => <Row>{(columnKey) => <Cell>{item[columnKey]}</Cell>}</Row>}
      </TableBody>
    </TableView>
  );
};

export default HabitantsOverview;
