declare module "react-progress-stepper-ts" {
  // example
  export function Stepper(props: any): React.JSX;
  export function Step(props: any): React.JSX;
  export function StepNumber(props: any): React.JSX;
  export function StepStatus(props: any): React.JSX;
  export function StepDescription(props: any): React.JSX;
  export function useStepper(
    defaultValue: any,
    numberOfSteps: any
  ): {
    step: any;
    goToStep: (stepNumber: any) => void;
    incrementStep: () => void;
    decrementStep: () => void;
  };
}
