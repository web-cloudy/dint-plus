import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";

const useIncomingCall = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");

  return { Color };
};

export default useIncomingCall;
