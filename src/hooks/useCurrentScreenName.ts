import { useNavigationState } from '@react-navigation/native';

const useCurrentScreenName = () => {
  const state = useNavigationState(state => state);

  if (!state) return null;

  // This assumes your main stack has only one level of nesting with tabs
  const mainStackRoute = state.routes[state.index];
  const tabState = mainStackRoute?.state;

  if (!tabState) return mainStackRoute.name;

  const activeTabRoute = tabState.routes[tabState.index];

  return activeTabRoute.name;
};

export default useCurrentScreenName;
