import { Link } from '@/shared/components/common/link';
import dayjs from '@/shared/lib/dayjs';

import { Image } from '../../../../shared/components/common/image';
import { CompanyNews } from '../../interfaces/news.interface';

interface RelatedNewsProps {
  companyId: string;
  relatedNews: CompanyNews[];
}

export const RelatedNews = ({ companyId, relatedNews }: RelatedNewsProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <h3 className="font-bold mb-4">More News</h3>

      <div className="flex flex-col gap-4">
        {relatedNews.map((item) => (
          <Link
            key={item.id}
            to={`/companies/news/${item.id}`}
            className="flex gap-3 group hover:bg-muted p-2 rounded-md transition-colors">
            <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.title}
                wrapperClassName="group-hover:scale-110 transition-transform duration-300"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground">{dayjs(item.createdAt).format('MMM D, YYYY')}</p>
            </div>
          </Link>
        ))}

        <Link to={`/companies/${companyId}`} className="text-sm text-primary hover:underline block text-center mt-2">
          View All News
        </Link>
      </div>
    </div>
  );
};
