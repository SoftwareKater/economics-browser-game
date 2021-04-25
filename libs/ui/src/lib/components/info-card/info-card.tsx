import './info-card.scss';

/* eslint-disable-next-line */
export interface InfoCardProps {
  title: string;
  image: string;
  alt: string;
  amount?: number;
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

export function InfoCard(props: InfoCardProps) {
  return (
    <div className="info-card" onClick={props.primaryAction}>
      <img src={props.image} alt={props.alt}></img>
      <div>{props.amount}</div>
      {/* <button onClick={props.secondaryAction}>secondary</button> */}
    </div>
  );
}

export default InfoCard;
