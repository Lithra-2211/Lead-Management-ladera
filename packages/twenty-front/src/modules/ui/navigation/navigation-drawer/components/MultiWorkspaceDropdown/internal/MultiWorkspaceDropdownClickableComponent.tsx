import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import {
  StyledContainer,
} from '@/ui/navigation/navigation-drawer/components/MultiWorkspaceDropdown/internal/MultiWorkspacesDropdownStyles';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { useIsNavigationDrawerContentExpanded } from '@/navigation/hooks/useIsNavigationDrawerContentExpanded';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { useContext } from 'react';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';
import { Link } from 'react-router-dom';

const StyledBrandContainer = styled(Link)<{ isExpanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ isExpanded }) => (isExpanded === false ? 'center' : 'flex-start')};
  gap: 10px;
  padding: 8px 4px;
  cursor: pointer;
  text-decoration: none;
  width: 100%;
  box-sizing: border-box;
  transform-origin: left center;
  transition: transform 250ms ease, filter 250ms ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

const StyledBrandIcon = styled.div<{ isExpanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ isExpanded }) => (isExpanded === false ? '44px' : '34px')};
  height: ${({ isExpanded }) => (isExpanded === false ? '44px' : '34px')};
  flex-shrink: 0;
  transition: width 0.2s ease, height 0.2s ease;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const StyledBrandText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledBrandName = styled.div`
  font-size: 19px;
  font-weight: 900;
  color: #fdb918;
  line-height: 1.1;
  letter-spacing: 0.5px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  opacity: 1 !important;
`;

const StyledBrandSubtitle = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #1b1b4f;
  line-height: 1.1;
  letter-spacing: 0.5px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  opacity: 1 !important;
`;

type MultiWorkspaceDropdownClickableComponentProps = {
  disabled?: boolean;
  shouldHideLabel?: boolean;
};

export const MultiWorkspaceDropdownClickableComponent = ({
  disabled,
  shouldHideLabel = false,
}: MultiWorkspaceDropdownClickableComponentProps) => {
  const isNavigationDrawerExpanded = useIsNavigationDrawerContentExpanded();
  return (
    <StyledContainer
      data-testid="workspace-dropdown"
      isNavigationDrawerExpanded={isNavigationDrawerExpanded}
      disabled={disabled}
      style={{ height: 'auto', padding: 0 }}
    >
      <StyledBrandContainer to="/objects/dashboards" isExpanded={isNavigationDrawerExpanded}>
        <StyledBrandIcon isExpanded={isNavigationDrawerExpanded}>
          <img src="/ladera-icon.png" alt="Ladera Technology Logo" />
        </StyledBrandIcon>
        {!shouldHideLabel && (
          <NavigationDrawerAnimatedCollapseWrapper>
            <StyledBrandText>
              <StyledBrandName>LADERA</StyledBrandName>
              <StyledBrandSubtitle>TECHNOLOGY</StyledBrandSubtitle>
            </StyledBrandText>
          </NavigationDrawerAnimatedCollapseWrapper>
        )}
      </StyledBrandContainer>
    </StyledContainer>
  );
};
