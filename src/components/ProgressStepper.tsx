import React, { cloneElement, ReactElement, ReactNode, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import GlobalFonts from "../assets/fonts/fonts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorTheme {
  background: string;
  color: string;
}

interface ProgressBarTheme {
  background: string;
  fill?: string;
}

interface ContentStatusTheme {
  stepNumber: { color: string };
  title: { color: string };
  status: { background: string; color: string };
  description: { color: string };
}

interface StepTheme {
  step: {
    pending: ColorTheme;
    progress: ColorTheme;
    completed: ColorTheme;
  };
  content: {
    pending: ContentStatusTheme;
    progress: ContentStatusTheme;
    completed: ContentStatusTheme;
  };
  progressBar: {
    pending: ProgressBarTheme;
    progress: ProgressBarTheme;
    completed: ProgressBarTheme;
  };
}

interface FullTheme {
  light: StepTheme;
  dark: StepTheme;
}

type StepStatus = "progress" | "completed" | "pending";

// Props injected by Step into its direct children (StepNumber, StepTitle, etc.)
// via cloneElement — theme here is the already-resolved ContentStatusTheme
interface InjectedContentProps {
  currentStep?: number;
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
  isStepPending?: boolean;
  theme?: ContentStatusTheme;
}

// Props injected by Stepper into each Step child
interface InjectedStepProps {
  currentStep?: number;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
  isStepPending?: boolean;
  vertical?: boolean;
  numbered?: boolean;
  theme?: StepTheme;
}

export interface StepProps extends InjectedStepProps {
  customContent?: React.ComponentType;
  children?: ReactNode;
}

export interface StepperProps {
  step?: number;
  vertical?: boolean;
  dark?: boolean;
  numbered?: boolean;
  theme?: Partial<FullTheme>;
  children: ReactElement<StepProps> | ReactElement<StepProps>[];
}

export interface StepNumberProps extends InjectedContentProps {
  text?: string;
}

export interface StepTitleProps extends InjectedContentProps {
  children?: ReactNode;
}

export interface StepStatusProps extends InjectedContentProps {
  textProgress?: string;
  textCompleted?: string;
  textPending?: string;
}

export interface StepDescriptionProps extends InjectedContentProps {
  children?: ReactNode;
}

export interface CheckMarkProps {
  theme: ColorTheme;
}

export interface UseStepperReturn {
  step: number;
  goToStep: (stepNumber: number) => void;
  incrementStep: () => void;
  decrementStep: () => void;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

const isObject = (item: unknown): item is Record<string, unknown> => {
  return (
    item !== null &&
    item !== undefined &&
    typeof item === "object" &&
    !Array.isArray(item)
  );
};

const mergeDeep = <T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T => {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>,
        );
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
};

// ─── Keyframes ────────────────────────────────────────────────────────────────

const animationOpacity = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const completedBarAnimation = keyframes`
  from { width: 0; }
  to   { width: 100%; }
`;

const progressBarAnimation = keyframes`
  from { width: 0; }
  to   { width: 50%; }
`;

const completedProgressBarVerticalAnimation = keyframes`
  from { height: 0; }
  to   { height: 100%; }
`;

const progressBarVerticalAnimation = keyframes`
  from { height: 0; }
  to   { height: 50%; }
`;

const stepAnimationOpacityText = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const animateSuccessTip = keyframes`
  0%   { width: 0;        left: 0.0625em;  top: 1.1875em; }
  54%  { width: 0;        left: 0.0625em;  top: 1.1875em; }
  70%  { width: 3.125em;  left: -0.5em;    top: 2.3125em; }
  84%  { width: 1.0625em; left: 1.3125em;  top: 3em; }
  100% { width: 1.5625em; left: 0.875em;   top: 2.8125em; }
`;

const animateSuccessLong = keyframes`
  0%   { width: 0;        right: 2.875em; top: 3.375em; }
  65%  { width: 0;        right: 2.875em; top: 3.375em; }
  84%  { width: 3.4375em; right: 0;       top: 2.1875em; }
  100% { width: 2.9375em; right: 0.5em;   top: 2.375em; }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

interface StepperStyledProps {
  vertical?: boolean;
}

const StepperStyled = styled.div<StepperStyledProps>`
  width: 100%;
  height: 100%;
  font-size: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  ${({ vertical }) =>
    vertical &&
    css`
      flex-direction: column;
    `}
`;

interface StepStyledProps {
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
  theme: ColorTheme;
}

const StepStyled = styled.div<StepStyledProps>`
  flex-shrink: 0;
  position: relative;
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
  ${({ isStepInProgress, isStepCompleted }) =>
    (isStepInProgress || isStepCompleted) &&
    css`
      animation: ${animationOpacity} 1s ease;
    `}
`;

const Number = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${stepAnimationOpacityText} 1s ease;
`;

const AnimationCheckMark = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.455em;
`;

const CheckMarkStyled = styled.div<{ theme: ColorTheme }>`
  width: 5.5em;
  height: 5.5em;
  border-radius: 50%;
  margin: 0 auto;
  background: ${({ theme }) => theme.background};
  font-size: 1em;
`;

const SaIcon = styled.div<{ theme: ColorTheme }>`
  & {
    width: 5em;
    height: 5em;
    border: 0.25em solid ${({ theme }) => theme.background};
    border-radius: 50%;
    border-color: ${({ theme }) => theme.background};
    margin: auto;
    padding: 0;
    position: relative;
    box-sizing: content-box;
    overflow: hidden;
  }
  &:before,
  &:after {
    content: "";
    border-radius: 50%;
    position: absolute;
    width: 3.75em;
    height: 7.5em;
    background: ${({ theme }) => theme.background};
    transform: rotate(45deg);
  }
  &:before {
    border-radius: 7.5em 0 0 7.5em;
    top: -0.4375em;
    left: -2.0625em;
    transform: rotate(-45deg);
    transform-origin: 3.75em 3.75em;
  }
  &:after {
    border-radius: 0 7.5em 7.5em 0;
    top: -0.6875em;
    left: 1.875em;
    transform: rotate(-45deg);
    transform-origin: 0 3.75em;
  }
`;

const SaTip = styled.span<{ theme: ColorTheme }>`
  height: 0.3125em;
  background-color: ${({ theme }) => theme.color};
  display: block;
  border-radius: 0.125em;
  position: absolute;
  z-index: 2;
  width: 1.5625em;
  left: 0.875em;
  top: 2.875em;
  transform: rotate(45deg);
  animation: ${animateSuccessTip} 0.75s;
`;

const SaLong = styled.span<{ theme: ColorTheme }>`
  height: 0.3125em;
  background-color: ${({ theme }) => theme.color};
  display: block;
  border-radius: 0.125em;
  position: absolute;
  z-index: 2;
  width: 2.9375em;
  right: 0.5em;
  top: 2.375em;
  transform: rotate(-45deg);
  animation: ${animateSuccessLong} 0.75s;
`;

const SaPlaceholder = styled.div`
  width: 5em;
  height: 5em;
  border-radius: 50%;
  box-sizing: content-box;
  position: absolute;
  left: -0.25em;
  top: -0.25em;
  z-index: 2;
`;

const SaFix = styled.div<{ theme: ColorTheme }>`
  width: 0.3125em;
  height: 5.625em;
  background-color: ${({ theme }) => theme.background};
  position: absolute;
  left: 1.75em;
  top: 0.5em;
  z-index: 1;
  transform: rotate(-45deg);
`;

interface ContentProps {
  isFirstStep?: boolean;
  isLastStep?: boolean;
  vertical?: boolean;
}

const Content = styled.div<ContentProps>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 120px;
  margin-top: 1em;
  text-align: center;
  ${({ isFirstStep }) =>
    isFirstStep &&
    css`
      left: 0;
      transform: none;
      text-align: left;
    `}
  ${({ isLastStep }) =>
    isLastStep &&
    css`
      left: auto;
      right: 0;
      transform: none;
      text-align: right;
    `}
  ${({ vertical }) =>
    vertical &&
    css`
      top: 0;
      left: 100%;
      transform: none;
      text-align: left;
      margin: 0;
      margin-left: 1em;
    `}
  ${({ vertical, isLastStep }) =>
    vertical &&
    isLastStep &&
    css`
      top: auto;
      right: 0;
      bottom: 0;
      text-align: left;
    `}
`;

const StepNumberStyled = styled.p<{ theme: { color: string } }>`
  margin: 0;
  margin-top: 0.75rem;
  font-size: 0.8em;
  color: ${({ theme }) => theme.color};
`;

const StepTitleStyled = styled.p<{ theme: { color: string } }>`
  margin: 0;
  margin-top: 0.75rem;
  font-weight: bold;
  color: ${({ theme }) => theme.color};
`;

const StepStatusStyled = styled.p<{
  theme: { background: string; color: string };
}>`
  display: inline-block;
  margin: 0;
  margin-top: 0.75rem;
  padding: 0.4rem 0.75rem;
  border-radius: 2.375rem;
  font-size: 0.8em;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
`;

const StepDescriptionStyled = styled.p<{ theme: { color: string } }>`
  margin: 0;
  margin-top: 0.75rem;
  font-size: 0.9em;
  color: ${({ theme }) => theme.color};
`;

interface ProgressBarProps {
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
  vertical?: boolean;
  theme: ProgressBarTheme;
}

const ProgressBar = styled.div<ProgressBarProps>`
  & {
    position: relative;
    width: 100%;
    height: 0.3em;
    border-radius: 2.375rem;
    margin: 0 1em;
    background: ${({ theme }) => theme.background};
    ${({ vertical }) =>
      vertical &&
      css`
        width: 0.3em;
        height: 100%;
        margin: 1em 0;
      `}
  }
  ${({ isStepInProgress, isStepCompleted }) =>
    (isStepInProgress || isStepCompleted) &&
    css<ProgressBarProps>`
      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: ${({ isStepInProgress }) => (isStepInProgress ? "50%" : "100%")};
        height: 100%;
        border-radius: 2.375rem;
        background: ${({ theme }) => theme.fill};
        animation: ${({ isStepInProgress }) =>
            isStepInProgress ? progressBarAnimation : completedBarAnimation}
          1s ease;
      }
    `}
  ${({ isStepInProgress, vertical }) =>
    isStepInProgress &&
    vertical &&
    css`
      &:after {
        width: 100%;
        height: 50%;
        animation: ${progressBarVerticalAnimation} 1s ease;
      }
    `}
  ${({ isStepCompleted, vertical }) =>
    isStepCompleted &&
    vertical &&
    css`
      &:after {
        animation: ${completedProgressBarVerticalAnimation} 1s ease;
      }
    `}
`;

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useStepper = (
  defaultValue: number | undefined,
  numberOfSteps: number,
): UseStepperReturn => {
  const [step, setStep] = useState<number>(defaultValue ?? 0);

  const goToStep = (stepNumber: number): void => {
    if (step !== 0 && step < numberOfSteps) setStep(stepNumber);
  };

  const incrementStep = (): void => {
    if (step < numberOfSteps) {
      setStep((prevState) => prevState + 1);
    }
  };

  const decrementStep = (): void => {
    if (step !== 0) {
      setStep((prevState) => prevState - 1);
    }
  };

  return { step, goToStep, incrementStep, decrementStep };
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const StepNumber: React.FC<StepNumberProps> = ({
  text,
  currentStep,
  theme,
}) => {
  if (!theme) return null;
  return (
    <StepNumberStyled theme={theme.stepNumber} className="step-number">
      {`${text ?? "STEP"} ${currentStep}`}
    </StepNumberStyled>
  );
};

const StepTitle: React.FC<StepTitleProps> = ({ theme, children }) => {
  if (!theme) return null;
  return (
    <StepTitleStyled theme={theme.title} className="title">
      {children}
    </StepTitleStyled>
  );
};

const StepStatus: React.FC<StepStatusProps> = ({
  isStepInProgress,
  isStepCompleted,
  isStepPending,
  textProgress,
  textCompleted,
  textPending,
  theme,
}) => {
  if (!theme) return null;

  const getText = (): string | undefined => {
    if (isStepInProgress) return textProgress ?? "In progress";
    if (isStepCompleted) return textCompleted ?? "Completed";
    if (isStepPending) return textPending ?? "Pending";
    return undefined;
  };

  return (
    <StepStatusStyled theme={theme.status} className="status">
      {getText()}
    </StepStatusStyled>
  );
};

const StepDescription: React.FC<StepDescriptionProps> = ({
  theme,
  children,
}) => {
  if (!theme) return null;
  return (
    <StepDescriptionStyled theme={theme.description} className="description">
      {children}
    </StepDescriptionStyled>
  );
};

const CheckMark: React.FC<CheckMarkProps> = ({ theme }) => (
  <AnimationCheckMark className="animation-check-mark">
    <CheckMarkStyled theme={theme} className="check-mark">
      <SaIcon theme={theme} className="sa-icon">
        <SaTip theme={theme} className="sa-line sa-tip" />
        <SaLong theme={theme} className="sa-line sa-long" />
        <SaPlaceholder className="sa-placeholder" />
        <SaFix theme={theme} className="sa-fix" />
      </SaIcon>
    </CheckMarkStyled>
  </AnimationCheckMark>
);

// ─── Step ─────────────────────────────────────────────────────────────────────

const Step: React.FC<StepProps> = ({
  currentStep,
  isFirstStep,
  isLastStep,
  isStepInProgress,
  isStepCompleted,
  isStepPending,
  vertical,
  numbered,
  customContent,
  theme,
  children,
}) => {
  if (!theme) return null;

  const status: StepStatus = isStepInProgress
    ? "progress"
    : isStepCompleted
      ? "completed"
      : "pending";

  const CustomContent = customContent;

  const cloneWithProps = (child: ReactElement) =>
    cloneElement(child, {
      currentStep,
      isStepInProgress,
      isStepCompleted,
      isStepPending,
      theme: theme.content[status],
    } as InjectedContentProps);

  return (
    <>
      <StepStyled
        isStepInProgress={isStepInProgress}
        isStepCompleted={isStepCompleted}
        theme={theme.step[status]}
        className={`step ${isStepInProgress ? "progress" : ""} ${isStepCompleted ? "completed" : ""} ${isStepPending ? "pending" : ""}`}
      >
        {!CustomContent ? (
          <>
            {!isStepCompleted && numbered && (
              <Number className="number">{currentStep}</Number>
            )}
            {isStepCompleted && <CheckMark theme={theme.step.completed} />}
          </>
        ) : (
          <CustomContent />
        )}
        {children && (
          <Content
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            vertical={vertical}
            className={`content ${isFirstStep ? "first" : ""} ${isLastStep ? "last" : ""}`}
          >
            {Array.isArray(children)
              ? (children as ReactElement[]).map((child, i) => (
                  <React.Fragment key={i}>
                    {cloneWithProps(child)}
                  </React.Fragment>
                ))
              : cloneWithProps(children as ReactElement)}
          </Content>
        )}
      </StepStyled>
      {!isLastStep && (
        <ProgressBar
          isStepInProgress={isStepInProgress}
          isStepCompleted={isStepCompleted}
          vertical={vertical}
          theme={theme.progressBar[status]}
          className={`progress-bar ${isStepInProgress ? "progress" : ""} ${isStepCompleted ? "completed" : ""} ${isStepPending ? "pending" : ""}`}
        />
      )}
    </>
  );
};

// ─── Stepper ──────────────────────────────────────────────────────────────────

const Stepper: React.FC<StepperProps> = ({
  step = 0,
  vertical = false,
  dark = false,
  numbered = true,
  theme = {},
  children,
}) => {
  const defaultTheme: FullTheme = {
    light: {
      step: {
        pending: { background: "#ededed", color: "#a1a3a7" },
        progress: { background: "#3c3fed", color: "#ffffff" },
        completed: { background: "#23c275", color: "#ffffff" },
      },
      content: {
        pending: {
          stepNumber: { color: "#a1a3a7" },
          title: { color: "#a1a3a7" },
          status: { background: "#f2f2f2", color: "#a1a3a7" },
          description: { color: "#a1a3a7" },
        },
        progress: {
          stepNumber: { color: "#131b26" },
          title: { color: "#131b26" },
          status: { background: "#e7e9fd", color: "#3c3fed" },
          description: { color: "#131b26" },
        },
        completed: {
          stepNumber: { color: "#131b26" },
          title: { color: "#131b26" },
          status: { background: "#e9faf2", color: "#23c275" },
          description: { color: "#131b26" },
        },
      },
      progressBar: {
        pending: { background: "#ededed" },
        progress: { background: "#e7e9fd", fill: "#3c3fed" },
        completed: { background: "#e9faf2", fill: "#23c275" },
      },
    },
    dark: {
      step: {
        pending: { background: "#1a1a1a", color: "#767676" },
        progress: { background: "#19b6fe", color: "#ffffff" },
        completed: { background: "#23c275", color: "#ffffff" },
      },
      content: {
        pending: {
          stepNumber: { color: "#767676" },
          title: { color: "#767676" },
          status: { background: "#1a1a1a", color: "#767676" },
          description: { color: "#767676" },
        },
        progress: {
          stepNumber: { color: "#ece4d9" },
          title: { color: "#ece4d9" },
          status: { background: "#08374c", color: "#19b6fe" },
          description: { color: "#ece4d9" },
        },
        completed: {
          stepNumber: { color: "#ece4d9" },
          title: { color: "#ece4d9" },
          status: { background: "#0b3a23", color: "#23c275" },
          description: { color: "#ece4d9" },
        },
      },
      progressBar: {
        pending: { background: "#1a1a1a" },
        progress: { background: "#08374c", fill: "#19b6fe" },
        completed: { background: "#0b3a23", fill: "#23c275" },
      },
    },
  };

  const mergedTheme = mergeDeep(
    defaultTheme as unknown as Record<string, unknown>,
    theme as Record<string, unknown>,
  ) as unknown as FullTheme;

  const resolvedTheme = mergedTheme[dark ? "dark" : "light"];
  const childArray = React.Children.toArray(
    children,
  ) as ReactElement<StepProps>[];

  return (
    <>
      <GlobalFonts />
      <StepperStyled
        vertical={vertical}
        className={`stepper ${vertical ? "vertical" : ""} ${dark ? "dark" : ""}`}
      >
        {childArray.map((child, i) => {
          const isLastStep = childArray.length - 1 === i;
          const isStepInProgress = step === i;
          const isStepCompleted = step > i;

          return (
            <React.Fragment key={i}>
              {cloneElement(child, {
                currentStep: i + 1,
                isFirstStep: i === 0,
                isLastStep,
                isStepInProgress,
                isStepCompleted,
                isStepPending: !isStepInProgress && !isStepCompleted,
                vertical,
                numbered,
                theme: resolvedTheme,
              })}
            </React.Fragment>
          );
        })}
      </StepperStyled>
    </>
  );
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Step,
  StepDescription,
  StepNumber,
  Stepper,
  StepStatus,
  StepTitle,
  useStepper,
};
