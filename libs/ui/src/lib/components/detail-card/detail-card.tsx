import React, { Key } from 'react';
import { Heading } from '@adobe/react-spectrum';
import { View } from '@adobe/react-spectrum';
import { ActionGroup, Item } from '@adobe/react-spectrum';
import { Content } from '@adobe/react-spectrum';
import { BuildingCost } from '../../models/building-cost.interface';

/* eslint-disable-next-line */
export interface DetailCardProps {
  id: string;
  title: string;
  image: string;
  alt: string;
  buildingType: string;
  description: string;
  amount: number;
  constructionCosts: BuildingCost[];
  maintenanceCosts: BuildingCost[];
  places: number;
  size: number;
  buildAction: () => void;
  destroyAction: () => void;
  destroyAllAction: () => void;
}

export class DetailCard extends React.Component {
  props: DetailCardProps;

  constructor(props: DetailCardProps) {
    super(props);
    this.props = props;
  }

  private onActionPress(action: Key): void {
    if (action === 'build') {
      this.props.buildAction();
    }
    if (action === 'destroy') {
      this.props.destroyAction();
    }
    if (action === 'destroyAll') {
      this.props.destroyAllAction();
    }
  }

  render() {
    return (
      <View
        borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
        paddingBottom="size-250"
        paddingX="size-250"
      >
        <Heading level={3}>{this.props.title}</Heading>
        <Content>{this.props.description}</Content>
        <img src={this.props.image} alt={this.props.alt}></img>
        <Content>
          You have: {this.props.amount} {this.props.title}s
        </Content>
        <Content>
          Construction Costs:{' '}
          {this.props.constructionCosts?.length > 0
            ? this.props.constructionCosts
                .map((cost) => `${cost.productName} (${cost.amount})`)
                .join(', ')
            : '-'}
        </Content>
        <Content>
          Maintenance Costs:{' '}
          {this.props.maintenanceCosts?.length > 0
            ? this.props.maintenanceCosts
                .map((cost) => `${cost.productName} (${cost.amount})`)
                .join(', ')
            : '-'}
        </Content>
        <Content>Size: {this.props.size} sqm</Content>
        <Content>Places (work / housing): {this.props.places}</Content>
        <div></div>
        <ActionGroup onAction={this.onActionPress.bind(this)}>
          <Item key="build">Build</Item>
          <Item key="destroy">Destroy</Item>
          <Item key="destroyAll">Destroy All</Item>
        </ActionGroup>
      </View>
    );
  }
}

export default DetailCard;
