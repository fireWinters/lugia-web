/**
 * 节流滚动HOC
 * create by ligx
 *
 * @flow
 */
import * as React from 'react';
import styled from 'styled-components';
import Scroller from './index';
import Widget from '../consts/index';
import { FontSizeNumber } from '../css';
import { toNumber } from '../common/NumberUtils';
import {
  BarDefaultSize,
  DefaultHeight,
  DefaultWidth,
  ScrollerContainer,
  Col,
  ScrollerCol,
} from '../css/scroller';
import { getCanSeeCount } from './support';
import { px2remcss } from '../css/units';

// const em = px2emcss(FontSizeNumber);

// const height = props => {
//   const { theme, totalSize, autoHeight = false } = props;
//   const { height: themeHeight } = theme;
//   if (!autoHeight) {
//     return themeHeight
//       ? `height:${px2remcss(themeHeight)};`
//       : `height:${px2remcss(DefaultHeight)};`;
//   }

//   if (!themeHeight || themeHeight > totalSize) {
//     return `height: ${px2remcss(totalSize)}`;
//   }
//   return `height: ${px2remcss(themeHeight)}`;
// };

const getActiveWidth = props => {
  const { theme } = props;

  const { width } = theme;
  return width;
};

// const width = props => {
//   const width = getActiveWidth(props);
//   return width ? `width:${px2remcss(width)};` : `width:${px2remcss(DefaultWidth)};`;
// };
// const getContentWidthValue = props => {
//   const width = getActiveWidth(props);
//   return width ? width - BarDefaultSize : DefaultWidth - BarDefaultSize;
// };

// const getContentWidth = props => {
//   const width = getContentWidthValue(props);
//   return px2remcss(width);
// };

// const scrollerLeft = props => {
//   return `left: ${getContentWidth(props)};`;
// };

// const Col = styled.div`
//   ${width};
//   font-size: ${FontSizeNumber}rem;
//   position: absolute;
//   display: inline-block;
// `;

// const ScrollerContainer = styled.div`
//   overflow: hidden;
//   font-size: ${FontSizeNumber}rem;
//   ${height};
//   ${width};
//   position: relative;
// `;

// const getOpacity = (props: Object) => {
//   const { isDrag } = props;
//   if (isDrag) {
//     return 'opacity: 1;';
//   }
//   return '';
// };
// const ScrollerCol = styled(Col)`
//   ${scrollerLeft};
//   width: ${px2remcss(BarDefaultSize)};
//   opacity: 0;
//   ${ScrollerContainer}:hover & {
//     opacity: 1;
//   }

//   ${getOpacity};
//   transition: opacity 0.3s;
// `;

type ThrottleScrollerState = {
  start: number,
};
export default (
  Target: React.ComponentType<any>,
  MenuItemHeight: number,
  TargetWrapName: string
) => {
  return class ThrottleScroller extends React.Component<any, ThrottleScrollerState> {
    static displayName = Widget.ThrottleScroller;
    static defaultProps = {
      mutliple: false,
      getTheme: () => {
        return {};
      },
    };
    scroller: ?Object;
    scrollerTarget: ?Object;

    itemHeight: number;

    isDrag: boolean;

    constructor(props: any) {
      super(props);
      this.state = {
        start: 0,
      };
      this.itemHeight = this.getActiveItemHeight(props);
    }

    getActiveItemHeight = (props: Object) => {
      const { menuItemHeight } = props;
      const menuItemHeightIsInProps = 'menuItemHeight' in props;
      return menuItemHeightIsInProps ? menuItemHeight : MenuItemHeight;
    };

    render() {
      const { props } = this;

      const start = this.getStart(props, this.state);
      const { level, autoHeight = false, getPartOfThemeProps } = props;
      const themeProps = getPartOfThemeProps(TargetWrapName);
      const totalSize = this.fetchTotalSize();
      themeProps.propsConfig = {
        isDrag: this.isDrag,
        autoHeight,
        totalSize,
      };
      const pack = (element: Object | Array<Object>) => {
        return (
          <ScrollerContainer themeProps={themeProps} onWheel={this.onWheel}>
            {element}
          </ScrollerContainer>
        );
      };

      if (!this.isNeedScroller()) {
        const { length } = this.getTarget();
        //TODO: 待测试
        return pack(
          <Target
            {...props}
            start={0}
            end={length}
            canSeeCount={length}
            ref={cmp => (this.scrollerTarget = cmp)}
          />
        );
      }

      const { type, step } = props;
      const viewSize = this.fetchViewSize();

      const end = this.fetchEnd(start);
      const canSeeCount = this.canSeeCount();
      const menuItemHeight = this.itemHeight;

      return pack([
        <Col themeProps={themeProps} level={level}>
          <Target
            {...props}
            canSeeCount={canSeeCount}
            start={start}
            end={end}
            ref={cmp => (this.scrollerTarget = cmp)}
          />
        </Col>,
        <ScrollerCol level={level} themeProps={themeProps} isDrag={this.isDrag}>
          <Scroller
            ref={cmp => (this.scroller = cmp)}
            type={type}
            onDrag={this.onDrag}
            value={menuItemHeight * start}
            viewSize={viewSize}
            totalSize={totalSize}
            onChange={this.onScroller}
            step={step}
          />
        </ScrollerCol>,
      ]);
    }

    onDrag = (drag: boolean) => {
      this.isDrag = drag;
    };

    getStart(props: Object, state: Object): number {
      const { length } = this.getTarget();

      const limitStart = (start: number) => {
        const maxStart = Math.max(0, length - this.canSeeCount() + 1);
        return Math.min(start, maxStart);
      };

      if ('start' in props) {
        const { start = 0 } = props;
        return limitStart(start);
      }

      const { start = 0 } = state;
      return limitStart(start);
    }

    isNeedScroller() {
      const { length } = this.getTarget();
      return this.canSeeCount() < length;
    }

    canSeeCount(): number {
      return getCanSeeCount(this.fetchViewSize(), this.itemHeight);
    }

    fetchViewSize = () => {
      const { autoHeight = false, getPartOfThemeConfig } = this.props;
      const { normal = {} } = getPartOfThemeConfig(TargetWrapName);
      let { height } = normal;
      height = !height && height !== 0 ? DefaultHeight : height;
      const { data = [] } = this.props;
      const allItemHeight = this.itemHeight * data.length;
      return autoHeight ? allItemHeight : height;
    };

    fetchTotalSize(): number {
      const { length } = this.getTarget();
      const { normal = {} } = this.props.getPartOfThemeConfig(TargetWrapName);
      const { padding = {} } = normal;
      const { top } = padding;

      return length * this.itemHeight + toNumber(top, 0) + 10;
    }

    getTarget(): Array<any> {
      const { data, children } = this.props;
      if (!data && !children) {
        return [];
      }
      return data ? data : children;
    }

    fetchEnd(start: number): number {
      const { length: maxLen } = this.getTarget();
      if (maxLen === 0) {
        return 0;
      }
      const seeCount = this.canSeeCount();

      return Math.min(seeCount + Math.max(start, 0), maxLen);
    }

    onWheel = (e: Object) => {
      if (this.isNeedScroller()) {
        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();
      }
      this.scroller && this.scroller.onWheel && this.scroller.onWheel.call(this.scroller, e);
    };

    onScroller = (value: number) => {
      const { onScroller } = this.props;

      const start = value / this.itemHeight;
      onScroller ? onScroller(start, this.fetchEnd(start)) : this.setState({ start });
    };
  };
};
