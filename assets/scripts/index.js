'use strict';

validateRegistrationForm();

function validateRegistrationForm() {
  const form = document.forms.registation;
  const button = form.button;
  const requiredFields = [];

  let checkedAll = false;

  for (let elem of form.elements) {
    const attributeName = elem.name;

    if (
      attributeName === 'name' ||
      attributeName === 'email' ||
      attributeName === 'age' ||
      attributeName === 'password'
    ) {
      requiredFields.push(elem);

      addValidationHandler(elem, attributeName, 'input');

      addFocusHandler(elem, attributeName);
      addBlurHandler(elem, attributeName);
    } else if (
      attributeName === 'sex' ||
      attributeName === 'profession' ||
      attributeName === 'agreement'
    ) {
      requiredFields.push(elem);

      addValidationHandler(elem, attributeName, 'change');
    }
  }

  form.addEventListener('input', e => {
    const name = e.target.name;

    if (
      name === 'name' ||
      name === 'email' ||
      name === 'age' ||
      name === 'password'
    ) {
      checkedAll = requiredFields.every(item =>
        item.classList.contains('correctField')
      );

      button.disabled = !checkedAll;
    }
  });

  form.addEventListener('change', e => {
    const name = e.target.name;

    if (name === 'sex' || name === 'profession' || name === 'agreement') {
      checkedAll = requiredFields.every(item =>
        item.classList.contains('correctField')
      );

      button.disabled = !checkedAll;
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    requiredFields.forEach(item => {
      if (item.name === 'sex' && !item.checked) {
        return;
      }

      console.log(item.value);
    });

    form.reset();

    button.disabled = true;
  });

  form.addEventListener('reset', () => {
    const constraints = document.querySelectorAll('.registation__item');

    for (let constraint of constraints) {
      removeCorrectIcon(constraint);
    }
    requiredFields.forEach(item => markField(item, false));
  });
}

function addValidationHandler(elem, attributeName, event) {
  const handlers = {
    nameHandler(elem) {
      const value = elem.value.trim();
      const constraintsList = getConstraintsItems(attributeName);
      const [lengthItem, patternItem] = constraintsList;
      const nameRegex = /^[A-Za-zА-Яа-яЁё]+( ?[A-Za-zА-Яа-яЁё]+)+$/;

      let checked = true;

      if (value.length >= 2 && value.length <= 20) {
        addCorrectIcon(lengthItem);
      } else {
        removeCorrectIcon(lengthItem);
        checked = false;
      }

      if (nameRegex.test(value)) {
        addCorrectIcon(patternItem);
      } else {
        removeCorrectIcon(patternItem);
        checked = false;
      }

      markField(elem, checked);
    },

    emailHandler(elem) {
      const value = elem.value.trim();
      const constraintsList = getConstraintsItems(attributeName);
      const [patternItem] = constraintsList;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let checked = true;

      if (emailRegex.test(value)) {
        addCorrectIcon(patternItem);
      } else {
        removeCorrectIcon(patternItem);
        checked = false;
      }

      markField(elem, checked);
    },

    ageHandler(elem) {
      const value = elem.value.trim();
      const constraintsList = getConstraintsItems(attributeName);
      const [patternItem] = constraintsList;

      let checked = true;

      if (value !== '' && isFinite(value) && value >= 14 && value <= 100) {
        addCorrectIcon(patternItem);
      } else {
        removeCorrectIcon(patternItem);
        checked = false;
      }

      markField(elem, checked);
    },

    sexHandler() {
      const radioButtons = document.querySelectorAll('[name="sex"]');
      const checked = true;

      for (let radio of radioButtons) {
        markField(radio, checked);
      }
    },

    professionHandler(elem) {
      const value = elem.value;
      const checked = value || false;
      markField(elem, checked);
    },

    passwordHandler(elem) {
      const value = elem.value.trim();
      const constraintsList = getConstraintsItems(attributeName);
      const [lengthItem, patternItem] = constraintsList;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]+$/;

      let checked = true;

      if (value.length >= 8) {
        addCorrectIcon(lengthItem);
      } else {
        removeCorrectIcon(lengthItem);
        checked = false;
      }

      if (passwordRegex.test(value)) {
        addCorrectIcon(patternItem);
      } else {
        removeCorrectIcon(patternItem);
        checked = false;
      }

      markField(elem, checked);
    },

    agreementHandler(elem) {
      const checked = elem.checked;
      markField(elem, checked);
    }
  };

  elem.addEventListener(event, () => handlers[`${attributeName}Handler`](elem));
}

function getConstraintsItems(attributeName) {
  const list = getConstraintsList(attributeName);
  const items = list.querySelectorAll('li');

  return items;
}

function getConstraintsList(attributeName) {
  const list = document.querySelector(`#constraints-${attributeName}`);

  return list;
}

function addCorrectIcon(constraint) {
  const rightIcon = constraint.querySelector('.registation__item-icon');

  rightIcon.classList.remove('registation__item-icon_hidden');
}

function removeCorrectIcon(constraint) {
  const rightIcon = constraint.querySelector('.registation__item-icon');

  rightIcon.classList.add('registation__item-icon_hidden');
}

function markField(elem, checked) {
  if (checked) {
    elem.style.outline = '2px solid green';
    elem.classList.add('correctField');
  } else {
    elem.style.outline = '';
    elem.classList.remove('correctField');
  }
}

function addFocusHandler(elem, attributeName) {
  const handler = () => {
    const constraints = getConstraintsList(attributeName);
    constraints.style.maxHeight = '1000px';
  };

  elem.addEventListener('focus', handler);
}

function addBlurHandler(elem, attributeName) {
  const handler = () => {
    const constraints = getConstraintsList(attributeName);
    constraints.style.maxHeight = '';
  };

  elem.addEventListener('blur', handler);
}
