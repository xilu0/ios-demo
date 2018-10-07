import { NavigationActions, NavigationContainerComponent } from 'react-navigation';

export let navigator: NavigationContainerComponent;
export function onTopLevelNavigatorRef(navigatorRef: NavigationContainerComponent) {
  navigator = navigatorRef;
}

export function navigate(routeName: string, params: object = {}) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}
