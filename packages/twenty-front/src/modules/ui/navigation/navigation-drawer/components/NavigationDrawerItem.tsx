import { useIsNavigationDrawerContentExpanded } from '@/navigation/hooks/useIsNavigationDrawerContentExpanded';
import { NAVIGATION_DRAWER_COLLAPSED_WIDTH } from '@/ui/layout/resizable-panel/constants/NavigationDrawerCollapsedWidth';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerItemBreadcrumb } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItemBreadcrumb';
import { useNavigationDrawerTooltip } from '@/ui/navigation/navigation-drawer/hooks/useNavigationDrawerTooltip';
import { type NavigationDrawerSubItemState } from '@/ui/navigation/navigation-drawer/types/NavigationDrawerSubItemState';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { type JSX, type ReactNode, useContext } from 'react';
import { Link } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { Pill, TintedIconTile } from 'twenty-ui/data-display';
import { type IconComponent, type TablerIconsProps } from 'twenty-ui/icon';
import {
  AppTooltip,
  OverflowingTextWithTooltip,
  TooltipDelay,
  TooltipPosition,
} from 'twenty-ui/surfaces';
import { Label } from 'twenty-ui/typography';
import {
  MOBILE_VIEWPORT,
  ThemeContext,
  themeCssVariables,
} from 'twenty-ui/theme-constants';
import {
  type TriggerEventType,
  useMouseDownNavigation,
} from 'twenty-ui/utilities';
const DEFAULT_INDENTATION_LEVEL = 1;

export type NavigationDrawerItemIndentationLevel = 1 | 2;

export type NavigationDrawerItemModifier =
  | 'soon'
  | 'new'
  | { keyboard: string[] };

export type NavigationDrawerItemProps = {
  className?: string;
  label: string;
  secondaryLabel?: string;
  indentationLevel?: NavigationDrawerItemIndentationLevel;
  subItemState?: NavigationDrawerSubItemState;
  to?: string;
  onClick?: () => void;
  Icon?: IconComponent | ((props: TablerIconsProps) => JSX.Element);
  iconColor?: string | null;
  withIconBackground?: boolean;
  active?: boolean;
  modifier?: NavigationDrawerItemModifier;
  rightOptions?: ReactNode;
  alwaysShowRightOptions?: boolean;
  isDragging?: boolean;
  isRightOptionsDropdownOpen?: boolean;
  triggerEvent?: TriggerEventType;
  preventCollapseOnMobile?: boolean;
  isSelectedInEditMode?: boolean;
  variant?: 'default' | 'tertiary';
};

type StyledItemProps = Pick<
  NavigationDrawerItemProps,
  | 'active'
  | 'indentationLevel'
  | 'to'
  | 'isDragging'
  | 'isSelectedInEditMode'
  | 'variant'
> & {
  isSoon: boolean;
  isNavigationDrawerExpanded: boolean;
  hasRightOptions: boolean;
  href?: string;
  target?: string;
  rel?: string;
};

const StyledItem = styled.button<StyledItemProps>`
  align-items: center;
  position: relative;
  background: transparent;
  border-left: none;
  border: ${({ isSelectedInEditMode }) =>
    isSelectedInEditMode
      ? `1px solid ${themeCssVariables.color.blue}`
      : '1px solid transparent'};

  box-sizing: border-box;

  cursor: ${({ isSoon, isDragging }) =>
    isDragging ? 'grabbing' : isSoon ? 'default' : 'pointer'};
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 14px;
  height: 38px;
  margin-top: 1px;
  margin-bottom: 1px;
  min-width: 0;
  padding: ${({ isNavigationDrawerExpanded }) => (isNavigationDrawerExpanded ? '0 6px' : '0')};
  pointer-events: ${({ isSoon }) => (isSoon ? 'none' : 'auto')};
  text-decoration: none;
  user-select: none;
  transition: all 0.2s ease;
  width: ${({ isNavigationDrawerExpanded, hasRightOptions }) =>
      !isNavigationDrawerExpanded
        ? '38px'
        : `calc(100% - ${themeCssVariables.spacing['1.5']} + ${themeCssVariables.spacing[1]} + ${hasRightOptions ? themeCssVariables.spacing['0.5'] : themeCssVariables.spacing[1]})`};
  border-radius: 8px;
  justify-content: ${({ isNavigationDrawerExpanded }) => (!isNavigationDrawerExpanded ? 'center' : 'flex-start')};
  margin: ${({ isNavigationDrawerExpanded }) => (!isNavigationDrawerExpanded ? '2px auto' : '1px 0')};

  background: ${({ active }) => active ? '#DBEAFE' : 'transparent'};
  
  color: ${({ active, isSoon, variant }) => {
    if (active) return '#2563EB';
    if (variant === 'tertiary') return themeCssVariables.font.color.tertiary;
    if (isSoon) return themeCssVariables.font.color.light;
    return '#334155';
  }};

  font-weight: ${({ active }) => active ? '600' : '500'};

  &:hover {
    background: ${({ active }) => active ? '#DBEAFE' : '#EFF6FF'};
    color: ${({ active }) => active ? '#2563EB' : '#1D4ED8'};
  }
  
  &:hover svg {
    color: ${({ active }) => active ? '#2563EB' : '#1D4ED8'} !important;
    stroke: ${({ active }) => active ? '#2563EB' : '#1D4ED8'} !important;
  }
  
  &[aria-current="page"] svg {
    color: #2563EB !important;
    stroke: #2563EB !important;
  }

  &:hover .keyboard-shortcuts {
    visibility: visible;
  }

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    height: ${themeCssVariables.spacing[8]};
    width: ${({ isNavigationDrawerExpanded }) => (!isNavigationDrawerExpanded ? themeCssVariables.spacing[8] : '100%')};
  }
`;

const StyledItemElementsContainer = styled.div<{ isExpanded?: boolean }>`
  align-items: center;
  justify-content: ${({ isExpanded }) => (isExpanded === false ? 'center' : 'flex-start')};
  display: flex;
  width: 100%;
`;

const StyledLabelParent = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  min-width: 0px;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
`;

const StyledItemLabel = styled.span`
  font-weight: inherit;
  font-size: 14px;
  color: inherit;
`;

const StyledItemSecondaryLabel = styled.span`
  color: inherit;
  opacity: 0.8;
  font-weight: inherit;
`;

const StyledKeyBoardShortcut = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.strong};
  border-radius: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};

  height: ${themeCssVariables.spacing[4]};
  justify-content: center;
  width: ${themeCssVariables.spacing[4]};
`;

const StyledNavigationDrawerItemContainer = styled.div<{ isExpanded?: boolean }>`
  display: flex;
  width: 100%;
  justify-content: ${({ isExpanded }) => (isExpanded === false ? 'center' : 'flex-start')};
`;

const StyledSpacer = styled.span`
  flex-grow: 1;
`;

const StyledIcon = styled.div<{ $isExpanded?: boolean }>`
  align-items: center;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-right: ${({ $isExpanded }) => ($isExpanded === false ? '0' : '8px')};
`;

const StyledIconBackgroundTile = styled.div`
  align-items: center;
  background-color: ${themeCssVariables.grayScale.gray3};
  border-radius: 12px;
  display: flex;
  flex-shrink: 0;
  height: ${themeCssVariables.spacing[6]};
  justify-content: center;
  width: ${themeCssVariables.spacing[6]};
`;

const StyledRightOptionsContainer = styled.div`
  align-items: center;
  border-radius: 12px;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: ${themeCssVariables.spacing[6]};
  justify-content: center;
`;

const StyledRightOptionsVisbility = styled.div`
  clip-path: inset(1px);
  display: block;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  padding-left: ${themeCssVariables.spacing[2]};
  position: absolute;
  transition: opacity 150ms;
  white-space: nowrap;
  width: 1px;

  &[data-visible='true'],
  .navigation-drawer-item:hover & {
    clip-path: unset;
    display: flex;
    height: unset;
    opacity: 1;
    overflow: unset;
    position: unset;
    width: unset;
  }
`;

export const NavigationDrawerItem = ({
  className,
  label,
  secondaryLabel,
  indentationLevel = DEFAULT_INDENTATION_LEVEL,
  Icon,
  iconColor,
  withIconBackground = false,
  to,
  onClick,
  active,
  modifier,
  subItemState,
  rightOptions,
  alwaysShowRightOptions = false,
  isDragging,
  isRightOptionsDropdownOpen,
  triggerEvent,
  preventCollapseOnMobile = false,
  isSelectedInEditMode = false,
  variant = 'default',
}: NavigationDrawerItemProps) => {
  const { theme } = useContext(ThemeContext);
  const isMobile = useIsMobile();
  const isExpanded = useIsNavigationDrawerContentExpanded();
  const setIsNavigationDrawerExpanded = useSetAtomState(
    isNavigationDrawerExpandedState,
  );

  const { navigationItemId } = useNavigationDrawerTooltip(label, to);

  const isSoon = modifier === 'soon';
  const isNew = modifier === 'new';
  const keyboardKeys =
    isDefined(modifier) && typeof modifier === 'object'
      ? modifier.keyboard
      : undefined;

  const showBreadcrumb = indentationLevel === 2;
  const showStyledSpacer = isDefined(modifier) || isDefined(rightOptions);

  const handleMobileNavigation = () => {
    if (isMobile && !preventCollapseOnMobile) {
      setIsNavigationDrawerExpanded(false);
    }
  };

  const isExternalLink =
  isDefined(to) &&
  (to.startsWith('http://') || to.startsWith('https://'));

  const isInternalLink = isDefined(to) && !isExternalLink;



  const handleExternalLinkClick = () => {
    handleMobileNavigation();
    if (isDefined(to)) {
      window.open(to, '_blank', 'noopener,noreferrer');
    }
  };

  const {
    onClick: handleMouseDownNavigationClickClick,
    onMouseDown: handleMouseDown,
  } = useMouseDownNavigation({
    to: isExternalLink ? undefined : to,
    onClick: isExternalLink ? (onClick ?? handleExternalLinkClick) : onClick,
    onBeforeNavigation: handleMobileNavigation,
    triggerEvent,
  });

  const elementType = isExternalLink
    ? 'a'
    : isInternalLink
      ? Link
      : isDefined(rightOptions)
        ? 'div'
        : undefined;

  return (
    <StyledNavigationDrawerItemContainer isExpanded={isExpanded}>
      <StyledItem
        id={navigationItemId}
        data-tooltip-id={navigationItemId}
        className={`navigation-drawer-item ${active ? 'active' : ''} ${className || ''}`}
        onClick={handleMouseDownNavigationClickClick}
        onMouseDown={handleMouseDown}
        active={active}
        aria-current={isDefined(to) && active ? 'page' : undefined}
        isSoon={isSoon}
        variant={variant}
        indentationLevel={indentationLevel}
        isNavigationDrawerExpanded={isExpanded}
        isDragging={isDragging}
        hasRightOptions={isDefined(rightOptions)}
        isSelectedInEditMode={isSelectedInEditMode}
        as={elementType}
        role={!to && isDefined(rightOptions) ? 'button' : undefined}
        to={isInternalLink ? to : undefined}
        href={isExternalLink ? to : undefined}
        target={isExternalLink ? '_blank' : undefined}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
        draggable={isInternalLink ? false : undefined}
      >
        <StyledItemElementsContainer isExpanded={isExpanded}>
          {showBreadcrumb && (
            <NavigationDrawerAnimatedCollapseWrapper>
              <NavigationDrawerItemBreadcrumb state={subItemState} />
            </NavigationDrawerAnimatedCollapseWrapper>
          )}

          {Icon &&
            (isNonEmptyString(iconColor) ? (
              <StyledIcon $isExpanded={isExpanded}>
                <TintedIconTile Icon={Icon} color={iconColor} />
              </StyledIcon>
            ) : withIconBackground ? (
              <StyledIcon $isExpanded={isExpanded}>
                <StyledIconBackgroundTile>
                  <Icon
                    size={16}
                    stroke={theme.icon.stroke.md}
                    color={
                      showBreadcrumb && !isExpanded
                        ? theme.font.color.light
                        : 'currentColor'
                    }
                  />
                </StyledIconBackgroundTile>
              </StyledIcon>
            ) : (
              <StyledIcon $isExpanded={isExpanded}>
                <Icon
                  style={{
                    minWidth: 16,
                  }}
                  size={16}
                  stroke={theme.icon.stroke.md}
                  color={
                    showBreadcrumb && !isExpanded
                      ? theme.font.color.light
                      : 'currentColor'
                  }
                />
              </StyledIcon>
            ))}

          <NavigationDrawerAnimatedCollapseWrapper fullWidth>
            <StyledLabelParent>
              <OverflowingTextWithTooltip
                text={
                  <>
                    <StyledItemLabel>{label}</StyledItemLabel>
                    {secondaryLabel && (
                      <StyledItemSecondaryLabel>
                        {' · '}
                        {secondaryLabel}
                      </StyledItemSecondaryLabel>
                    )}
                  </>
                }
                tooltipContent={
                  secondaryLabel ? `${label} · ${secondaryLabel}` : label
                }
              />
            </StyledLabelParent>
          </NavigationDrawerAnimatedCollapseWrapper>

          {showStyledSpacer && <StyledSpacer />}

          {isSoon && (
            <NavigationDrawerAnimatedCollapseWrapper>
              <Pill label={t`Soon`} />
            </NavigationDrawerAnimatedCollapseWrapper>
          )}

          {isNew && (
            <NavigationDrawerAnimatedCollapseWrapper>
              <Pill label={t`New`} />
            </NavigationDrawerAnimatedCollapseWrapper>
          )}

          {isDefined(keyboardKeys) && (
            <NavigationDrawerAnimatedCollapseWrapper>
              <StyledKeyBoardShortcut className="keyboard-shortcuts">
                <Label>{keyboardKeys}</Label>
              </StyledKeyBoardShortcut>
            </NavigationDrawerAnimatedCollapseWrapper>
          )}

          {isDefined(rightOptions) && (
            <NavigationDrawerAnimatedCollapseWrapper>
              {/* When StyledItem renders as a Link, we need both handlers to
                  prevent navigation when interacting with rightOptions:
                  - onMouseDown: stops useMouseDownNavigation from calling navigate()
                  - onClickCapture: prevents the native <a> follow since the child's
                    stopPropagation blocks Link's own preventDefault */}
              <StyledRightOptionsContainer
                onMouseDown={(e) => e.stopPropagation()}
                onClickCapture={(e) => e.preventDefault()}
              >
                <StyledRightOptionsVisbility
                  data-visible={
                    isMobile ||
                    isRightOptionsDropdownOpen ||
                    alwaysShowRightOptions
                      ? 'true'
                      : undefined
                  }
                >
                  {rightOptions}
                </StyledRightOptionsVisbility>
              </StyledRightOptionsContainer>
            </NavigationDrawerAnimatedCollapseWrapper>
          )}
        </StyledItemElementsContainer>
      </StyledItem>

      {!isExpanded && !isMobile && (
        <AppTooltip
          anchorSelect={`[data-tooltip-id='${navigationItemId}']`}
          content={label}
          place={TooltipPosition.Right}
          delay={TooltipDelay.noDelay}
          positionStrategy="fixed"
          offset={16}
        />
      )}
    </StyledNavigationDrawerItemContainer>
  );
};
