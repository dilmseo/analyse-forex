import { parseString } from 'xml2js';
import type { NewsItem } from '../types/news';

export const parseNewsXML = async (xml: string): Promise<NewsItem[]> => {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const items = result.rss.channel[0].item.map((item: any) => ({
        title: item.title[0].replace('<![CDATA[', '').replace(']]>', ''),
        link: item.link[0],
        pubDate: item.pubDate[0],
        creator: item['dc:creator'][0].replace('<![CDATA[', '').replace(']]>', ''),
        category: item.category[0].replace('<![CDATA[', '').replace(']]>', ''),
        description: item.description[0].replace('<![CDATA[', '').replace(']]>', '')
      }));

      resolve(items);
    });
  });
};