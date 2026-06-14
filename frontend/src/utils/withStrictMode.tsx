import { StrictMode } from "react";

export function withStrictMode<Props extends object>(
  Component: React.ComponentType<Props>,
) {
  return function StrictIsland(props: Props) {
    return (
      <StrictMode>
        <Component {...props} />
      </StrictMode>
    );
  };
}
