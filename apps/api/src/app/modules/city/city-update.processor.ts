import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueWaiting,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { CityUpdateJob } from './models/city-update-job.interface';
import { CityUpdateService } from './services/city-update.service';
import { CITY_UPDATES_QUEUE_NAME, CITY_UPDATE_JOB_NAME } from './constants';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

/**
 * Processes jobs in the CITY_UPDATES_QUEUE_NAME queue
 */
@Processor(CITY_UPDATES_QUEUE_NAME)
export class CityUpdateProcessor {
  constructor(
    @InjectQueue(CITY_UPDATES_QUEUE_NAME)
    private readonly cityUpdatesQueue: Queue<CityUpdateJob>,
    private readonly cityUpdateService: CityUpdateService
  ) {}

  @Process(CITY_UPDATE_JOB_NAME)
  public async cityUpdate(job: Job<CityUpdateJob>) {
    const cityId = job.data.cityId;
    // @todo: add error handling for updateCity call
    // if city update fails, the update will not be added to the queue again.
    // sometimes this is the correct behavior (e.g. if the city was deleted), but sometimes it might not.
    await this.cityUpdateService.updateCity(cityId);
    let delay = await this.cityUpdateService.getTimeDelayForNextUpdateInMs(
      cityId
    );
    if (delay < 0) {
      console.error(
        'city update took longer than 1 round, updating imediately'
      );
      delay = 0;
    }
    console.log(
      `Calculated the delay for the next city update for city ${cityId}. Delay is: ${delay} ms`
    );
    await this.cityUpdatesQueue.add(
      CITY_UPDATE_JOB_NAME,
      { cityId },
      { delay }
    );

    return true;
  }

  @OnQueueError()
  onQueueErrorHandler(error: Error) {
    console.error(`Error occured in cityUpdate: ${error}`);
  }

  @OnQueueWaiting()
  onQueueWaitingHandler(jobId: string) {
    console.log(`Job ${jobId} is waiting to be processed`);
  }

  @OnQueueActive()
  onQueueActiveHandler(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data `,
      job.data
    );
  }

  @OnQueueCompleted()
  onQueueCompletedHandler(job: Job, result: any) {
    console.log(
      `Processed job ${job.id} of type ${job.name} with data ${job.data}. Got result ${result}`
    );
  }

  @OnQueueFailed()
  onQueueFailedHandler(job: Job, err: Error) {
    console.error(`Job ${job.id} failed with reason ${err}`);
  }
}
