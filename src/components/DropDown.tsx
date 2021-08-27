import React from 'react';
import { Button, Dropdown, DropdownList, DropdownListItem } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

const DropDown = ({ onSelect = (type: 'string' | 'entity') => {} }) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      toggleElement={
        <Button
          size="small"
          buttonType="naked"
          onClick={() => setOpen(!isOpen)}
          icon="PlusCircle"
          style={{ marginTop: tokens.spacingS }}
        >
          Add Item
        </Button>
      }
    >
      <DropdownList>
        <DropdownListItem onClick={() => onSelect('entity')}>Entity</DropdownListItem>
        <DropdownListItem onClick={() => onSelect('string')}>Default</DropdownListItem>
      </DropdownList>
    </Dropdown>
  );
};

export default DropDown;
