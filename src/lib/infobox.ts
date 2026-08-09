import type { ArticleKind, WikiLocale } from './config';

type FieldDefinition = { en: string; pt: string };

export const FIELD_LABELS: Record<string, FieldDefinition> = {
  type: { en: 'Type', pt: 'Tipo' },
  author: { en: 'Author', pt: 'Autor' },
  authors: { en: 'Authors', pt: 'Autores' },
  creator: { en: 'Creator', pt: 'Criador' },
  creators: { en: 'Creators', pt: 'Criadores' },
  debut: { en: 'Debut', pt: 'Estreia' },
  species: { en: 'Species', pt: 'Espécie' },
  pronouns: { en: 'Pronouns', pt: 'Pronomes' },
  role: { en: 'Role', pt: 'Função' },
  affiliation: { en: 'Affiliation', pt: 'Afiliação' },
  status: { en: 'Status', pt: 'Estado' },
  born: { en: 'Born', pt: 'Nascimento' },
  nationality: { en: 'Nationality', pt: 'Nacionalidade' },
  occupation: { en: 'Occupation', pt: 'Ocupação' },
  occupations: { en: 'Occupations', pt: 'Ocupações' },
  known_for: { en: 'Known for', pt: 'Conhecido por' },
  active_years: { en: 'Years active', pt: 'Anos de atividade' },
  location: { en: 'Location', pt: 'Localização' },
  coordinates: { en: 'Coordinates', pt: 'Coordenadas' },
  established: { en: 'Established', pt: 'Estabelecido' },
  jurisdiction: { en: 'Jurisdiction', pt: 'Jurisdição' },
  formed: { en: 'Formed', pt: 'Formação' },
  founded: { en: 'Founded', pt: 'Fundação' },
  founders: { en: 'Founders', pt: 'Fundadores' },
  headquarters: { en: 'Headquarters', pt: 'Sede' },
  key_people: { en: 'Key people', pt: 'Pessoas-chave' },
  parent: { en: 'Parent organization', pt: 'Organização controladora' },
  purpose: { en: 'Purpose', pt: 'Finalidade' },
  industry: { en: 'Industry', pt: 'Setor' },
  website: { en: 'Website', pt: 'Website' },
  system: { en: 'System', pt: 'Sistema' },
  leader: { en: 'Leader', pt: 'Líder' },
  seat: { en: 'Seat', pt: 'Sede' },
  predecessor: { en: 'Predecessor', pt: 'Antecessor' },
  successor: { en: 'Successor', pt: 'Sucessor' },
  focus: { en: 'Focus', pt: 'Foco' },
  initial_release: { en: 'Initial release', pt: 'Lançamento inicial' },
  latest_release: { en: 'Latest release', pt: 'Versão mais recente' },
  platform: { en: 'Platform', pt: 'Plataforma' },
  technologies: { en: 'Technologies', pt: 'Tecnologias' },
  repository: { en: 'Repository', pt: 'Repositório' },
  license: { en: 'License', pt: 'Licença' },
  date: { en: 'Date', pt: 'Data' },
  participants: { en: 'Participants', pt: 'Participantes' },
  outcome: { en: 'Outcome', pt: 'Resultado' },
  release: { en: 'Release', pt: 'Lançamento' },
  medium: { en: 'Medium', pt: 'Mídia' },
  developer: { en: 'Developer', pt: 'Desenvolvedor' },
  language: { en: 'Language', pt: 'Idioma' },
};

const COMMON = ['type', 'status', 'website'] as const;

export const INFOBOX_FIELDS: Record<ArticleKind, readonly string[]> = {
  character: ['creator', 'debut', 'species', 'pronouns', 'role', 'affiliation', ...COMMON],
  person: [
    'born',
    'nationality',
    'pronouns',
    'occupations',
    'affiliation',
    'known_for',
    'active_years',
    ...COMMON,
  ],
  place: ['type', 'location', 'coordinates', 'established', 'jurisdiction', 'status', 'website'],
  organization: [
    'type',
    'formed',
    'founders',
    'headquarters',
    'key_people',
    'purpose',
    'parent',
    'status',
    'website',
  ],
  company: [
    'type',
    'founded',
    'founders',
    'headquarters',
    'key_people',
    'industry',
    'parent',
    'status',
    'website',
  ],
  government: [
    'type',
    'jurisdiction',
    'system',
    'formed',
    'leader',
    'seat',
    'predecessor',
    'successor',
    'status',
    'website',
  ],
  project: [
    'type',
    'author',
    'authors',
    'creators',
    'formed',
    'focus',
    'affiliation',
    'status',
    'repository',
    'license',
    'website',
  ],
  software: [
    'developer',
    'initial_release',
    'latest_release',
    'platform',
    'technologies',
    'repository',
    'license',
    'status',
    'website',
  ],
  event: ['date', 'location', 'participants', 'outcome', 'status', 'website'],
  work: ['author', 'authors', 'creator', 'release', 'medium', 'language', 'status', 'website'],
  technology: ['developer', 'initial_release', 'technologies', 'license', 'status', 'website'],
  concept: ['type', 'author', 'authors', 'creator', 'debut', 'affiliation', 'website'],
  other: [],
};

export function fieldLabel(
  _kind: ArticleKind,
  key: string,
  locale: WikiLocale,
  customLabel?: string,
): string {
  if (customLabel) return customLabel;
  const definition = FIELD_LABELS[key];
  if (!definition) return key.replaceAll('_', ' ');
  return locale === 'pt-BR' ? definition.pt : definition.en;
}

export function fieldOrder(kind: ArticleKind, key: string): number {
  const index = INFOBOX_FIELDS[kind].indexOf(key);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export function isKnownField(kind: ArticleKind, key: string): boolean {
  return kind === 'other' || INFOBOX_FIELDS[kind].includes(key);
}
