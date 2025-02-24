import { TEMPORAL_CUSTOM_SEARCH_ATTRIBUTES_AND_TYPES } from '@supaglue/core/temporal';
import { Connection } from '@temporalio/client';

const TEMPORAL_ADDRESS =
  process.env.SUPAGLUE_TEMPORAL_HOST && process.env.SUPAGLUE_TEMPORAL_PORT
    ? `${process.env.SUPAGLUE_TEMPORAL_HOST}:${process.env.SUPAGLUE_TEMPORAL_PORT}`
    : process.env.SUPAGLUE_TEMPORAL_HOST
    ? `${process.env.SUPAGLUE_TEMPORAL_HOST}:7233`
    : 'temporal';

async function run() {
  const connection = await Connection.connect({
    address: TEMPORAL_ADDRESS,
  });

  const response = await connection.operatorService.listSearchAttributes({});

  const searchAttributesAndTypesToAdd = Object.fromEntries(
    Object.entries(TEMPORAL_CUSTOM_SEARCH_ATTRIBUTES_AND_TYPES).filter(
      ([attribute]) => !(attribute in response.customAttributes)
    )
  );

  if (!Object.keys(searchAttributesAndTypesToAdd).length) {
    // eslint-disable-next-line no-console
    console.log('No new Search Attributes to add to Temporal Server');
    return;
  }

  await connection.operatorService.addSearchAttributes({
    searchAttributes: searchAttributesAndTypesToAdd,
  });

  // eslint-disable-next-line no-console
  console.log('Added Search Attributes to Temporal Server');
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
