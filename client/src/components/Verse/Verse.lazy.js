import React, { lazy, Suspense } from 'react';

const LazyVerse = lazy(() => import('./Verse'));

const Verse = props => (
  <Suspense fallback={null}>
    <LazyVerse {...props} />
  </Suspense>
);

export default Verse;
