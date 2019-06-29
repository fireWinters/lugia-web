/**
 *
 * create by ligx
 *
 * @flow
 */
import * as React from 'react';
import Trigger from '../trigger';
import Widget from '../consts/index';
import type { TooltipProps, TooltipState } from '../css/tooltip';
import { Down, Left, Right, Up } from '../css/tooltip';
import colorsFunc from '../css/stateColor';
import ThemeHoc from '@lugia/theme-hoc';
import CSSComponent, { css, getBorder, StaticComponent, getBoxShadow } from '@lugia/theme-css-hoc';
import { units } from '@lugia/css';
import { addPropsConfig } from '../avatar';
const { px2remcss } = units;
const DefaultMessage = '默认信息';
const { defaultColor, blackColor, superLightColor } = colorsFunc();

const ToolTrigger: Object = CSSComponent({
  extend: Trigger,
  className: 'ToolTrigger',
  normal: {
    selectNames: [['margin'], ['padding']],
  },
  css: css`
    box-shadow: none;
  `,
});

const ContentWrapper: Object = CSSComponent({
  tag: 'div',
  className: 'TooltipContentWrapper',
  normal: {
    selectNames: [['margin'], ['padding'], ['width'], ['height'], ['opacity']],
    defaultTheme: {},
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { direction } = propsConfig;
      return `padding:${px2remcss(2)};padding-${direction}:${px2remcss(4)};`;
    },
  },
  css: css`
    position: relative;
  `,
});
const Content: Object = CSSComponent({
  tag: 'div',
  className: 'TooltipContent',
  normal: {
    selectNames: [['background'], ['opacity'], ['width'], ['height']],
    defaultTheme: {
      background: { color: superLightColor },
      boxShadow: getBoxShadow('0 0 0.6 rgba(0,0,0,0.15)'),
    },
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { height } = themeMeta;
      const { size, popArrowType } = propsConfig;
      const theHeight = height ? height : size === 'large' ? 40 : size === 'small' ? 24 : 32;
      if (popArrowType !== 'round')
        return {
          height: theHeight,
        };
    },
  },
  css: css`
    border-radius: ${px2remcss(5)};
    position: relative;
    line-height: 1;
    box-sizing: border-box;
    z-index: 2;
  `,
});

const Arrow: Object = CSSComponent({
  tag: 'div',
  className: 'ToolTipArrow',
  normal: {
    selectNames: [['fontSize'], ['color']],
    defaultTheme: {
      fonSize: 12,
      color: defaultColor,
    },
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { background = {} } = themeMeta;
      const { direction } = propsConfig;
      const bgColor = background && background.color ? background.colorcolor : superLightColor;
      switch (direction) {
        case Up:
          return `
        left: ${px2remcss(10)};
        top: ${px2remcss(-5)};
        border-width: 0 ${px2remcss(5)} ${px2remcss(5)};
        border-bottom-color: ${bgColor};
      `;
        case Down:
          return `
        left: ${px2remcss(10)};
        bottom: ${px2remcss(-3)};
        border-width: ${px2remcss(5)} ${px2remcss(5)} 0;
        border-top-color: ${bgColor};
      `;
        case Left:
          return `
        top: ${px2remcss(10)};
        left: ${px2remcss(-5)};
        border-width: ${px2remcss(5)} ${px2remcss(5)} ${px2remcss(5)} 0;
        border-right-color: ${bgColor};
      `;
        case Right:
          return `
        top: ${px2remcss(10)};
        right: ${px2remcss(-5)};
        border-width: ${px2remcss(5)} 0 ${px2remcss(5)} ${px2remcss(5)};
        border-left-color: ${bgColor};
      `;
        default:
          return '';
      }
    },
  },
  css: css`
    border-color: transparent;
    position: absolute;
    border-style: solid;
    line-height: 1;
  `,
});
const BaseArrow: Object = CSSComponent({
  tag: 'div',
  className: 'ToolTipBaseArrow',
  normal: {
    selectNames: [['background'], ['opacity']],
    defaultTheme: {},
    getCSS(themeMeta: Object, themeProps: Object): string {
      const { propsConfig } = themeProps;
      const { background = {} } = themeMeta;
      const bgColor = background && background.color ? background.color : superLightColor;

      const { direction, placement } = propsConfig;
      let angle = '';
      switch (direction) {
        case Up:
          angle = '45deg';
          break;
        case Down:
          angle = '225deg';
          break;
        case Left:
          angle = '315deg';
          break;
        case Right:
          angle = '135deg';
          break;
        default:
          break;
      }
      const theBottom = `top: ${px2remcss(-4)};`;
      const theTop = `bottom: ${px2remcss(-4)};`;
      const theLeft = `right: ${px2remcss(-4)};`;
      const theRight = `left: ${px2remcss(-4)};`;
      let arrowDirectionCSS = '';
      switch (placement) {
        case 'bottomLeft':
          arrowDirectionCSS = `left: ${px2remcss(10)};${theBottom}; `;
          break;
        case 'bottom':
          arrowDirectionCSS = `left: 46%;${theBottom}; `;
          break;
        case 'bottomRight':
          arrowDirectionCSS = `right: ${px2remcss(10)};${theBottom}; `;
          break;
        case 'topLeft':
          arrowDirectionCSS = `left: ${px2remcss(10)};${theTop};`;
          break;
        case 'top':
          arrowDirectionCSS = `left: 46%;${theTop};`;
          break;
        case 'topRight':
          arrowDirectionCSS = `right: ${px2remcss(10)};${theTop}; `;
          break;
        case 'rightTop':
          arrowDirectionCSS = `top: ${px2remcss(10)};${theRight}; `;
          break;
        case 'right':
          arrowDirectionCSS = `top: 46%;${theRight};`;
          break;
        case 'rightBottom':
          arrowDirectionCSS = `bottom: ${px2remcss(10)}; ${theRight};`;
          break;
        case 'leftTop':
          arrowDirectionCSS = `top: ${px2remcss(10)};${theLeft};`;
          break;
        case 'left':
          arrowDirectionCSS = ` top: 46%;${theLeft};`;
          break;
        case 'leftBottom':
          arrowDirectionCSS = ` bottom: ${px2remcss(10)}; ${theLeft};`;
          break;
        default:
          arrowDirectionCSS = '';
          break;
      }
      return `border-color: ${bgColor} transparent transparent ${bgColor};transform: rotateZ(${angle}); ${arrowDirectionCSS};`;
    },
  },
  css: css`
    position: absolute;
    border-style: solid;
    border-width: ${px2remcss(4)};
    border-top-left-radius: ${px2remcss(4)};
  `,
});

const NewArrow: Object = CSSComponent({
  extend: BaseArrow,
  className: 'ToolNewArrow',
  normal: {
    selectNames: [['background'], ['opacity']],
    defaultTheme: {},
  },
  css: css`
    box-shadow: 0 0 ${px2remcss(6)} rgba(0, 0, 0, 0.15);
    z-index: -1;
  `,
});
const MaskArrow: Object = CSSComponent({
  extend: BaseArrow,
  className: 'ToolMaskArrow',
  normal: {
    selectNames: [['background'], ['opacity']],
    defaultTheme: {},
  },
  css: css`
    z-index: 0;
  `,
});

const Message: Object = CSSComponent({
  tag: 'div',
  className: 'TooltipMessage',
  normal: {
    selectNames: [['color'], ['fontSize'], ['font']],
    defaultTheme: {
      color: blackColor,
      fontSize: 12,
    },
  },
  css: css`
    box-sizing: border-box;
    user-select: none;
    line-height: 1.5;
    overflow: hidden;
    padding: ${px2remcss(6)} ${px2remcss(8)};
    text-align: left;
    text-decoration: none;
  `,
});

export function hasVisibleInProps(props: Object) {
  return 'visible' in props;
}

export function processOnVisibleChange(visible: boolean) {
  const { onVisibleChange } = this.props;
  const isHasVisible = hasVisibleInProps(this.props);
  const theVisible = isHasVisible ? this.props.visible : visible;
  if (!isHasVisible) {
    this.setState({ visible: theVisible });
  }
  onVisibleChange && onVisibleChange(visible);
}

export function getStateFromProps(
  props: { visible: boolean, defaultVisible?: boolean },
  state: { visible: boolean }
) {
  const isHasVisibleProps = hasVisibleInProps(props);
  const hasDefaultVisibleInprops = 'defaultVisible' in props;
  if (!state) {
    const theVisible = isHasVisibleProps
      ? props.visible
      : hasDefaultVisibleInprops
      ? props.defaultVisible
      : false;
    return { visible: !!theVisible };
  }
  if (isHasVisibleProps) {
    return { visible: !!props.visible };
  }
  return { visible: state.visible };
}

class Tooltip extends React.Component<TooltipProps, TooltipState> {
  static displayName = Widget.Tooltip;

  static defaultProps = {
    getTheme() {
      return {};
    },
    defaultVisible: false,
    action: ['click'],
  };
  trigger: Object;
  static getDerivedStateFromProps(props: TooltipProps, state: TooltipState) {
    const hasVisibleInprops = 'visible' in props;
    const hasDefaultVisibleInprops = 'defaultVisible' in props;
    if (!state) {
      const theVisible = hasVisibleInprops
        ? props.visible
        : hasDefaultVisibleInprops
        ? props.defaultVisible
        : false;
      return { visible: theVisible };
    }
    if (hasVisibleInprops) {
      return { visible: props.visible };
    }
    return { visible: state.visible };
  }
  render() {
    const { placement, action, title, popArrowType, children = <div />, size, style } = this.props;
    const { visible } = this.state;
    const direction = this.getDirection(placement);
    const getTarget: Function = cmp => (this.trigger = cmp);
    const theTitle = title ? title : DefaultMessage;
    const contentThemeProps = addPropsConfig(this.props.getPartOfThemeProps('TooltipContainer'), {
      size,
      popArrowType,
    });
    const triggerThemeProps = addPropsConfig(this.props.getPartOfThemeProps('TooltipContainer'), {
      direction,
    });
    const messageThemeProps = addPropsConfig(this.props.getPartOfThemeProps('TooltipMessage'), {
      direction,
    });

    return (
      <ToolTrigger
        style={style}
        themeProps={triggerThemeProps}
        popupVisible={visible}
        align={placement}
        ref={getTarget}
        onPopupVisibleChange={this.onVisibleChange}
        action={action}
        direction={direction}
        _lugia_theme_style_={this.props._lugia_theme_style_}
        popup={
          <ContentWrapper themeProps={triggerThemeProps}>
            <Content
              themeProps={contentThemeProps}
              popArrowType={popArrowType}
              direction={direction}
              placement={placement}
            >
              {this.getArrow(direction)}
              <Message themeProps={messageThemeProps}>{theTitle}</Message>
            </Content>
          </ContentWrapper>
        }
      >
        {children}
      </ToolTrigger>
    );
  }

  getArrow(direction) {
    const { placement, popArrowType = 'round' } = this.props;
    const theThemeProps = addPropsConfig(this.props.getPartOfThemeProps('TooltipContainer'), {
      direction,
      placement,
    });
    if (popArrowType === 'round') {
      return [<NewArrow themeProps={theThemeProps} />, <MaskArrow themeProps={theThemeProps} />];
    }
    return <Arrow themeProps={theThemeProps} />;
  }

  getDirection = (placement: string) => {
    if (!placement) {
      return;
    }

    if (placement.startsWith(Left)) return Right;
    if (placement.startsWith(Right)) return Left;
    if (placement.startsWith(Down)) return Up;
    if (placement.startsWith(Up)) return Down;
  };
  onVisibleChange = (visible: boolean) => {
    processOnVisibleChange.call(this, visible);
  };
}

export default ThemeHoc(Tooltip, Widget.Tooltip);
