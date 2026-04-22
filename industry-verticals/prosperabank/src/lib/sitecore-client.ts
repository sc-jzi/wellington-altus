import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';

// During build time, provide minimal configuration to pass validation
// The SitecoreClient requires either edge contextId OR local credentials (apiHost + apiKey)
// Check if we have valid credentials, otherwise provide placeholders for build
const hasEdgeContextId = Boolean(scConfig.api?.edge?.contextId);
const hasLocalCredentials = Boolean(scConfig.api?.local?.apiHost && scConfig.api?.local?.apiKey);

// Provide placeholder configuration if neither edge nor local credentials are available
// This allows the build to complete - actual values will be used at runtime via environment variables
const buildConfig = hasEdgeContextId || hasLocalCredentials
  ? scConfig
  : {
      ...scConfig,
      api: {
        ...scConfig.api,
        edge: {
          ...scConfig.api?.edge,
          contextId: 'build-placeholder-context-id',
          edgeUrl: scConfig.api?.edge?.edgeUrl || 'https://edge-platform.sitecorecloud.io',
        },
      },
    };

const client = new SitecoreClient(buildConfig);

export default client;
