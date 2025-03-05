import { type Either, left, right } from './either'

function doSomething(shouldBoolean: boolean): Either<string, string> {
  if (shouldBoolean) {
    return right('success')
  }
  return left('error')
}

test('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
