import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import {
  Form,
  Button,
  Modal,
  TextField,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Icon,
  EditorToolbarButton,
} from '@contentful/forma-36-react-components';
import { Entity, Tag } from '../../types';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import List from '../List';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EntityEditorProps {
  show?: boolean;
  entity: Entity;
  onClose: () => void;
  onSave?: (entity: Entity) => void;
}

interface RowProps {
  data: Tag;
  keyChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  valueChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  deleteRow: MouseEventHandler;
}

const Editor = ({ entity: propEntity, show = false, onClose = () => {}, onSave = () => {} }: EntityEditorProps) => {
  const [currentEntity, setCurrentEntity] = useState(propEntity);
  useEffect(() => setCurrentEntity(propEntity), [propEntity]);
  return (
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
                <List items={currentEntity.data} onSort={(data) => setCurrentEntity((entity) => ({ ...entity, data }))}>
                  {currentEntity.data.map((data, i) => (
                    <Row
                      key={`editor-row-${i}`}
                      data={data}
                      keyChange={(e) =>
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
                      valueChange={(e) =>
                        setCurrentEntity((entity) => {
                          const updatedData = entity.data.concat();
                          updatedData.splice(i, 1, {
                            ...entity.data[i],
                            value: e.target.value,
                          });
                          return { ...entity, data: updatedData };
                        })
                      }
                      deleteRow={() => {
                        setCurrentEntity((entity) => {
                          const updatedData = entity.data.concat();
                          updatedData.splice(i, 1);
                          return { ...entity, data: updatedData };
                        });
                      }}
                    />
                  ))}
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
                        parseInt(currentEntity.data.reduce((prev, curr) => (prev.id > curr.id ? prev : curr)).id, 10) +
                          1
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
  );
};

const Row = ({ data, keyChange, valueChange, deleteRow }: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? '',
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className={css({
        boxShadow: isDragging ? '1px 1px 15px 0px rgba(0,0,0,0.5)' : undefined,
        position: 'relative',
        zIndex: isDragging ? 99999 : 0,
        borderBottom: '0.5px solid #cfd9e0',
      })}
    >
      <TableRow>
        <TableCell
          align="center"
          className={css({
            minHeight: 70,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '1.25rem',
            borderRight: '0.5px solid #cfd9e0',
            backgroundColor: '#f7f9fa'
          })}
        >
          <div
            {...attributes}
            {...listeners}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f7f9fa',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: 'all 250ms ease',
              '&:hover': {
                scale: '1.25',
              },
            })}
          >
            <Icon color={isDragging ? 'positive' : 'muted'} icon="Drag" />
          </div>
        </TableCell>
        <TableCell>
          <TextField
            id={data.key}
            name={data.key}
            key={`key-${data.id}`}
            value={data.key}
            labelText="Key"
            onChange={keyChange}
          />
        </TableCell>
        <TableCell>
          <TextField
            id={data.value}
            name={data.value}
            key={`value-${data.id}`}
            value={data.value}
            labelText="Value"
            onChange={valueChange}
          />
        </TableCell>
        <TableCell align="right">
          <EditorToolbarButton label="delete" icon="Delete" onClick={deleteRow} />
        </TableCell>
      </TableRow>
    </div>
  );
};

export default Editor;
