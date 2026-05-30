const { generateId } = require('../utils')

describe('Unit Tests: generateId Helper', () => {

  test('should return 1 when notes list is empty', () => {
    const emptyNotes = []
    const nextId = generateId(emptyNotes)
    expect(nextId).toBe(1)
  })

  test('should return maxId + 1 when notes exist', () => {
    const existingNotes = [
      { id: 1, content: 'Test Note 1' },
      { id: 2, content: 'Test Note 2' },
      { id: 3, content: 'Test Note 3' }
    ]
    const nextId = generateId(existingNotes)
    expect(nextId).toBe(4)
  })

  test('should return correct next ID even if IDs are out of order', () => {
    const unorderedNotes = [
      { id: 5, content: 'High ID' },
      { id: 1, content: 'Low ID' },
      { id: 3, content: 'Middle ID' }
    ]
    const nextId = generateId(unorderedNotes)
    expect(nextId).toBe(6)
  })
})
