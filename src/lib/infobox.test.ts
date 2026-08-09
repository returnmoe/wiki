import { describe, expect, it } from 'vitest';
import { fieldLabel, isKnownField } from './infobox';

describe('infobox fields', () => {
  it('labels publication authors separately from creators', () => {
    expect(fieldLabel('concept', 'author', 'en')).toBe('Author');
    expect(fieldLabel('concept', 'authors', 'en')).toBe('Authors');
    expect(fieldLabel('concept', 'author', 'pt-BR')).toBe('Autor');
    expect(fieldLabel('concept', 'authors', 'pt-BR')).toBe('Autores');
    expect(isKnownField('concept', 'authors')).toBe(true);
    expect(isKnownField('project', 'author')).toBe(true);
    expect(isKnownField('work', 'authors')).toBe(true);
  });

  it('keeps creator terminology for characters', () => {
    expect(fieldLabel('character', 'creator', 'en')).toBe('Creator');
    expect(isKnownField('character', 'creator')).toBe(true);
    expect(isKnownField('character', 'authors')).toBe(false);
  });
});
