const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const PRONOUNS = [
  { arabic: 'أنا',   romanized: 'ana',    english: 'I' },
  { arabic: 'إنتَ',  romanized: 'inte',   english: 'you (m.)' },
  { arabic: 'إنتِ',  romanized: 'inti',   english: 'you (f.)' },
  { arabic: 'هو',    romanized: 'huwwe',  english: 'he' },
  { arabic: 'هي',    romanized: 'hiyye',  english: 'she' },
  { arabic: 'نحنا',  romanized: 'niHna',  english: 'we' },
  { arabic: 'إنتو',  romanized: 'intu',   english: 'you (pl.)' },
  { arabic: 'هم',    romanized: 'humme',  english: 'they' },
];

export const TENSES = ['present', 'past', 'imperative', 'negative imperative', 'future', 'past continuous'];

export const IMPERATIVE_ONLY_PRONOUNS = ['you (m.)', 'you (f.)', 'you (pl.)'];

const TENSE_NOTES = {
  present:             'present tense (habitual/ongoing action)',
  past:                'simple past tense',
  imperative:          'imperative (direct command) — e.g. "Collect!" — 2nd person only',
  'negative imperative': 'negative imperative ("Don\'t ___!") — uses ما + imperfect, 2nd person only',
  future:              'future tense using رح (raH) before the present form — e.g. رح يجمع',
  'past continuous':   'past continuous ("was ___-ing") using كان + present form — e.g. كان بيجمع',
};

export async function gradeConjugation(card, pronoun, tense, userAnswer) {
  const prompt = `You are a Levantine Arabic dialect tutor (Lebanese/Syrian dialect).

Verb: "${card.english}"
Base form (3rd person m. singular present tense): ${card.arabic} / ${card.romanized}

The student must conjugate this verb for: ${pronoun.arabic} (${pronoun.english}) in ${tense} tense, in Levantine Arabic dialect.

Tense note: ${TENSE_NOTES[tense]}

Student's answer: "${userAnswer}"

Accept both Arabic script and romanized transliteration. Allow minor romanization spelling variations. Be strict about correctness of the actual conjugated form.

Respond with valid JSON only, no markdown or code fences:
{
  "correct": true or false,
  "correct_arabic": "the correct Arabic script form",
  "correct_romanized": "the correct romanized transliteration",
  "feedback": "one short sentence — confirm if right, or explain what was wrong"
}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq ${res.status}: ${body}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Empty response: ${JSON.stringify(data)}`);
  return JSON.parse(text);
}
