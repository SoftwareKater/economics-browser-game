import './info-card.scss';
import { StatusLight } from '@adobe/react-spectrum';
import { BuildingStatus } from '../../models/building-status.interface';

/* eslint-disable-next-line */
export interface InfoCardProps {
  title: string;
  alt: string;
  status: BuildingStatus;
  amount?: number;
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

export function InfoCard(props: InfoCardProps) {
  return (
    <div className="info-card" onClick={props.primaryAction}>
      <div>
        <StatusLight variant={props.status}>{props.title}</StatusLight>
      </div>
      <div>- {props.amount} +</div>
      {/* <button onClick={props.secondaryAction}>secondary</button> */}
    </div>
  );
}

export default InfoCard;
