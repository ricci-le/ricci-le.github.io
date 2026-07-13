export interface Note {
  id: string;
  slug: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  backlinks: string[];
  links: string[];
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  url: string;
  category: 'book' | 'article' | 'video' | 'tool' | 'course';
  topic: string;
  tags: string[];
  author?: string;
  year?: string;
}

export interface Tag {
  name: string;
  count: number;
  type: 'note' | 'resource';
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}
