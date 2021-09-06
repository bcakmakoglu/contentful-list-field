import React, {useEffect, useState} from 'react';
import {
  Form,
  Button,
  Modal,
  TextField,
  Table,
  TableRow,
  TableCell,
  TableBody,
  EditorToolbarButton,
} from '@contentful/forma-36-react-components';
import { Entity } from '../../types';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import List from '../List';

interface EntityEditorProps {
  show?: boolean;
  entity: Entity;
  onClose: () => void;
  onSave?: (entity: Entity) => void;
}

const Editor = ({
  entity: propEntity,
  show = false,
  onClose = () => {},
  onSave = () => {},
}: EntityEditorProps) => {
  const [currentEntity, setCurrentEntity] = useState(propEntity);
  useEffect(() => setCurrentEntity(propEntity), [propEntity]);
  return (
    <>
      <Modal
        allowHeightOverflow={true}
        shouldCloseOnEscapePress={true}
        size="large"
        onClose={() => onClose()}
        title={currentEntity.id}
        isShown={show}
      >
        {() => (
          <>
            <Modal.Header title={`Entity ${currentEntity.title}`} />
            <Modal.Content>
              <Form>
                <TextField
                  id="title"
                  name="title"
                  value={currentEntity.title}
                  labelText="Title"
                  onChange={(e) =>
                    setCurrentEntity((entity) => {
                      return { ...entity, title: e.target.value };
                    })
                  }
                />
              </Form>
              <Table>
                <TableBody>
                  <List
                    items={currentEntity.data}
                    onSort={(data) => setCurrentEntity((entity) => ({ ...entity, data }))}
                  >
                    {currentEntity.data.map((data, i) => {
                      return (
                        <TableRow key={`entity-row-${i}`}>
                          <TableCell>
                            <TextField
                              id={data.key}
                              name={data.key}
                              key={`key-${i}`}
                              value={data.key}
                              labelText="Key"
                              onChange={(e) =>
                                setCurrentEntity((entity) => {
                                  const updatedData = entity.data.concat();
                                  updatedData.splice(i, 1, {
                                    ...entity.data[i],
                                    key: e.target.value,
                                  });
                                  return {
                                    ...entity,
                                    data: updatedData,
                                  };
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              id={data.value}
                              name={data.value}
                              key={`value-${i}`}
                              value={data.value}
                              labelText="Value"
                              onChange={(e) =>
                                setCurrentEntity((entity) => {
                                  const updatedData = entity.data.concat();
                                  updatedData.splice(i, 1, {
                                    ...entity.data[i],
                                    value: e.target.value,
                                  });
                                  return { ...entity, data: updatedData };
                                })
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            <EditorToolbarButton
                              label="delete"
                              icon="Delete"
                              onClick={() => {
                                setCurrentEntity((entity) => {
                                  const updatedData = entity.data.concat();
                                  updatedData.splice(i, 1);
                                  return { ...entity, data: updatedData };
                                });
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </List>
                </TableBody>
              </Table>
            </Modal.Content>
            <Modal.Controls>
              <div
                className={css({
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                  justifyContent: 'center',
                })}
              >
                <div>
                  <Button
                    size="small"
                    buttonType="naked"
                    icon="PlusCircle"
                    onClick={() => {
                      const currentData = currentEntity.data.concat();
                      let id = `0`;
                      if (currentData.length > 0) {
                        id = String(
                          parseInt(
                            currentEntity.data.reduce((prev, curr) => (prev.id > curr.id ? prev : curr)).id,
                            10
                          ) + 1
                        );
                      }
                      currentData.push({ id, key: '', value: '' });
                      setCurrentEntity((entity) => ({ ...entity, data: currentData }));
                    }}
                    style={{ marginTop: tokens.spacingS }}
                  >
                    Add Field
                  </Button>
                </div>
                <div
                  className={css({
                    marginTop: tokens.spacingM,
                    marginLeft: tokens.spacingS,
                  })}
                >
                  <Button
                    buttonType="positive"
                    onClick={() => {
                      onSave(currentEntity);
                      onClose();
                    }}
                  >
                    Save
                  </Button>
                  <Button buttonType="muted" onClick={() => onClose()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal.Controls>
          </>
        )}
      </Modal>
    </>
  );
};

export default Editor;
