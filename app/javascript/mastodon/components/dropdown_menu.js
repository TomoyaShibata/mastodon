import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import IconButton from './icon_button';
import { Overlay } from 'react-overlays';
import { Motion, spring } from 'react-motion';

class DropdownMenu extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    items: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    placement: PropTypes.string.isRequired,
    arrowOffsetLeft: PropTypes.number.isRequired,
    arrowOffsetTop: PropTypes.number.isRequired,
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, false);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, false);
  }

  setRef = c => {
    this.node = c;
  }

  handleClick = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const { action, to } = this.props.items[i];

    this.props.onClose();

    if (typeof action === 'function') {
      e.preventDefault();
      action();
    } else if (to) {
      e.preventDefault();
      this.context.router.history.push(to);
    }
  }

  renderItem (option, i) {
    if (option === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }

    const { text, href = '#' } = option;

    return (
      <li className='dropdown-menu__item' key={`${text}-${i}`}>
        <a href={href} target='_blank' rel='noopener' role='button' tabIndex='0' autoFocus={i === 0} onClick={this.handleClick} data-index={i}>
          {text}
        </a>
      </li>
    );
  }

  render () {
    const { items, style, placement, arrowOffsetLeft, arrowOffsetTop } = this.props;

    return (
      <Motion defaultStyle={{ opacity: 0, scaleX: 0.85, scaleY: 0.75 }} style={{ opacity: spring(1, { damping: 35, stiffness: 400 }), scaleX: spring(1, { damping: 35, stiffness: 400 }), scaleY: spring(1, { damping: 35, stiffness: 400 }) }}>
        {({ opacity, scaleX, scaleY }) => (
          <div className='dropdown-menu' style={{ ...style, opacity: opacity, transform: `scale(${scaleX}, ${scaleY})` }} ref={this.setRef}>
            <div className={`dropdown-menu__arrow ${placement}`} style={{ left: arrowOffsetLeft, top: arrowOffsetTop }} />

            <ul>
              {items.map((option, i) => this.renderItem(option, i))}
            </ul>
          </div>
        )}
      </Motion>
    );
  }

}

export default class Dropdown extends React.PureComponent {

  static propTypes = {
    icon: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    size: PropTypes.number.isRequired,
    ariaLabel: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    ariaLabel: 'Menu',
  };

  state = {
    expanded: false,
  };

  handleClick = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  handleClose = () => {
    this.setState({ expanded: false });
  }

  handleKeyDown = e => {
    switch(e.key) {
    case 'Enter':
      this.handleClick();
      break;
    case 'Escape':
      this.handleClose();
      break;
    }
  }

  setTargetRef = c => {
    this.target = c;
  }

  findTarget = () => {
    return this.target;
  }

  render () {
    const { icon, items, size, ariaLabel, disabled } = this.props;
    const { expanded } = this.state;

    return (
      <div onKeyDown={this.handleKeyDown}>
        <IconButton
          icon={icon}
          title={ariaLabel}
          active={expanded}
          disabled={disabled}
          size={size}
          ref={this.setTargetRef}
          onClick={this.handleClick}
        />

        <Overlay show={expanded} placement='bottom' target={this.findTarget}>
          <DropdownMenu items={items} onClose={this.handleClose} />
        </Overlay>
      </div>
    );
  }

}
