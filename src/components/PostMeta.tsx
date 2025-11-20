import { formatNumber } from '@/lib/utils';

interface PostMetaProps {
  date: string;
  readingTime: string;
  views?: number;
}

export default function PostMeta({ date, readingTime, views }: PostMetaProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#6e6e73]">
      <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      <span className="text-[#d2d2d7]">•</span>
      <span>{readingTime}</span>
      {views !== undefined && views > 0 && (
        <>
          <span className="text-[#d2d2d7]">•</span>
          <span>{formatNumber(views)} {views === 1 ? 'view' : 'views'}</span>
        </>
      )}
    </div>
  );
}
