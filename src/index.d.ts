import * as React from "react";

interface ThemeColors {
  background: string;
  color: string;
  fill?: string;
}

interface ThemeContent {
  stepNumber: { color: string };
  title: { color: string };
  status: { background: string; color: string };
  description: { color: string };
}

interface ThemeStatus {
  pending: ThemeColors;
  progress: ThemeColors;
  completed: ThemeColors;
}

interface ThemeProgressBar {
  pending: { background: string };
  progress: { background: string; fill: string };
  completed: { background: string; fill: string };
}

interface CustomTheme {
  light?: {
    step?: Partial<ThemeStatus>;
    content?: Partial<Record<string, ThemeContent>>;
    progressBar?: Partial<ThemeProgressBar>;
  };
  dark?: {
    step?: Partial<ThemeStatus>;
    content?: Partial<Record<string, ThemeContent>>;
    progressBar?: Partial<ThemeProgressBar>;
  };
}

interface UseStepperReturn {
  step: number;
  goToStep: (stepNumber: number) => void;
  incrementStep: () => void;
  decrementStep: () => void;
}

export function useStepper(
  defaultValue?: number,
  numberOfSteps?: number,
): UseStepperReturn;

interface StepNumberProps {
  text?: string;
  currentStep?: number;
  theme?: { color: string };
}

export const StepNumber: React.FC<StepNumberProps>;

interface StepTitleProps {
  theme?: { color: string };
  children: React.ReactNode;
}

export const StepTitle: React.FC<StepTitleProps>;

interface StepStatusProps {
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
  isStepPending?: boolean;
  textProgress?: string;
  textCompleted?: string;
  textPending?: string;
  theme?: { background: string; color: string };
}

export const StepStatus: React.FC<StepStatusProps>;

interface StepDescriptionProps {
  theme?: { color: string };
  children: React.ReactNode;
}

export const StepDescription: React.FC<StepDescriptionProps>;

interface StepProps {
  currentStep?: number;
  isLastStep?: boolean;
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
  isStepPending?: boolean;
  vertical?: boolean;
  numbered?: boolean;
  customContent?: React.ComponentType<any>;
  theme?: {
    step: Record<string, ThemeColors>;
    content: Record<string, ThemeContent>;
    progressBar: Record<string, ThemeProgressBar>;
  };
  children?: React.ReactNode;
}

export const Step: React.FC<StepProps>;

interface StepperProps {
  step?: number;
  vertical?: boolean;
  dark?: boolean;
  numbered?: boolean;
  theme?: CustomTheme;
  children?: React.ReactElement | React.ReactElement[];
}

export const Stepper: React.FC<StepperProps>;
