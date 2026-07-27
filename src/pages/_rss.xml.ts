import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');
  
  return rss({
    title: 'Davide Paolino | Blog',
    description: 'Notes and insights on physics of active matter, statistical mechanics, and complex systems.',
    site: context.site || 'https://paolinodavide.github.io',
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
