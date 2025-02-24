import { createCustomer } from '@/client';
import MetricCard from '@/components/customers/MetricCard';
import { NewCustomer } from '@/components/customers/NewCustomer';
import Spinner from '@/components/Spinner';
import { useNotification } from '@/context/notification';
import { useActiveApplicationId } from '@/hooks/useActiveApplicationId';
import { useCustomers } from '@/hooks/useCustomers';
import { useNextLambdaEnv } from '@/hooks/useNextLambdaEnv';
import Header from '@/layout/Header';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import providerToIcon from '@/utils/providerToIcon';
import { getAuth } from '@clerk/nextjs/server';
import { Link, PeopleAltOutlined } from '@mui/icons-material';
import LinkIcon from '@mui/icons-material/Link';
import { Box, Grid, IconButton, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ConnectionSafeAny } from '@supaglue/types/connection';
import { type GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import Head from 'next/head';
import { useState } from 'react';
import { IS_CLOUD } from '../../api';

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  let session: Session | null = null;
  const applicationId = query.applicationId as string;

  if (!IS_CLOUD) {
    session = await getServerSession(req, res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: '/api/auth/signin',
          permanent: false,
        },
      };
    }
  } else {
    const user = getAuth(req);

    if (!user.userId || !user.orgId) {
      return {
        props: { session, signedIn: false },
      };
    }
  }

  // TODO: bring back svix if necessary
  // const svix = new Svix(process.env.SVIX_API_TOKEN!, { serverUrl: process.env.SVIX_SERVER_URL });
  // const svixDashboardUrl = (await svix.authentication.appPortalAccess(applicationId, {})).url;
  const svixDashboardUrl = 'https://supaglue.com';

  return {
    props: { session, signedIn: true, svixDashboardUrl },
  };
};

export default function Home() {
  const { nextLambdaEnv } = useNextLambdaEnv();
  const { addNotification } = useNotification();
  const { customers = [], isLoading, mutate } = useCustomers();
  const [mobileOpen, setMobileOpen] = useState(false);
  const applicationId = useActiveApplicationId();

  const onCreateCustomer = async (customerId: string, name: string, email: string) => {
    await createCustomer(applicationId, customerId, name, email);
    await mutate([...customers, { applicationId, customerId, name, email, connections: [] }], false);
  };

  // TODO: count this on server?
  const totalConnections = customers
    ?.map((customer) => customer.connections.length)
    .reduce((a: number, b: number) => a + b, 0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleEmebedLinkClick = async (params: GridRenderCellParams) => {
    addNotification({ message: 'Copied to clipboard', severity: 'success' });

    await navigator.clipboard.writeText(
      `${nextLambdaEnv?.API_HOST}/oauth/connect?applicationId=${applicationId}&customerId=${encodeURIComponent(
        params.id
      )}&providerName={{REPLACE_ME}}&returnUrl={{REPLACE_ME}}`
    );
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 300 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'connections',
      headerName: 'Connections',
      width: 150,
      renderCell: (params) => {
        return params.value.map((connection: ConnectionSafeAny) => providerToIcon(connection.providerName));
      },
    },
    {
      field: 'link',
      headerName: 'Embed Link',
      width: 100,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleEmebedLinkClick(params)}>
            <LinkIcon />
          </IconButton>
        );
      },
    },
  ];

  const rows = customers.map((customer) => ({
    id: customer.customerId,
    email: customer.email,
    name: customer.name,
    connections: customer?.connections,
  }));

  return (
    <>
      <Head>
        <title>Supaglue Management Portal</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header title="Customers" onDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
          {isLoading ? (
            <Spinner />
          ) : (
            <Stack className="gap-2">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <MetricCard
                    icon={<PeopleAltOutlined />}
                    value={
                      <Stack direction="row" className="align-center justify-center justify-between">
                        <div>{customers.length} customers</div>
                        <NewCustomer onCreate={onCreateCustomer} />
                      </Stack>
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <MetricCard icon={<Link />} value={`${totalConnections} connections`} />
                </Grid>
              </Grid>

              <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  autoHeight
                  sx={{
                    boxShadow: 1,
                    backgroundColor: 'white',
                  }}
                  density="comfortable"
                  hideFooter
                  disableColumnMenu
                  rowSelection={false}
                />
              </div>
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
}
