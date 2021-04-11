import React from 'react';
import './detail-card.scss';

/* eslint-disable-next-line */
export interface DetailCardProps {
  id: string;
  title: string;
  image: string;
  alt: string;
  description: string;
  amount?: number;
  buttonTitle: string;
  buttonAction: () => void;
}

export class DetailCard extends React.Component {
  props: DetailCardProps;

  constructor(props: DetailCardProps) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="detail-card">
        <img src={this.props.image} alt={this.props.alt}></img>
        <h3>{this.props.title}</h3>
        <p>{this.props.description}</p>
        <div>{this.props.amount}</div>
        <button onClick={this.props.buttonAction}>
          {this.props.buttonTitle}
        </button>
      </div>
    );
  }
}

export default DetailCard;
