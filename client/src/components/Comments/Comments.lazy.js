import React, { lazy, Suspense } from 'react';

const LazyComments = lazy(() => import('./Comments'));

const Comments = props => (
  <Suspense fallback={null}>
    <LazyComments {...props} />
  </Suspense>
);

export default Comments;
