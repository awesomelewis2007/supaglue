import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import * as dotenv from 'dotenv';

const algorithm = 'aes-256-cbc';
const saltLength = 16;
const ivLength = 16;

const SUPPORTED_CRM_CONNECTIONS = [
  'salesforce',
  'hubspot',
  'pipedrive',
  'zendesk_sell',
  'ms_dynamics_365_sales',
  'zoho_crm',
  'capsule',
];

dotenv.config({
  path: '/app/.env',
});
const prisma = new PrismaClient();

const DO_SEED = process.env.DO_SEED === '1';

const {
  SUPAGLUE_SYNC_PERIOD_MS,
  DEV_SALESFORCE_SCOPES,
  DEV_HUBSPOT_SCOPES,
  DEV_SALESFORCE_CLIENT_ID,
  DEV_SALESFORCE_CLIENT_SECRET,
  DEV_HUBSPOT_CLIENT_SECRET,
  DEV_HUBSPOT_CLIENT_ID,
  DEV_SALESFORCE_APP_ID,
  DEV_HUBSPOT_APP_ID,
  DEV_PIPEDRIVE_CLIENT_ID,
  DEV_PIPEDRIVE_CLIENT_SECRET,
  DEV_PIPEDRIVE_SCOPES,
  DEV_PIPEDRIVE_APP_ID,
  DEV_ZENDESK_SELL_CLIENT_ID,
  DEV_ZENDESK_SELL_CLIENT_SECRET,
  DEV_ZENDESK_SELL_SCOPES,
  DEV_ZENDESK_SELL_APP_ID,
  DEV_MS_DYNAMICS_365_SALES_CLIENT_ID,
  DEV_MS_DYNAMICS_365_SALES_CLIENT_SECRET,
  DEV_MS_DYNAMICS_365_SALES_SCOPES,
  DEV_MS_DYNAMICS_365_SALES_APP_ID,
  DEV_ZOHO_CRM_CLIENT_ID,
  DEV_ZOHO_CRM_CLIENT_SECRET,
  DEV_ZOHO_CRM_SCOPES,
  DEV_ZOHO_CRM_APP_ID,
  DEV_CAPSULE_CLIENT_ID,
  DEV_CAPSULE_CLIENT_SECRET,
  DEV_CAPSULE_SCOPES,
  DEV_CAPSULE_APP_ID,
  SUPAGLUE_API_ENCRYPTION_SECRET,
  SUPAGLUE_QUICKSTART_API_KEY,
} = process.env;

const ORGANIZATION_ID = 'e7070cc8-36e7-43e2-81fc-ad57713cf2d3';

const APPLICATION_ID = 'a4398523-03a2-42dd-9681-c91e3e2efaf4';

const SALESFORCE_CUSTOMER_ID = 'external-customer-salesforce';
const HUBSPOT_CUSTOMER_ID = 'external-customer-hubspot';
const PIPEDRIVE_CUSTOMER_ID = 'external-customer-pipedrive';
const ZENDESK_SELL_CUSTOMER_ID = 'external-customer-zendesk';
const MS_DYNAMICS_365_SELL_CUSTOMER_ID = 'external-customer-ms-dynamics-365';
const ZOHO_CRM_CUSTOMER_ID = 'external-customer-zoho';
const CAPSULE_CUSTOMER_ID = 'external-customer-capsule';

const SALESFORCE_INTEGRATION_ID = '9b725cc5-98f8-4cf7-bda4-c72242b456e2';
const HUBSPOT_INTEGRATION_ID = '7ba1d794-8b15-476e-b81a-790513c287e9';
const PIPEDRIVE_INTEGRATION_ID = 'cbf33d3c-f798-4321-842f-d6f9cf56a27c';
const ZENDESK_SELL_INTEGRATION_ID = '767619f8-ecc9-487a-97f9-1e06f3702d4f';
const MS_DYNAMICS_365_SELL_INTEGRATION_ID = '59c80887-9326-43bd-bf66-dc6bd07f0a96';
const ZOHO_CRM_INTEGRATION_ID = 'a86d14f9-d0ec-4e10-bdf1-65fafbd771d2';
const CAPSULE_INTEGRATION_ID = 'f7e8ea69-f19d-4b61-8301-c1dd791757c4';

const OAUTH_CLIENT_IDS = [
  DEV_SALESFORCE_CLIENT_ID,
  DEV_HUBSPOT_CLIENT_ID,
  DEV_PIPEDRIVE_CLIENT_ID,
  DEV_ZENDESK_SELL_CLIENT_ID,
  DEV_MS_DYNAMICS_365_SALES_CLIENT_ID,
  DEV_ZOHO_CRM_CLIENT_ID,
  DEV_CAPSULE_CLIENT_ID,
];
const OAUTH_CLIENT_SECRETS = [
  DEV_SALESFORCE_CLIENT_SECRET,
  DEV_HUBSPOT_CLIENT_SECRET,
  DEV_PIPEDRIVE_CLIENT_SECRET,
  DEV_ZENDESK_SELL_CLIENT_SECRET,
  DEV_MS_DYNAMICS_365_SALES_CLIENT_SECRET,
  DEV_ZOHO_CRM_CLIENT_SECRET,
  DEV_CAPSULE_CLIENT_SECRET,
];
const OAUTH_SCOPES = [
  DEV_SALESFORCE_SCOPES,
  DEV_HUBSPOT_SCOPES,
  DEV_PIPEDRIVE_SCOPES,
  DEV_ZENDESK_SELL_SCOPES,
  DEV_MS_DYNAMICS_365_SALES_SCOPES,
  DEV_ZOHO_CRM_SCOPES,
  DEV_CAPSULE_SCOPES,
];
const OAUTH_APP_IDS = [
  DEV_SALESFORCE_APP_ID,
  DEV_HUBSPOT_APP_ID,
  DEV_PIPEDRIVE_APP_ID,
  DEV_ZENDESK_SELL_APP_ID,
  DEV_MS_DYNAMICS_365_SALES_APP_ID,
  DEV_ZOHO_CRM_APP_ID,
  DEV_CAPSULE_APP_ID,
];
const EXTERNAL_CUSTOMER_IDS = [
  SALESFORCE_CUSTOMER_ID,
  HUBSPOT_CUSTOMER_ID,
  PIPEDRIVE_CUSTOMER_ID,
  ZENDESK_SELL_CUSTOMER_ID,
  MS_DYNAMICS_365_SELL_CUSTOMER_ID,
  ZOHO_CRM_CUSTOMER_ID,
  CAPSULE_CUSTOMER_ID,
];
const INTEGRATION_IDS = [
  SALESFORCE_INTEGRATION_ID,
  HUBSPOT_INTEGRATION_ID,
  PIPEDRIVE_INTEGRATION_ID,
  ZENDESK_SELL_INTEGRATION_ID,
  MS_DYNAMICS_365_SELL_INTEGRATION_ID,
  ZOHO_CRM_INTEGRATION_ID,
  CAPSULE_INTEGRATION_ID,
];

// Remove once we can stop seeding integrations
function getKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha512');
}

function encrypt(text: string): Buffer {
  const salt = crypto.randomBytes(saltLength);
  if (!SUPAGLUE_API_ENCRYPTION_SECRET) {
    throw new Error('Cannot encrypt without a secret');
  }
  const key = getKey(SUPAGLUE_API_ENCRYPTION_SECRET, salt);
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]);

  return Buffer.concat([salt, iv, encryptedData]);
}

function encryptAsString(text: string): string {
  return encrypt(text).toString('base64');
}

// NOTE: copied from crypt.ts (can be de-duplicated after seed becomes a script)
export async function cryptoHash(text: string): Promise<{ original: string; hashed: string }> {
  const hashedText = crypto.scryptSync(text, SUPAGLUE_API_ENCRYPTION_SECRET!, 64).toString('hex');
  return {
    original: text,
    hashed: hashedText,
  };
}

async function seedApplication() {
  let hashedApiKey = '';
  if (SUPAGLUE_QUICKSTART_API_KEY) {
    ({ hashed: hashedApiKey } = await cryptoHash(SUPAGLUE_QUICKSTART_API_KEY));
  }

  // Create application
  await prisma.application.upsert({
    where: {
      id: APPLICATION_ID,
    },
    update: {
      name: 'My App',
      config: {
        apiKey: hashedApiKey,
        webhook: null,
      },
      orgId: ORGANIZATION_ID,
    },
    create: {
      id: APPLICATION_ID,
      name: 'My App',
      config: {
        apiKey: hashedApiKey,
        webhook: null,
      },
      orgId: ORGANIZATION_ID,
    },
  });
}

async function seedCustomers() {
  // Create customers
  await Promise.all(
    EXTERNAL_CUSTOMER_IDS.map((externalCustomerId, idx) =>
      prisma.customer.upsert({
        where: {
          id: `${APPLICATION_ID}:${externalCustomerId}`,
        },
        update: {
          applicationId: APPLICATION_ID,
          name: `customer-${idx}`,
          email: `customer-${idx}@email.com`,
          externalIdentifier: externalCustomerId,
        },
        create: {
          id: `${APPLICATION_ID}:${externalCustomerId}`,
          applicationId: APPLICATION_ID,
          name: `customer-${idx}`,
          email: `customer-${idx}@email.com`,
          externalIdentifier: externalCustomerId,
        },
      })
    )
  );
}

async function seedCRMIntegrations() {
  // Create integrations
  await Promise.all(
    SUPPORTED_CRM_CONNECTIONS.map(async (_, idx) => {
      const create = {
        id: INTEGRATION_IDS[idx],
        applicationId: APPLICATION_ID,
        category: 'crm',
        providerName: SUPPORTED_CRM_CONNECTIONS[idx],
        authType: 'oauth2',
        config: {
          providerAppId: OAUTH_APP_IDS[idx],
          oauth: {
            oauthScopes: OAUTH_SCOPES[idx]?.split(','),
            credentials: encryptAsString(
              JSON.stringify({
                oauthClientId: OAUTH_CLIENT_IDS[idx],
                oauthClientSecret: OAUTH_CLIENT_SECRETS[idx],
              })
            ),
          },
          sync: {
            periodMs: SUPAGLUE_SYNC_PERIOD_MS,
          },
        },
      };
      // eslint-disable-next-line prefer-const
      let { id: __, ...update } = create;
      await prisma.integration.upsert({
        where: {
          applicationId_providerName: {
            applicationId: APPLICATION_ID,
            providerName: SUPPORTED_CRM_CONNECTIONS[idx],
          },
        },
        update,
        create,
      });
    })
  );
}

async function main() {
  if (!DO_SEED) {
    return;
  }
  await seedApplication();
  await seedCustomers();
  await seedCRMIntegrations();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
