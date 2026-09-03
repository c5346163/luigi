class DropdownKeyboardHelpersClass {
  constructor() {
    this.MENU_ITEM_SELECTOR = 'a.fd-menu__link';
  }

  isSpaceKey(event) {
    return event.key === ' ' || event.key === 'Spacebar' || event.code === 'Space';
  }

  isActivationKey(event) {
    return event.key === 'Enter' || this.isSpaceKey(event);
  }

  getMenuItems(root) {
    if (!root) {
      return [];
    }
    return Array.from(root.querySelectorAll(this.MENU_ITEM_SELECTOR)).filter((item) => {
      return item.getAttribute('aria-disabled') !== 'true' && !item.hasAttribute('disabled');
    });
  }

  applyRovingTabindex(items, focusedIndex) {
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === focusedIndex ? '0' : '-1');
    });
    if (items[focusedIndex]) {
      items[focusedIndex].focus();
    }
  }

  nextIndex(currentIndex, length, direction) {
    if (!length) {
      return -1;
    }
    if (currentIndex < 0) {
      return direction > 0 ? 0 : length - 1;
    }
    return (currentIndex + direction + length) % length;
  }

  handleMenuKeydown(event, { items = [], onEscape, onActivate } = {}) {
    const currentIndex = items.indexOf(document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      this.applyRovingTabindex(items, this.nextIndex(currentIndex, items.length, 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      this.applyRovingTabindex(items, this.nextIndex(currentIndex, items.length, -1));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.applyRovingTabindex(items, 0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.applyRovingTabindex(items, items.length - 1);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      if (onEscape) {
        onEscape();
      }
      return;
    }

    if (this.isSpaceKey(event) && currentIndex >= 0 && onActivate) {
      event.preventDefault();
      onActivate(items[currentIndex]);
    }
  }

  handleTriggerKeydown(event, { isOpen, isDisabled, isAnchor, onToggle, onFocusFirst, onFocusLast, onClose } = {}) {
    if (isDisabled) {
      if (this.isActivationKey(event) || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
      }
      return;
    }

    if (event.repeat && this.isActivationKey(event)) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Escape') {
      if (isOpen && onClose) {
        event.preventDefault();
        onClose();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      if (isOpen) {
        if (onFocusFirst) {
          onFocusFirst();
        }
      } else if (onToggle) {
        onToggle('first');
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      if (isOpen) {
        if (onFocusLast) {
          onFocusLast();
        }
      } else if (onToggle) {
        onToggle('last');
      }
      return;
    }

    if (this.isActivationKey(event) && isAnchor && onToggle) {
      event.preventDefault();
      onToggle();
    }
  }
}

export const DropdownKeyboardHelpers = new DropdownKeyboardHelpersClass();
