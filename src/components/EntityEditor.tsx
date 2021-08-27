import React from 'react';
import { Button, Modal } from '@contentful/forma-36-react-components';
import { Entity } from '../types';

interface EntityEditorProps {
  show?: boolean;
  entity: Entity;
  onClose: () => void;
}

const EntityEditor = ({ entity, show = false, onClose }: EntityEditorProps) => {
  return (
    <>
      <Modal onClose={() => onClose()} title="Centered modal" isShown={show}>
        {() => (
          <>
            <Modal.Header title="Title" />
            <Modal.Content>Hello from controlled modal window</Modal.Content>
            <Modal.Controls>
              <Button buttonType="positive" onClick={() => onClose()}>
                Confirm
              </Button>
              <Button buttonType="muted" onClick={() => onClose()}>
                Close
              </Button>
            </Modal.Controls>
          </>
        )}
      </Modal>
    </>
  );
};

export default EntityEditor;
