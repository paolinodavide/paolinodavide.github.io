import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { getCollection } from 'astro:content';

export interface SearchItem {
  id: string;
  title: string;
  url: string;
  category: 'Page' | 'Blog Post' | 'Publication' | 'CV & Experience';
  description?: string;
  subtitle?: string;
  keywords?: string;
}

// BibTeX parser helper
function parseBibtex(text: string) {
  const entries: any[] = [];
  const parts = text.split(/^\s*@/m);
  for (const part of parts) {
    if (!part.trim()) continue;
    const typeMatch = part.match(/^(\w+)\s*\{\s*([^,]+),/);
    if (!typeMatch) continue;
    const type = typeMatch[1];
    const key = typeMatch[2];
    
    const bodyStart = part.indexOf('{') + 1;
    const body = part.slice(bodyStart, part.lastIndexOf('}'));
    
    const fields: any = { type, key };
    const fieldRegex = /(\w+)\s*=\s*(?:\{([\s\S]*?)\}|"([\s\S]*?)"|([^\n,]+))/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(body)) !== null) {
      const name = fieldMatch[1].toLowerCase().trim();
      let value = fieldMatch[2] || fieldMatch[3] || fieldMatch[4] || '';
      value = value.trim().replace(/^\{|\}$/g, '').trim();
      fields[name] = value;
    }
    entries.push(fields);
  }
  return entries;
}

export async function getSearchIndex(): Promise<SearchItem[]> {
  const items: SearchItem[] = [
    {
      id: 'page-about',
      title: 'About Me',
      url: '/',
      category: 'Page',
      description: 'PhD Candidate in Physics at Gulliver Lab ESPCI Paris. Active matter, statistical physics, glassiness.',
      keywords: 'davide paolino home bio active matter statistical physics gulliver espci berthier'
    },
    {
      id: 'page-publications',
      title: 'Publications',
      url: '/publications',
      category: 'Page',
      description: 'Academic articles, preprints, and research papers by Davide Paolino.',
      keywords: 'papers publications research articles'
    },
    {
      id: 'page-cv',
      title: 'Curriculum Vitae (CV)',
      url: '/cv',
      category: 'Page',
      description: 'Academic journey, research experience, education, and technical skills.',
      keywords: 'cv resume experience education skills awards thesis'
    },
    /* {
      id: 'page-blog',
      title: 'Blog',
      url: '/blog',
      category: 'Page',
      description: 'Notes, articles, and thoughts on statistical physics and complex systems.',
      keywords: 'blog articles posts thoughts'
    } */
  ];

  // 1. Index Blog Posts (Commented out)
  /* try {
    const blogPosts = await getCollection('blog');
    blogPosts.forEach((post) => {
      const tags = Array.isArray(post.data.tags) ? post.data.tags.join(' ') : post.data.tags || '';
      const categories = Array.isArray(post.data.categories) ? post.data.categories.join(' ') : post.data.categories || '';
      items.push({
        id: `blog-${post.id}`,
        title: post.data.title,
        url: `/blog/${post.id}`,
        category: 'Blog Post',
        description: post.data.description || 'Blog entry by Davide Paolino',
        subtitle: post.data.date ? new Date(post.data.date).toISOString().split('T')[0] : '',
        keywords: `${tags} ${categories}`
      });
    });
  } catch (e) {
    console.error('Error indexing blog posts:', e);
  } */

  // 2. Index Publications
  try {
    const bibPath = path.resolve('src/data/papers.bib');
    if (fs.existsSync(bibPath)) {
      const bibFile = fs.readFileSync(bibPath, 'utf8');
      const publications = parseBibtex(bibFile);
      publications.forEach((pub) => {
        const targetUrl = pub.doi ? `https://doi.org/${pub.doi}` : (pub.url || '/publications');
        const authors = pub.author ? pub.author.replace(/\s+and\s+/g, ', ') : '';
        const journalYear = [pub.publisher || pub.journal || pub.abbr, pub.year].filter(Boolean).join(' • ');
        
        items.push({
          id: `pub-${pub.key}`,
          title: pub.title || 'Untitled Publication',
          url: targetUrl,
          category: 'Publication',
          description: pub.abstract ? pub.abstract.slice(0, 160) + '...' : `Authors: ${authors}`,
          subtitle: journalYear,
          keywords: `${authors} ${pub.keywords || ''} ${pub.publisher || ''} ${pub.journal || ''}`
        });
      });
    }
  } catch (e) {
    console.error('Error indexing publications:', e);
  }

  // 3. Index CV Entries
  try {
    const cvPath = path.resolve('src/data/cv.yml');
    if (fs.existsSync(cvPath)) {
      const cvFile = fs.readFileSync(cvPath, 'utf8');
      const cvData = YAML.parse(cvFile);
      cvData.forEach((section: any) => {
        if (section.contents && Array.isArray(section.contents)) {
          section.contents.forEach((entry: any, index: number) => {
            if (entry.title) {
              const subtitleParts = [entry.institution, entry.year].filter(Boolean);
              const desc = Array.isArray(entry.description)
                ? entry.description.join(' ')
                : (entry.description || '');
              
              items.push({
                id: `cv-${section.title}-${index}`,
                title: entry.title,
                url: '/cv',
                category: 'CV & Experience',
                description: desc.slice(0, 160),
                subtitle: `${section.title} | ${subtitleParts.join(' • ')}`,
                keywords: `${section.title} ${entry.institution || ''} ${desc}`
              });
            } else if (entry.items && Array.isArray(entry.items)) {
              // Skill items
              items.push({
                id: `cv-skill-${index}`,
                title: `${entry.title}: ${entry.items.join(', ')}`,
                url: '/cv',
                category: 'CV & Experience',
                subtitle: `Technical Skills`,
                keywords: `skills ${entry.title} ${entry.items.join(' ')}`
              });
            }
          });
        }
      });
    }
  } catch (e) {
    console.error('Error indexing CV:', e);
  }

  return items;
}
