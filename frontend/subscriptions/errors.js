import { pipelineError$ } from '@shopgate/pwa-common/streams';
import { logout } from '@shopgate/engage/user';

export default (subscribe) => {
  const errorDeSync$ = pipelineError$.filter((
    ({ action: { error: { code } } }) => code === 'EDESYNC'
  ));
  /**
   * If the App token is de-synced the customer has to log back in.
   */
  subscribe(errorDeSync$, ({ dispatch }) => dispatch(logout(false)));
};
