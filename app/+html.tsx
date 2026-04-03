import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>ChesTourism — International Chess Tourism</title>
        <meta
          name="description"
          content="International Chess Tourism — tournaments, travel, and chess culture worldwide"
        />
        <meta property="og:title" content="ChesTourism — International Chess Tourism" />
        <meta
          property="og:description"
          content="International Chess Tourism — tournaments, travel, and chess culture worldwide"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://chesstourism.smartlaunchhub.com"
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
