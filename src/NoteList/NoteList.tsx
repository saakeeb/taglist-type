import React, { useState, useMemo } from 'react';
import { Badge, Button, Card, Col, Form, Modal, ModalTitle, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from "react-select";
import { Note, Tag } from '../App';
import styles from "../NoteList.module.css";

type SimplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}

type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
    onUpdateTag: (id: string, label: string)=> void
    onDeleteTag: (id: string)=> void
}

type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onUpdateTag: (id: string, label: string) => void
    onDeleteTag: (id: string) => void
}

const NoteList = ({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [editTagsModal, setEditTagsModal] = useState(false);
    const [title, setTitle] = useState("");

    const filterNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
            )
        })
    }, [title, selectedTags, notes]);

    return (
        <>
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to={"/new"}>
                            <Button variant='primary'>Create</Button>
                        </Link>
                        <Button
                            variant='outline-secondary'
                            onClick={() => setEditTagsModal(true)}
                        >Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row>
                    <Col className='mb-4'>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type='text'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                isMulti
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {
                    filterNotes.map(note => (
                        <Col key={note.id}>
                            <NoteCard
                                id={note.id}
                                title={note.title}
                                tags={note.tags}
                            />
                        </Col>
                    ))
                }
            </Row>
            <EditTagsModal
                show={editTagsModal}
                handleClose={()=> setEditTagsModal(false)}
                availableTags={availableTags}
                onUpdateTag={onUpdateTag}
                onDeleteTag={onDeleteTag}
            />
        </>
    );
};

export default NoteList;

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`} >
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className='fs-5'>{title}</span>
                    {
                        tags.length > 0 && (
                            <Stack
                                gap={1}
                                direction="horizontal"
                                className='justify-content-center flex-wrap'
                            >
                                {
                                    tags.map(tag => (
                                        <Badge className='text-truncate' key={tag.id}>
                                            {tag.label}
                                        </Badge>
                                    ))
                                }
                            </Stack>
                        )
                    }
                </Stack>
            </Card.Body>
        </Card>
    )
}

function EditTagsModal({
    availableTags,
    show,
    handleClose,
    onDeleteTag,
    onUpdateTag
}: EditTagsModalProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <ModalTitle>Edit Tags</ModalTitle>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control
                                        type='text'
                                        value={tag.label}
                                        onChange={e=> onUpdateTag(tag.id, e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant='outline-danger'
                                        onClick={()=> onDeleteTag(tag.id)}
                                    >
                                        &times;
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    )
}