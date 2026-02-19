import React, { cloneElement, ReactElement, ReactNode, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import GlobalFonts from "../assets/fonts/fonts";

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

interface ThemeConfig {
  light: {
    step: ThemeStatus;
    content: Record<string, ThemeContent>;
    progressBar: ThemeProgressBar;
  };
  dark: {
    step: ThemeStatus;
    content: Record<string, ThemeContent>;
    progressBar: ThemeProgressBar;
  };
}

interface CustomTheme {
  light?: Partial<{
    step: Partial<ThemeStatus>;
    content: Partial<Record<string, ThemeContent>>;
    progressBar: Partial<ThemeProgressBar>;
  }>;
  dark?: Partial<{
    step: Partial<ThemeStatus>;
    content: Partial<Record<string, ThemeContent>>;
    progressBar: Partial<ThemeProgressBar>;
  }>;
}

const isObject = (item: any): item is Record<string, any> => {
  return (
    item && typeof item === "object" && !Array.isArray(item) && item !== null
  );
};

const mergeDeep = (target: any, source: any): any => {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
};

const animationOpacity = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const completedBarAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const progressBarAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 50%;
  }
`;

const completedProgressBarVerticalAnimation = keyframes`
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
`;

const progressBarVerticalAnimation = keyframes`
  from {
    height: 0;
  }
  to {
    height: 50%;
  }
`;

const stepAnimationOpacityText = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const animateSuccessTip = keyframes`
  0% {
    width: 0;
    left: 0.0625em;
    top: 1.1875em;
  }
  54% {
    width: 0;
    left: 0.0625em;
    top: 1.1875em;
  }
  70% {
    width: 3.125em;
    left: -0.5em;
    top: 2.3125em;
  }
  84% {
    width: 1.0625em;
    left: 1.3125em;
    top: 3em;
  }
  100% {
    width: 1.5625em;
    left: 0.875em;
    top: 2.8125em;
  }
`;

const animateSuccessLong = keyframes`
  0% {
    width: 0;
    right: 2.875em;
    top: 3.375em;
  }
  65% {
    width: 0;
    right: 2.875em;
    top: 3.375em;
  }
  84% {
    width: 3.4375em;
    right: 0;
    top: 2.1875em;
  }
  100% {
    width: 2.9375em;
    right: 0.5em;
    top: 2.375em;
  }
`;

const StepperStyled = styled.div<{ vertical?: boolean }>`
  width: 100%;
  height: 100%;
  font-size: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  ${(props: any) =>
    props.vertical &&
    css`
      flex-direction: column;
    `}
`;

const StepStyled = styled.div<{
  theme: ThemeColors;
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
}>`
  flex-shrink: 0;
  position: relative;
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  background: ${(props: any) => props.theme.background};
  color: ${(props: any) => props.theme.color};
  ${(props: any) =>
    (props.isStepInProgress || props.isStepCompleted) &&
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

const CheckMarkStyled = styled.div<{ theme: ThemeColors }>`
  width: 5.5em;
  height: 5.5em;
  border-radius: 50%;
  margin: 0 auto;
  background: ${(props: any) => props.theme.background};
  font-size: 1em;
`;

const SaIcon = styled.div<{ theme: ThemeColors }>`
  & {
    width: 5em;
    height: 5em;
    border: 0.25em solid ${(props: any) => props.theme.background};
    border-radius: 2.5em;
    border-radius: 50%;
    border-color: ${(props: any) => props.theme.background};
    margin: auto;
    padding: 0;
    position: relative;
    box-sizing: content-box;
    overflow: hidden;
  }
  &:before,
  &:after {
    content: "";
    border-radius: 2.5em;
    border-radius: 50%;
    position: absolute;
    width: 3.75em;
    height: 7.5em;
    background: ${(props) => props.theme.background};
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

const SaTip = styled.span<{ theme: ThemeColors }>`
  height: 0.3125em;
  background-color: ${(props: any) => props.theme.color};
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

const SaLong = styled.span<{ theme: ThemeColors }>`
  height: 0.3125em;
  background-color: ${(props: any) => props.theme.color};
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
  border-radius: 2.5em;
  border-radius: 50%;
  box-sizing: content-box;
  position: absolute;
  left: -0.25em;
  top: -0.25em;
  z-index: 2;
`;

const SaFix = styled.div<{ theme: ThemeColors }>`
  width: 0.3125em;
  height: 5.625em;
  background-color: ${(props: any) => props.theme.background};
  position: absolute;
  left: 1.75em;
  top: 0.5em;
  z-index: 1;
  transform: rotate(-45deg);
`;

const Content = styled.div<{ isLastStep?: boolean; vertical?: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  margin-top: 1em;
  ${(props: any) =>
    props.isLastStep &&
    css`
      left: auto;
      right: 0;
      text-align: right;
    `}
  ${(props: any) =>
    props.vertical &&
    css`
      top: 0;
      left: 100%;
      margin: 0;
      margin-left: 1em;
    `}
    ${(props: any) =>
    props.vertical &&
    props.isLastStep &&
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
  color: ${(props: any) => props.theme.color};
`;

const StepTitleStyled = styled.p<{ theme: { color: string } }>`
  margin: 0;
  margin-top: 0.75rem;
  font-weight: bold;
  color: ${(props: any) => props.theme.color};
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
  background: ${(props: any) => props.theme.background};
  color: ${(props: any) => props.theme.color};
`;

const StepDescriptionStyled = styled.p<{ theme: { color: string } }>`
  margin: 0;
  margin-top: 0.75rem;
  font-size: 0.9em;
  color: ${(props: any) => props.theme.color};
`;

const ProgressBar = styled.div<{
  theme: ThemeProgressBar;
  vertical?: boolean;
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
}>`
  & {
    position: relative;
    width: 100%;
    height: 0.3em;
    border-radius: 2.375rem;
    margin: 0 1em;
    background: ${(props) => props.theme.background};
    ${(props) =>
      props.vertical &&
      css`
        width: 0.3em;
        height: 100%;
        margin: 1em 0;
      `}
  }
  ${(props) =>
    (props.isStepInProgress || props.isStepCompleted) &&
    css`
      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: ${(props: any) => (props.isStepInProgress ? "50%" : "100%")};
        height: 100%;
        border-radius: 2.375rem;
        background: ${(props: any) => props.theme.fill};
        animation: ${(props: any) =>
            props.isStepInProgress
              ? progressBarAnimation
              : completedBarAnimation}
          1s ease;
      }
    `}
  }
  ${(props) =>
    props.isStepInProgress &&
    props.vertical &&
    css`
      &:after {
        width: 100%;
        height: 50%;
        animation: ${progressBarVerticalAnimation} 1s ease;
      }
    `}
  ${(props) =>
    props.isStepCompleted &&
    props.vertical &&
    css`
      &:after {
        animation: ${completedProgressBarVerticalAnimation} 1s ease;
      }
    `}
`;

interface UseStepperReturn {
  step: number;
  goToStep: (stepNumber: number) => void;
  incrementStep: () => void;
  decrementStep: () => void;
}

const useStepper = (
  defaultValue: number = 0,
  numberOfSteps: number,
): UseStepperReturn => {
  const [step, setStep] = useState<number>(defaultValue);

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

interface StepNumberProps {
  text?: string;
  currentStep?: number;
  theme?: { color: string };
}

const StepNumber: React.FC<StepNumberProps> = ({
  text,
  currentStep = 1,
  theme = { color: "#000" },
}) => {
  return (
    <StepNumberStyled theme={theme} className="step-number">{`${
      text || "STEP"
    } ${currentStep}`}</StepNumberStyled>
  );
};

interface StepTitleProps {
  theme?: { color: string };
  children: ReactNode;
}

const StepTitle: React.FC<StepTitleProps> = ({
  theme = { color: "#000" },
  children,
}) => {
  return (
    <StepTitleStyled theme={theme} className="title">
      {children}
    </StepTitleStyled>
  );
};

interface StepStatusProps {
  isStepInProgress?: boolean;
  isStepCompleted?: boolean;
  isStepPending?: boolean;
  textProgress?: string;
  textCompleted?: string;
  textPending?: string;
  theme?: { background: string; color: string };
}

const StepStatus: React.FC<StepStatusProps> = ({
  isStepInProgress = false,
  isStepCompleted = false,
  isStepPending = true,
  textProgress,
  textCompleted,
  textPending,
  theme = { background: "#f2f2f2", color: "#a1a3a7" },
}) => {
  const getText = (): string => {
    let text: string = "";

    if (isStepInProgress) {
      text = textProgress || "In progress";
    }
    if (isStepCompleted) {
      text = textCompleted || "Completed";
    }
    if (isStepPending) {
      text = textPending || "Pending";
    }

    return text;
  };

  return (
    <StepStatusStyled theme={theme} className="status">
      {getText()}
    </StepStatusStyled>
  );
};

interface StepDescriptionProps {
  theme?: { color: string };
  children: ReactNode;
}

const StepDescription: React.FC<StepDescriptionProps> = ({
  theme = { color: "#000" },
  children,
}) => {
  return (
    <StepDescriptionStyled theme={theme} className="description">
      {children}
    </StepDescriptionStyled>
  );
};

interface CheckMarkProps {
  theme?: ThemeColors;
}

const CheckMark: React.FC<CheckMarkProps> = ({
  theme = { background: "#23c275", color: "#ffffff" },
}) => {
  return (
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
};

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
  children?: ReactNode;
}

const Step: React.FC<StepProps> = ({
  currentStep = 1,
  isLastStep = false,
  isStepInProgress = false,
  isStepCompleted = false,
  isStepPending = true,
  vertical = false,
  numbered = true,
  customContent,
  theme = {
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
  children,
}) => {
  const status: "progress" | "completed" | "pending" = isStepInProgress
    ? "progress"
    : isStepCompleted
    ? "completed"
    : "pending";
  const CustomContent = customContent;

  return (
    <>
      <StepStyled
        isStepInProgress={isStepInProgress}
        isStepCompleted={isStepCompleted}
        theme={theme.step[status]}
        className={`step ${isStepInProgress ? "progress" : ""}
      ${isStepCompleted ? "completed" : ""} ${isStepPending ? "pending" : ""}`}
      >
        {!customContent ? (
          <>
            {!isStepCompleted && numbered && (
              <Number className="number">{currentStep}</Number>
            )}
            {isStepCompleted && <CheckMark theme={theme.step.completed} />}
          </>
        ) : (
          CustomContent && <CustomContent />
        )}
        {children && (
          <Content
            isLastStep={isLastStep}
            vertical={vertical}
            className={`content ${isLastStep ? "last" : ""}`}
          >
            {Array.isArray(children)
              ? children.map((child, i) => {
                  return (
                    <React.Fragment key={i}>
                      {cloneElement(child as ReactElement<any>, {
                        currentStep: currentStep,
                        isStepInProgress: isStepInProgress,
                        isStepCompleted: isStepCompleted,
                        isStepPending: isStepPending,
                        theme: theme.content[status],
                      })}
                    </React.Fragment>
                  );
                })
              : cloneElement(children as ReactElement<any>, {
                  currentStep: currentStep,
                  isStepInProgress: isStepInProgress,
                  isStepCompleted: isStepCompleted,
                  isStepPending: isStepPending,
                  theme: theme.content[status],
                })}
          </Content>
        )}
      </StepStyled>
      {!isLastStep && (
        <ProgressBar
          isStepInProgress={isStepInProgress}
          isStepCompleted={isStepCompleted}
          vertical={vertical}
          theme={theme.progressBar[status]}
          className={`progress-bar ${isStepInProgress ? "progress" : ""}
          ${isStepCompleted ? "completed" : ""} ${
            isStepPending ? "pending" : ""
          }`}
        />
      )}
    </>
  );
};

interface StepperProps {
  step?: number;
  vertical?: boolean;
  dark?: boolean;
  numbered?: boolean;
  theme?: CustomTheme;
  children?: ReactElement | ReactElement[];
}

const Stepper: React.FC<StepperProps> = ({
  step = 0,
  vertical = false,
  dark = false,
  numbered = true,
  theme = {},
  children,
}) => {
  const defaultTheme: ThemeConfig = {
    light: {
      step: {
        pending: {
          background: "#ededed",
          color: "#a1a3a7",
        },
        progress: {
          background: "#3c3fed",
          color: "#ffffff",
        },
        completed: {
          background: "#23c275",
          color: "#ffffff",
        },
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
        pending: {
          background: "#ededed",
        },
        progress: {
          background: "#e7e9fd",
          fill: "#3c3fed",
        },
        completed: {
          background: "#e9faf2",
          fill: "#23c275",
        },
      },
    },
    dark: {
      step: {
        pending: {
          background: "#1a1a1a",
          color: "#767676",
        },
        progress: {
          background: "#19b6fe",
          color: "#ffffff",
        },
        completed: {
          background: "#23c275",
          color: "#ffffff",
        },
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
        pending: {
          background: "#1a1a1a",
        },
        progress: {
          background: "#08374c",
          fill: "#19b6fe",
        },
        completed: {
          background: "#0b3a23",
          fill: "#23c275",
        },
      },
    },
  };

  return (
    <>
      <GlobalFonts />
      <StepperStyled
        vertical={vertical}
        className={`stepper ${vertical ? "vertical" : ""} ${
          dark ? "dark" : ""
        }`}
      >
        {children &&
          Array.isArray(children) &&
          children.map((child, i) => {
            const isLastStep = children.length - 1 === i;
            const isStepInProgress = step === i;
            const isStepCompleted = step > i;

            return (
              <React.Fragment key={i}>
                {cloneElement(child, {
                  currentStep: i + 1,
                  isLastStep: isLastStep,
                  isStepInProgress: isStepInProgress,
                  isStepCompleted: isStepCompleted,
                  isStepPending: !isStepInProgress && !isStepCompleted,
                  vertical: vertical,
                  numbered: numbered,
                  theme: mergeDeep(defaultTheme, theme)[
                    dark ? "dark" : "light"
                  ],
                })}
              </React.Fragment>
            );
          })}
      </StepperStyled>
    </>
  );
};

export {
  Step,
  StepDescription,
  StepNumber,
  Stepper,
  StepStatus,
  StepTitle,
  useStepper,
};
