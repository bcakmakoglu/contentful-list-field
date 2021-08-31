import React from 'react';
import { Button, Dropdown, DropdownList, DropdownListItem } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

interface DropDownProps {
  onSelect: (type: 'entity' | 'string') => void;
  onToggle?: (open: boolean) => void;
}

const DropDown = ({ onSelect = () => {}, onToggle = () => {} }: DropDownProps) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      toggleElement={
        <Button
          size="small"
          buttonType="naked"
          onClick={() => {
            onToggle(!isOpen);
            setOpen(!isOpen);
          }}
          icon="PlusCircle"
          style={{ marginTop: tokens.spacingS }}
        >
          Add Item
        </Button>
      }
    >
      <DropdownList>
        <DropdownListItem
          onClick={() => {
            onSelect('entity');
            onToggle(false);
            setOpen(() => false);
          }}
        >
          Entity
        </DropdownListItem>
        <DropdownListItem
          onClick={() => {
            onSelect('string');
            onToggle(false);
            setOpen(() => false);
          }}
        >
          Default
        </DropdownListItem>
      </DropdownList>
    </Dropdown>
  );
};

export default DropDown;
