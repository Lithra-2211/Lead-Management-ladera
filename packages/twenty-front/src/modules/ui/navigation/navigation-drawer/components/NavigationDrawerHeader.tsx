import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { IconSearch } from 'twenty-ui/icon';
import { LightIconButton } from 'twenty-ui/input';
import { MOBILE_VIEWPORT, themeCssVariables } from 'twenty-ui/theme-constants';

import { useOpenRecordsSearchPageInSidePanel } from '@/side-panel/hooks/useOpenRecordsSearchPageInSidePanel';
import { PAGE_BAR_MIN_HEIGHT } from '@/ui/layout/page/constants/PageBarMinHeight';
import { MultiWorkspaceDropdownButton } from '@/ui/navigation/navigation-drawer/components/MultiWorkspaceDropdown/MultiWorkspaceDropdownButton';
import { useIsNavigationDrawerContentExpanded } from '@/navigation/hooks/useIsNavigationDrawerContentExpanded';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { NavigationDrawerCollapseButton } from './NavigationDrawerCollapseButton';

const StyledContainer = styled.div<{ 'data-expanded': boolean }>`
  align-items: center;
  justify-content: ${({ 'data-expanded': isExpanded }) => (isExpanded ? 'flex-start' : 'center')};
  display: flex;
  flex-direction: ${({ 'data-expanded': isExpanded }) => (isExpanded ? 'row' : 'column')};
  flex-shrink: 0;
  gap: ${({ 'data-expanded': isExpanded }) => (isExpanded ? '0' : '12px')};
  min-height: ${PAGE_BAR_MIN_HEIGHT}px;
  padding-right: ${({ 'data-expanded': isExpanded }) => (isExpanded ? themeCssVariables.spacing[2] : '0')};
  padding-left: 0;
  transition: gap calc(${themeCssVariables.animation.duration.normal} * 1s) ease;
  user-select: none;

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding-left: ${themeCssVariables.spacing[5]};
    padding-right: ${themeCssVariables.spacing[5]};
  }
`;

const StyledRightActions = styled.div<{ 'data-expanded': boolean }>`
  align-items: center;
  align-self: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 0;
  margin-left: ${({ 'data-expanded': isExpanded }) => (isExpanded ? 'auto' : '0')};
  transition: gap calc(${themeCssVariables.animation.duration.normal} * 1s) ease;
`;

const StyledNavigationDrawerCollapseButtonContainer = styled.div`
  > * {
    height: ${themeCssVariables.spacing[6]};
    padding-right: 0;
    width: ${themeCssVariables.spacing[6]};
  }

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    > * {
      height: ${themeCssVariables.spacing[8]};
      padding-right: 0;
      width: ${themeCssVariables.spacing[8]};
    }
  }
`;

const StyledWorkspaceDropdownContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  min-height: ${themeCssVariables.spacing[8]};
  min-width: 0;
`;

type NavigationDrawerHeaderProps = {
  showCollapseButton: boolean;
};

export const NavigationDrawerHeader = ({
  showCollapseButton,
}: NavigationDrawerHeaderProps) => {
  const isMobile = useIsMobile();
  const { openRecordsSearchPage } = useOpenRecordsSearchPageInSidePanel();
  const isExpanded = useIsNavigationDrawerContentExpanded();

  return (
    <StyledContainer data-expanded={isExpanded}>
      <StyledWorkspaceDropdownContainer>
        <MultiWorkspaceDropdownButton />
      </StyledWorkspaceDropdownContainer>
      <StyledRightActions data-expanded={isExpanded}>
        {/*!isMobile && (
          <LightIconButton
            Icon={IconSearch}
            accent="secondary"
            size="small"
            onClick={openRecordsSearchPage}
            aria-label={t`Search`}
          />
        )*/}
        {showCollapseButton && (
          <StyledNavigationDrawerCollapseButtonContainer>
            <NavigationDrawerCollapseButton direction="left" />
          </StyledNavigationDrawerCollapseButtonContainer>
        )}
      </StyledRightActions>
    </StyledContainer>
  );
};
