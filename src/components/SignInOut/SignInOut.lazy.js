import React, { lazy, Suspense } from 'react';

const LazySignInOut = lazy(() => import('./SignInOut'));

const SignInOut = props => (
  <Suspense fallback={null}>
    <LazySignInOut {...props} />
  </Suspense>
);

export default SignInOut;
