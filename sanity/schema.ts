
{ name: 'achievement', title: 'Academic achievement', type: 'document', fields: [{ name: 'title', type: 'string', validation: (Rule: any) => Rule.required() }, { name: 'institution', type: 'string' }, { name: 'year', type: 'number' }, { name: 'description', type: 'text' }, image] },
