import { allTopics } from './syllabus';

export interface TopicContent {
  id: string;
  moduleId: string;
  title: string;
  priority: 'hot' | 'warm' | 'normal';
  estimatedMinutes: number;
  overview: string;
  whyItMatters: string;
  explanation: string;
  keyPoints: string[];
  codeExample?: string;
  codeLanguage?: string;
  realWorldExample: string;
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: { q: string; a: string }[];
  revisionSummary: string;
  tags: string[];
}

export function getTopicContent(topicId: string): TopicContent | undefined {
  try {
    return require(`./contents/${topicId}.json`);
  } catch (error) {
    return undefined;
  }
}

export function getModuleTopics(moduleId: string): TopicContent[] {
  const moduleTopics = allTopics.filter(t => t.moduleId === moduleId);
  const contents: TopicContent[] = [];
  for (const t of moduleTopics) {
    const c = getTopicContent(t.id);
    if (c) contents.push(c);
  }
  return contents;
}
