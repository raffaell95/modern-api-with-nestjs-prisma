import { ValidateResourcesIdsInterceptor } from '../../modules/validate-resources-ids/validate-resources-ids.interceptor';

describe('ValidateResourcesIdsInterceptor', () => {
  it('should be defined', () => {
    expect(new ValidateResourcesIdsInterceptor()).toBeDefined();
  });
});
