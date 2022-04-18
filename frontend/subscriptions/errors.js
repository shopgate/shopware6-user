import { pipelineError$ } from '@shopgate/pwa-common/streams';
import { logout } from '@shopgate/engage/user';

export default (subscribe) => {
  const errorAuthFailed$ = pipelineError$.filter((
    ({ action: { error: { code } } }) => code === 'EAUTHFAILED'
  ));
  /**
   * If the App token is de-synced the customer has to log back in.
   */
  subscribe(errorAuthFailed$, ({ dispatch }) => dispatch(logout(false)));
};
