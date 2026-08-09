# Contributing

The published `master` branch is the reference edition of the wiki. Corrections and additions can
be proposed through an issue or a pull request at <https://github.com/returnmoe/wiki>.

## Raw Git workflow

```sh
git clone https://github.com/returnmoe/wiki.git
cd wiki
git switch master
git pull --ff-only
git switch -c article/short-description
npm install
npm run verify
git add src/content public/media
git commit -m "Describe the wiki change"
git push -u origin article/short-description
```

Open a pull request from the new branch into `master`. The project does not require the GitHub CLI.

## Articles

- The wiki is centered on return moe but is not limited to subjects created or owned by it.
  Partner-created characters, collaborators, external organizations, independent projects,
  third-party software, and outside research may be documented when they provide material context.
- State why an external subject is relevant, and identify its actual creator, owner, developer, or
  affiliation. Inclusion must not imply that the subject belongs to or represents return moe.
- English articles live at `src/content/articles/en/{kind}/{id}.md`.
- Optional Brazilian Portuguese translations live at
  `src/content/articles/pt/{kind}/{id}.md` and use the same article ID.
- IDs are lowercase kebab-case and must not change merely because an article is renamed.
- Put ordinary prose, headings, tables, lists, and references in Markdown. Do not use MDX, raw HTML,
  scripts, or iframes.
- Cite factual claims with named Markdown footnotes placed immediately after the supported text.
  Define each cited source under `References`; do not add detached bibliography bullets or unused
  footnote definitions.
- Increment an English article's `revision` whenever its summary, infobox, or prose changes. A
  Portuguese translation records the English revision it represents in `translatedFromRevision`.

## Categories

Categories describe the article's subject and its defining domains, not every entity, topic, or
artifact mentioned in the article.

- Assign a subject category only when the subject itself is a member. An organization that develops
  software belongs to Organizations, not Software; a framework about fictional characters belongs to
  Philosophy, not Characters.
- Use Research for a field, method, study, experiment, benchmark, model, or purpose-built research
  tool. Do not apply it to an organization merely because the organization conducts research.
- Use topical categories only when the topic is central to the subject. Incidental use of AI or a
  passing connection to a research project does not establish category membership.
- Multiple categories are appropriate when the subject genuinely spans them, such as research
  software that is also a named project.
- Order categories from most specific to broadest. Put a subject category such as Characters,
  Organizations, Projects, or Software first; put Artificial Intelligence last when it is combined
  with a more specific category.
- Keep an article's English and Brazilian Portuguese category IDs in the same order.

## Authoritative articles

The wiki is descriptive by default. Add `authoritative: true` only when return moe intends the
article itself to serve as an official primary source for the subject's lore, worldbuilding, or an
explicitly stated return moe conceptual framework. The flag renders the visible authoritative
notice; without that notice, readers must not infer the status from the subject, category, creator,
owner, or related articles.

Even an article about a character created by return moe can remain untagged when another work, such
as a visual novel, is intended to be the controlling source. The designation is therefore an
explicit editorial decision, not an automatic property of character articles or return moe
subjects. See [Authoritative articles](https://wiki.return.moe/authoritative-articles/) for the
reader-facing policy.

## Infobox values

Values may be plain text, a list of text values, or a linked object:

```yaml
infobox:
  image:
    src: /media/characters/example/portrait.jpg
    alt: Description of the portrait
    license: Unlicense
  fields:
    - key: creator
      value:
        text: Example Person
        article: example-person
    - key: website
      value:
        text: Official website
        url: https://example.com
```

Known field names and their order are defined in `src/lib/infobox.ts`. Use `kind: other` and provide
`label` on a field only when none of the standard templates fits.

Use `author` or `authors` for people credited with a paper, study, or other authored publication.
Reserve `creator` or `creators` for subjects such as characters, projects, and artifacts, where the
relationship is creation rather than authorship. Match the singular or plural key to the value.

## Article galleries

An article can reserve a gallery or list artwork through frontmatter. An empty item list renders a
designed placeholder until media is added:

```yaml
gallery:
  items: []
```

Gallery images use the same metadata as infobox images. Store them below `public/media/` and add an
item for each image:

```yaml
gallery:
  items:
    - src: /media/characters/example/artwork-title.jpg
      alt: Accessible description of the artwork
      caption: Artwork title
      credit: Artist name
      sourceUrl: https://example.com/original
      license: Used with permission
```

By submitting a contribution, you agree to release it under the repository's Unlicense unless an
asset carries explicitly documented alternative terms.
