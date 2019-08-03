import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
Number.isInteger =
  Number.isInteger ||
  function(value) {
    return (
      typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
    )
  }
const randomNumber = () => {
  return Math.random()
    .toFixed(15)
    .slice(2)
}

class Widget extends Component {
  constructor(props) {
    super(props)
    if (props.hasCustomGradientColor) {
      this.fillId = `widgetGrad${randomNumber()}`
    }
  }

  get widgetContainerStyle() {
    const {
      changeRating,
      widgetSpacing,
      isFirstWidget,
      isLastWidget,
      ignoreInlineStyles
    } = this.props

    const widgetContainerStyle = {
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'middle',
      paddingLeft: isFirstWidget ? undefined : widgetSpacing,
      paddingRight: isLastWidget ? undefined : widgetSpacing,
      cursor: changeRating ? 'pointer' : undefined
    }
    return ignoreInlineStyles ? {} : widgetContainerStyle
  }

  get widgetSvgStyle() {
    const {
      ignoreInlineStyles,
      isCurrentHoveredWidget,
      widgetDimension
    } = this.props
    const widgetSvgStyle = {
      width: widgetDimension,
      height: widgetDimension,
      transition: 'transform .2s ease-in-out',
      transform: isCurrentHoveredWidget ? 'scale(1.1)' : undefined
    }

    return ignoreInlineStyles ? {} : widgetSvgStyle
  }

  get pathStyle() {
    const {
      isSelected,
      isPartiallyFullWidget,
      isHovered,
      hoverMode,
      widgetEmptyColor,
      widgetRatedColor,
      widgetHoverColor,
      gradientPathName,
      inheritFillId,
      ignoreInlineStyles
    } = this.props

    let fill
    if (hoverMode) {
      if (isHovered) fill = widgetHoverColor
      else fill = widgetEmptyColor
    } else {
      if (isPartiallyFullWidget)
        fill = `url('${gradientPathName}#${this.fillId || inheritFillId}')`
      else if (isSelected) fill = widgetRatedColor
      else fill = widgetEmptyColor
    }

    const pathStyle = {
      fill: fill,
      transition: 'fill .2s ease-in-out'
    }

    return ignoreInlineStyles ? {} : pathStyle
  }

  get widgetClasses() {
    const {
      isSelected,
      isPartiallyFullWidget,
      isHovered,
      isCurrentHoveredWidget,
      ignoreInlineStyles
    } = this.props

    const widgetClasses = classNames({
      'widget-svg': true,
      'widget-selected': isSelected,
      'multi-widget-selected': isPartiallyFullWidget,
      hovered: isHovered,
      'current-hovered': isCurrentHoveredWidget
    })

    return ignoreInlineStyles ? {} : widgetClasses
  }

  stopColorStyle(color) {
    const stopColorStyle = {
      stopColor: color,
      stopOpacity: '1'
    }
    return this.props.ignoreInlineStyles ? {} : stopColorStyle
  }

  get offsetValue() {
    const selectedRating = this.props.selectedRating
    const ratingIsInteger = Number.isInteger(selectedRating)
    let offsetValue = '0%'
    if (!ratingIsInteger) {
      const firstTwoDecimals = selectedRating
        .toFixed(2)
        .split('.')[1]
        .slice(0, 2)
      offsetValue = `${firstTwoDecimals}%`
    }
    return offsetValue
  }

  get renderIndividualGradient() {
    const { widgetRatedColor, widgetEmptyColor } = this.props
    return (
      <defs>
        <linearGradient id={this.fillId} x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop
            offset='0%'
            className='stop-color-first'
            style={this.stopColorStyle(widgetRatedColor)}
          />
          <stop
            offset={this.offsetValue}
            className='stop-color-first'
            style={this.stopColorStyle(widgetRatedColor)}
          />
          <stop
            offset={this.offsetValue}
            className='stop-color-final'
            style={this.stopColorStyle(widgetEmptyColor)}
          />
          <stop
            offset='100%'
            className='stop-color-final'
            style={this.stopColorStyle(widgetEmptyColor)}
          />
        </linearGradient>
      </defs>
    )
  }

  render() {
    const {
      changeRating,
      hoverOverWidget,
      unHoverOverWidget,
      inheritFillId,
      svgIconViewBox,
      svgIconPath,
      svg,
      hasCustomGradientColor
    } = this.props
    let customSvg = svg
    if (React.isValidElement(customSvg)) {
      customSvg = React.cloneElement(customSvg, {
        ...this.props,
        fillId: this.fillId || inheritFillId
      })
    }
    return (
      <div
        className='widget-container'
        style={this.widgetContainerStyle}
        onMouseEnter={hoverOverWidget}
        onMouseLeave={unHoverOverWidget}
        onClick={changeRating}>
        {customSvg ? (
          customSvg
        ) : (
          <svg
            viewBox={svgIconViewBox}
            className={this.widgetClasses}
            style={this.widgetSvgStyle}>
            {hasCustomGradientColor ? this.renderIndividualGradient : null}
            <path className='widget' style={this.pathStyle} d={svgIconPath} />
          </svg>
        )}
      </div>
    )
  }
}

Widget.propTypes = {
  selectedRating: PropTypes.number,
  changeRating: PropTypes.func,
  hoverOverWidget: PropTypes.func,
  unHoverOverWidget: PropTypes.func,
  inheritFillId: PropTypes.string,
  isSelected: PropTypes.bool,
  isHovered: PropTypes.bool,
  isCurrentHoveredWidget: PropTypes.bool,
  isPartiallyFullWidget: PropTypes.bool,
  isFirstWidget: PropTypes.bool,
  isLastWidget: PropTypes.bool,
  hoverMode: PropTypes.bool,
  hasCustomGradientColor: PropTypes.bool,

  // customizable
  svgIconPath: PropTypes.string,
  svgIconViewBox: PropTypes.string,
  svg: PropTypes.node,
  widgetRatedColor: PropTypes.string,
  widgetEmptyColor: PropTypes.string,
  widgetHoverColor: PropTypes.string,
  widgetDimension: PropTypes.string,
  widgetSpacing: PropTypes.string
}

class Ratings extends Component {
  constructor(props) {
    super(props)
    this.fillId = `widgetGrad${randomNumber()}`
    this.state = {
      highestWidgetHovered: -Infinity
    }
  }
  static Widget = Widget

  get widgetRatingsStyle() {
    const widgetRatingsStyle = {
      position: 'relative',
      boxSizing: 'border-box',
      display: 'inline-block'
    }
    return this.props.ignoreInlineStyles ? {} : widgetRatingsStyle
  }

  get widgetGradientStyle() {
    const widgetGradientStyle = {
      position: 'absolute',
      zIndex: '0',
      width: '0',
      height: '0',
      visibility: 'hidden'
    }
    return this.props.ignoreInlineStyles ? {} : widgetGradientStyle
  }

  stopColorStyle(color) {
    const stopColorStyle = {
      stopColor: color,
      stopOpacity: '1'
    }
    return this.props.ignoreInlineStyles ? {} : stopColorStyle
  }

  get titleText() {
    const { typeOfWidget, rating: selectedRating } = this.props
    const hoveredRating = this.state.highestWidgetHovered
    const currentRating = hoveredRating > 0 ? hoveredRating : selectedRating
    // fix it at 2 decimal places and remove trailing 0s
    let formattedRating = parseFloat(currentRating.toFixed(2)).toString()
    if (Number.isInteger(currentRating)) {
      formattedRating = String(currentRating)
    }
    let widgetText = `${typeOfWidget}s`
    if (formattedRating === '1') {
      widgetText = typeOfWidget
    }
    return `${formattedRating} ${widgetText}`
  }

  get offsetValue() {
    const rating = this.props.rating
    const ratingIsInteger = Number.isInteger(rating)
    let offsetValue = '0%'
    if (!ratingIsInteger) {
      const firstTwoDecimals = rating
        .toFixed(2)
        .split('.')[1]
        .slice(0, 2)
      offsetValue = `${firstTwoDecimals}%`
    }
    return offsetValue
  }

  unHoverOverWidget = () => {
    this.setState({
      highestWidgetHovered: -Infinity
    })
  }

  hoverOverWidget = rating => {
    return () => {
      this.setState({
        highestWidgetHovered: rating
      })
    }
  }

  get childrenWithRatingState() {
    const {
      changeRating,
      rating: selectedRating,
      children,
      ignoreInlineStyles,
      gradientPathName,
      widgetEmptyColors,
      widgetHoverColors,
      widgetRatedColors,
      widgetDimensions,
      widgetSpacings,
      svgIconPaths,
      svgIconViewBoxes,
      svgs
    } = this.props
    const { highestWidgetHovered } = this.state

    const numberOfWidgets = children.length
    return React.Children.map(children, (child, index) => {
      const {
        svgIconPath,
        svgIconViewBox,
        widgetHoverColor,
        widgetEmptyColor,
        widgetRatedColor,
        widgetDimension,
        widgetSpacing,
        svg
      } = child.props

      const widgetRating = index + 1
      const isSelected = widgetRating <= selectedRating

      // hovered only matters when changeRating is true
      const hoverMode = highestWidgetHovered > 0
      const isHovered = widgetRating <= highestWidgetHovered
      const isCurrentHoveredWidget = widgetRating === highestWidgetHovered

      // only matters when changeRating is false
      // given widget 5 and rating 4.2:  5 > 4.2 && 4 < 4.2;
      const isPartiallyFullWidget =
        widgetRating > selectedRating && widgetRating - 1 < selectedRating

      const isFirstWidget = widgetRating === 1
      const isLastWidget = widgetRating === numberOfWidgets

      return React.cloneElement(child, {
        selectedRating: selectedRating,
        ignoreInlineStyles,
        gradientPathName,
        changeRating: changeRating ? () => changeRating(widgetRating) : null,
        hoverOverWidget: changeRating
          ? this.hoverOverWidget(widgetRating)
          : null,
        unHoverOverWidget: changeRating ? this.unHoverOverWidget : null,
        inheritFillId: this.fillId,
        isSelected,
        isHovered,
        isCurrentHoveredWidget,
        isPartiallyFullWidget,
        isFirstWidget,
        isLastWidget,
        hoverMode,
        hasCustomGradientColor:
          (widgetRatedColor || widgetEmptyColor) && isPartiallyFullWidget,
        svgIconPath: svgIconPath || svgIconPaths,
        svgIconViewBox: svgIconViewBox || svgIconViewBoxes,
        widgetHoverColor: widgetHoverColor || widgetHoverColors,
        widgetEmptyColor: widgetEmptyColor || widgetEmptyColors,
        widgetRatedColor: widgetRatedColor || widgetRatedColors,
        widgetDimension: widgetDimension || widgetDimensions,
        widgetSpacing: widgetSpacing || widgetSpacings,
        svg: svg || svgs
      })
    })
  }

  render() {
    const { widgetEmptyColors, widgetRatedColors } = this.props

    return (
      <div
        className='widget-ratings'
        title={this.titleText}
        style={this.widgetRatingsStyle}>
        <svg className='widget-grad' style={this.widgetGradientStyle}>
          <defs>
            <linearGradient id={this.fillId} x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop
                offset='0%'
                className='stop-color-first'
                style={this.stopColorStyle(widgetRatedColors)}
              />
              <stop
                offset={this.offsetValue}
                className='stop-color-first'
                style={this.stopColorStyle(widgetRatedColors)}
              />
              <stop
                offset={this.offsetValue}
                className='stop-color-final'
                style={this.stopColorStyle(widgetEmptyColors)}
              />
              <stop
                offset='100%'
                className='stop-color-final'
                style={this.stopColorStyle(widgetEmptyColors)}
              />
            </linearGradient>
          </defs>
        </svg>
        {this.childrenWithRatingState}
      </div>
    )
  }
}

Ratings.propTypes = {
  rating: PropTypes.number.isRequired,
  typeOfWidget: PropTypes.string.isRequired,
  changeRating: PropTypes.func,
  gradientPathName: PropTypes.string.isRequired,
  ignoreInlineStyles: PropTypes.bool.isRequired,
  svgIconPaths: PropTypes.string.isRequired,
  svgIconViewBoxes: PropTypes.string.isRequired,
  widgetRatedColors: PropTypes.string.isRequired,
  widgetEmptyColors: PropTypes.string.isRequired,
  widgetHoverColors: PropTypes.string.isRequired,
  widgetDimensions: PropTypes.string.isRequired,
  widgetSpacings: PropTypes.string.isRequired,
  svgs: PropTypes.node
}

Ratings.defaultProps = {
  rating: 0,
  typeOfWidget: 'Star',
  changeRating: null,
  ignoreInlineStyles: false,
  gradientPathName: '',
  svgIconPaths: 'm25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z',
  svgIconViewBoxes: '0 0 51 48',
  widgetRatedColors: 'rgb(109, 122, 130)',
  widgetEmptyColors: 'rgb(203, 211, 227)',
  widgetHoverColors: 'rgb(230, 67, 47)',
  widgetDimensions: '50px',
  widgetSpacings: '7px'
}

export default Ratings
