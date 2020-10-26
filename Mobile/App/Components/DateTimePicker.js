// just copy this code from the driving repo :)
import React, {Component} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default class DateTimePicker extends Component {
  render() {
    const {isOpen, onConfirm, onCancel, mode, date, ...props} = this.props;

    return (
      <DateTimePickerModal
        isVisible={isOpen}
        mode={mode}
        onConfirm={(date) => onConfirm && onConfirm(date)}
        onCancel={() => onCancel && onCancel()}
        date={date}
        {...props}
      />
    );
  }
}
