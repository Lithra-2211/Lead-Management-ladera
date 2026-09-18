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

const StyledBrandContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
`;

const StyledBrandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
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
  font-size: 16px;
  font-weight: 800;
  color: #fdb918;
  line-height: 1.1;
  letter-spacing: 0.5px;
`;

const StyledBrandSubtitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #1b1b4f;
  line-height: 1.1;
  letter-spacing: 0.5px;
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
      <StyledBrandContainer>
        <StyledBrandIcon>
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
