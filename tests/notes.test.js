const request = require('supertest')
const { app, resetNotes } = require('../app')

describe('Integration Tests: Notes REST API', () => {

  beforeEach(() => {
    resetNotes()
  })

  test('GET /api/notes should return all notes as JSON', async () => {
    const response = await request(app)
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(3)
    expect(response.body[0].content).toBe('HTML is easy')
  })

  test('GET /api/notes/:id should return a specific note for valid ID', async () => {
    const response = await request(app)
      .get('/api/notes/1')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.content).toBe('HTML is easy')
    expect(response.body.id).toBe(1)
  })

  test('GET /api/notes/:id should return 404 for non-existent ID', async () => {
    const response = await request(app)
      .get('/api/notes/999')
      .expect(404)
    expect(response.status).toBe(404)
  })

  test('POST /api/notes should create a new note with valid content', async () => {
    const newNote = {
      content: 'DevOps is awesome',
      important: true
    }

    const response = await request(app)
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.content).toBe(newNote.content)
    expect(response.body.important).toBe(true)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('date')

    const getResponse = await request(app).get('/api/notes')
    expect(getResponse.body).toHaveLength(4)
  })

  test('POST /api/notes should return 400 Bad Request if content is missing', async () => {
    const invalidNote = {
      important: true
    }

    const response = await request(app)
      .post('/api/notes')
      .send(invalidNote)
      .expect(400)

    expect(response.body.error).toBe('content missing')
  })

  test('DELETE /api/notes/:id should return 204 and remove the note', async () => {
    await request(app)
      .delete('/api/notes/2')
      .expect(204)

    const response = await request(app)
      .get('/api/notes/2')
      .expect(404)
    expect(response.status).toBe(404)
  })
})
