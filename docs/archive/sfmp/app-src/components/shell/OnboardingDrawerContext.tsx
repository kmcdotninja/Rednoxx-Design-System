import { createContext, useContext } from 'react'

export interface OnboardingDrawerApi {
  /** Go to the onboarding flow (start / continue). */
  openForm: () => void
  /** Open the onboarding-status drawer. */
  openStatus: () => void
  /** Open the "onboarding required" modal blocking a restricted action. */
  openVerifyPrompt: (action?: string) => void
}

export const OnboardingDrawerContext = createContext<OnboardingDrawerApi>({
  openForm: () => {},
  openStatus: () => {},
  openVerifyPrompt: () => {},
})

export function useOnboardingDrawer(): OnboardingDrawerApi {
  return useContext(OnboardingDrawerContext)
}
