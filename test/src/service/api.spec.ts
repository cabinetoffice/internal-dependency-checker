import { describe, test, expect } from '@jest/globals';
import { createApiClient } from '../../../src/service/api';
import { createOAuthApiClient } from '@co-digital/api-sdk';

describe('apiClient test suites', () => {

    test('Should return api-sdk client object if GITHUB_KEY is provided', () => {

        const client = createApiClient('key');

        expect(client).toEqual(createOAuthApiClient('key'));
    });

    test('Should throw error if GITHUB_KEY if undefined', () => {

        expect(() => {
            createApiClient(undefined);
        }).toThrow();

    });
});
