import { appWillStart$, PipelineRequest } from '@shopgate/engage/core';

export default (subscribe) => {
  subscribe(appWillStart$, async ({ getState }) => {
    // we only need to sync guests
    const { user: { data: { id: userId = null } = {} } = {} } = getState();
    if (userId) {
      return;
    }

    await new PipelineRequest('apite.user.initContextToken')
      .setTrusted()
      .dispatch();
  });
};
