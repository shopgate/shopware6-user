import { historyPop, historyPush } from '@shopgate/pwa-common/actions/router';
import fetchRegisterUrl from '@shopgate/pwa-common/actions/user/fetchRegisterUrl';
import { redirects } from '@shopgate/pwa-common/collections';
import { CHECKOUT_PATH, REGISTER_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import { isAndroid } from '@shopgate/pwa-common/selectors/client';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import { userDidLogin$ } from '@shopgate/pwa-common/streams/user';
import buildRegisterUrl from '@shopgate/pwa-common/subscriptions/helpers/buildRegisterUrl';
import broadcastEvent from '@shopgate/pwa-core/commands/broadcastEvent';
import closeInAppBrowser from '@shopgate/pwa-core/commands/closeInAppBrowser';
import { registerRedirect } from '@shopgate/pwa-webcheckout-shopify/action-creators/register';
import { webCheckoutRegisterRedirect$ } from '@shopgate/pwa-webcheckout-shopify/streams';

export default (subscribe) => {
  /**
   * @param {Object} params The handler parameters.
   * @param {Function} params.dispatch The Redux dispatch function.
   * @return {Promise<string>}
   */
  const redirectHandler = async ({ dispatch }) => {
    /**
     * When the register url was opened from a login page, a redirect to the original target
     * page needs to happen after a successful registration. It's added by buildRegisterUrl.
     */
    const { state: { redirect: { location = '' } = {} } } = getCurrentRoute();

    let url = await dispatch(fetchRegisterUrl());
    url = buildRegisterUrl(url, location);

    // Dispatch redirect
    dispatch(registerRedirect(url));

    return url;
  };

  subscribe(appWillStart$, () => {
    redirects.set(REGISTER_PATH, redirectHandler, true);
  });

  const loginAfterRegisterRedirect$ = webCheckoutRegisterRedirect$
    .switchMap(() => userDidLogin$.first());
  const nextRouterAfterLoginRegister$ = loginAfterRegisterRedirect$
    .switchMap(() => routeDidEnter$.first())
    .debounceTime(1000);

  /**
   * Pop a login page after web registration / and redirect to check out
   */
  subscribe(loginAfterRegisterRedirect$, ({ dispatch, getState }) => {
    const { state: { redirect: { location = '' } = {} } } = getCurrentRoute();

    const android = isAndroid(getState());
    closeInAppBrowser(android);
    if (!android) {
      dispatch(historyPop()); // navigation is page on IOS
    }

    if (location && location !== CHECKOUT_PATH) {
      dispatch(historyPush({
        pathname: location,
      }));
    }
  });

  /**
   * Close loading spinner on next after login route
   */
  subscribe(nextRouterAfterLoginRegister$, () => {
    // Close loading view
    broadcastEvent({
      event: 'closeNotification', parameters: {},
    });
  });
};
