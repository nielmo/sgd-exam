import { cn } from '../utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toContain('text-red-500')
    expect(result).toContain('bg-blue-500')
  })

  it('handles conditional classes', () => {
    const result = cn('base-class', true && 'conditional-true', false && 'conditional-false')
    expect(result).toContain('base-class')
    expect(result).toContain('conditional-true')
    expect(result).not.toContain('conditional-false')
  })

  it('handles undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid')
    expect(result).toContain('base')
    expect(result).toContain('valid')
  })

  it('handles empty strings', () => {
    const result = cn('base', '', 'valid')
    expect(result).toContain('base')
    expect(result).toContain('valid')
  })

  it('merges conflicting Tailwind classes correctly', () => {
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })

  it('handles array inputs', () => {
    const result = cn(['text-red-500', 'bg-blue-500'])
    expect(result).toContain('text-red-500')
    expect(result).toContain('bg-blue-500')
  })

  it('handles object inputs', () => {
    const result = cn({
      'text-red-500': true,
      'bg-blue-500': false,
      'border-gray-300': true
    })
    expect(result).toContain('text-red-500')
    expect(result).not.toContain('bg-blue-500')
    expect(result).toContain('border-gray-300')
  })

  it('handles mixed input types', () => {
    const result = cn(
      'base-class',
      ['array-class'],
      { 'object-class': true, 'false-class': false },
      'string-class'
    )
    expect(result).toContain('base-class')
    expect(result).toContain('array-class')
    expect(result).toContain('object-class')
    expect(result).not.toContain('false-class')
    expect(result).toContain('string-class')
  })

  it('returns empty string for no inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles complex Tailwind merge scenarios', () => {
    const result = cn('px-2 py-1', 'p-3')
    expect(result).toBe('p-3')
  })

  it('preserves non-conflicting classes', () => {
    const result = cn('text-red-500 hover:text-red-600', 'bg-blue-500')
    expect(result).toContain('text-red-500')
    expect(result).toContain('hover:text-red-600')
    expect(result).toContain('bg-blue-500')
  })
})