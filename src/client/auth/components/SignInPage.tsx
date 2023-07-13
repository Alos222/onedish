'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

import { ConfigService } from 'src/server/services/config.service';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const googleImageSize = 50;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={8} flexDirection="column">
      <Typography variant="h4" color="primary" mb={3}>
        {ConfigService.appName()}
      </Typography>
      <Button
        variant="outlined"
        sx={{ py: 0 }}
        startIcon={
          <Image src="/images/google-logo.svg" alt="google signin" width={googleImageSize} height={googleImageSize} />
        }
        endIcon={loading ? <CircularProgress size={20} sx={{ ml: 1 }} /> : null}
        disabled={loading}
        onClick={() => {
          signIn('google', { callbackUrl: '/admin' });
          setLoading(true);
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
}
