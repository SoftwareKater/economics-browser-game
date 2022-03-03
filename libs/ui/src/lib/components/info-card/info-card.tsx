import './info-card.scss';
import { StatusLight, View, Heading } from '@adobe/react-spectrum';
import { BuildingStatus } from '../../models/building-status.type';

/* eslint-disable-next-line */
export interface InfoCardProps {
  title: string;
  alt: string;
  statusLightColor: BuildingStatus;
  status: string;
  amount?: number;
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

export function InfoCard(props: InfoCardProps) {
  return (
    <View
      borderWidth="thin"
      borderColor="dark"
      borderRadius="medium"
      padding="size-250"
    >
      <div className="info-card" onClick={props.primaryAction}>
        <StatusLight variant={props.statusLightColor}>{props.status}</StatusLight>
        <Heading level={4}>{props.title}</Heading>
        <div>- {props.amount} +</div>
        {/* <button onClick={props.secondaryAction}>secondary</button> */}
      </div>
    </View>
  );
}

export default InfoCard;
