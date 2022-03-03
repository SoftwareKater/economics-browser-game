import { Test, TestingModule } from '@nestjs/testing';
import { Building } from '../../models/building.entity';
import { City } from '../../models/city.entity';
import { CityService } from './city.service';

describe('CityService', () => {
  let service: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // mock repos, etc.
      ],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    // await testDatasetSeed();
  });

  describe('checkSpace', () => {
    it('just werks', () => {
      const mockCity = ({ buildings: [] } as unknown) as City;
      const mockBuilding = { size: 10 } as Building;
      const res = service['checkSpace'](mockBuilding, mockCity);
      expect(res).toBe(true);
    });
  });
});
